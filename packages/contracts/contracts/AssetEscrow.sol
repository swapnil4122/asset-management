// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

/**
 * @title AssetEscrow
 * @notice Time-locked escrow for asset NFT transactions.
 *         Buyer deposits ETH, seller transfers NFT, then funds release.
 */
contract AssetEscrow is ReentrancyGuard {
  // =========================================================
  // Types
  // =========================================================
  enum EscrowState {
    CREATED,
    FUNDED,
    RELEASED,
    REFUNDED,
    DISPUTED
  }

  struct EscrowDeal {
    address buyer;
    address seller;
    address nftContract;
    uint256 tokenId;
    uint256 price; // wei
    uint256 deadline; // unix timestamp
    EscrowState state;
  }

  // =========================================================
  // State
  // =========================================================
  uint256 private _dealCounter;
  mapping(uint256 => EscrowDeal) public deals;

  address public immutable arbiter; // dispute resolver

  // =========================================================
  // Events
  // =========================================================
  event EscrowCreated(uint256 indexed dealId, address buyer, address seller, uint256 price);
  event EscrowFunded(uint256 indexed dealId, uint256 amount);
  event EscrowReleased(uint256 indexed dealId);
  event EscrowRefunded(uint256 indexed dealId);
  event EscrowDisputed(uint256 indexed dealId);

  // =========================================================
  // Constructor
  // =========================================================
  constructor(address arbiter_) {
    require(arbiter_ != address(0), 'Invalid arbiter');
    arbiter = arbiter_;
  }

  // =========================================================
  // Deal Creation
  // =========================================================
  function createDeal(
    address seller,
    address nftContract,
    uint256 tokenId,
    uint256 price,
    uint256 deadlineSeconds
  ) external returns (uint256 dealId) {
    require(seller != address(0) && seller != msg.sender, 'Invalid seller');
    require(price > 0, 'Price must be > 0');
    require(deadlineSeconds >= 1 hours, 'Deadline too short');

    dealId = _dealCounter++;
    deals[dealId] = EscrowDeal({
      buyer: msg.sender,
      seller: seller,
      nftContract: nftContract,
      tokenId: tokenId,
      price: price,
      deadline: block.timestamp + deadlineSeconds,
      state: EscrowState.CREATED
    });

    emit EscrowCreated(dealId, msg.sender, seller, price);
  }

  /**
   * @notice Buyer funds the escrow (sends exact ETH).
   */
  function fund(uint256 dealId) external payable nonReentrant {
    EscrowDeal storage deal = deals[dealId];
    require(deal.buyer == msg.sender, 'Not buyer');
    require(deal.state == EscrowState.CREATED, 'Invalid state');
    require(msg.value == deal.price, 'Incorrect ETH');
    require(block.timestamp < deal.deadline, 'Expired');

    deal.state = EscrowState.FUNDED;
    emit EscrowFunded(dealId, msg.value);
  }

  /**
   * @notice Seller transfers NFT; funds release to seller.
   */
  function release(uint256 dealId) external nonReentrant {
    EscrowDeal storage deal = deals[dealId];
    require(deal.state == EscrowState.FUNDED, 'Not funded');
    require(block.timestamp < deal.deadline, 'Expired');

    // Seller must have approved this contract for the NFT
    IERC721(deal.nftContract).safeTransferFrom(deal.seller, deal.buyer, deal.tokenId);
    deal.state = EscrowState.RELEASED;

    (bool sent, ) = payable(deal.seller).call{ value: deal.price }('');
    require(sent, 'ETH transfer failed');

    emit EscrowReleased(dealId);
  }

  /**
   * @notice Buyer can refund if deadline has passed and state is FUNDED.
   */
  function refund(uint256 dealId) external nonReentrant {
    EscrowDeal storage deal = deals[dealId];
    require(deal.state == EscrowState.FUNDED, 'Not funded');
    require(block.timestamp >= deal.deadline, 'Deadline not passed');
    require(deal.buyer == msg.sender, 'Not buyer');

    deal.state = EscrowState.REFUNDED;

    (bool sent, ) = payable(deal.buyer).call{ value: deal.price }('');
    require(sent, 'Refund failed');

    emit EscrowRefunded(dealId);
  }

  /**
   * @notice Either party can raise a dispute.
   */
  function dispute(uint256 dealId) external {
    EscrowDeal storage deal = deals[dealId];
    require(deal.state == EscrowState.FUNDED, 'Not funded');
    require(msg.sender == deal.buyer || msg.sender == deal.seller, 'Not a party');
    deal.state = EscrowState.DISPUTED;
    emit EscrowDisputed(dealId);
  }

  /**
   * @notice Arbiter resolves a dispute by choosing winner.
   */
  function resolve(uint256 dealId, bool releaseToBuyer) external nonReentrant {
    require(msg.sender == arbiter, 'Not arbiter');
    EscrowDeal storage deal = deals[dealId];
    require(deal.state == EscrowState.DISPUTED, 'Not disputed');

    address recipient = releaseToBuyer ? deal.buyer : deal.seller;
    deal.state = releaseToBuyer ? EscrowState.REFUNDED : EscrowState.RELEASED;

    (bool sent, ) = payable(recipient).call{ value: deal.price }('');
    require(sent, 'Resolution transfer failed');
  }
}
