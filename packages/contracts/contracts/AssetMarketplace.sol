// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * @title AssetMarketplace
 * @notice Decentralised marketplace for buying and selling asset NFTs.
 *         Supports direct ETH payments and a configurable platform fee.
 */
contract AssetMarketplace is ReentrancyGuard, Ownable {
  // =========================================================
  // Types
  // =========================================================
  struct Listing {
    address seller;
    address nftContract;
    uint256 tokenId;
    uint256 price; // in wei
    bool active;
  }

  // =========================================================
  // State
  // =========================================================
  uint256 public platformFeePercent = 250; // 2.5% (basis points)
  uint256 public constant MAX_FEE = 1000; // 10%

  uint256 private _listingIdCounter;
  mapping(uint256 => Listing) public listings;

  // =========================================================
  // Events
  // =========================================================
  event Listed(
    uint256 indexed listingId,
    address indexed seller,
    address nftContract,
    uint256 tokenId,
    uint256 price
  );
  event Sale(
    uint256 indexed listingId,
    address indexed buyer,
    address indexed seller,
    uint256 tokenId,
    uint256 price
  );
  event ListingCancelled(uint256 indexed listingId, address indexed seller);
  event FeeUpdated(uint256 newFee);

  // =========================================================
  // Constructor
  // =========================================================
  constructor(address owner_) Ownable(owner_) {}

  // =========================================================
  // Listing
  // =========================================================
  /**
   * @notice List an NFT for sale. Caller must have approved this contract.
   */
  function createListing(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) external nonReentrant returns (uint256 listingId) {
    require(price > 0, 'Price must be > 0');
    IERC721 nft = IERC721(nftContract);
    require(nft.ownerOf(tokenId) == msg.sender, 'Not owner');
    require(
      nft.getApproved(tokenId) == address(this) || nft.isApprovedForAll(msg.sender, address(this)),
      'Marketplace not approved'
    );

    listingId = _listingIdCounter++;
    listings[listingId] = Listing({
      seller: msg.sender,
      nftContract: nftContract,
      tokenId: tokenId,
      price: price,
      active: true
    });

    emit Listed(listingId, msg.sender, nftContract, tokenId, price);
  }

  /**
   * @notice Purchase a listed NFT.
   */
  function buy(uint256 listingId) external payable nonReentrant {
    Listing storage listing = listings[listingId];
    require(listing.active, 'Listing not active');
    require(msg.value == listing.price, 'Incorrect ETH sent');

    listing.active = false;

    uint256 fee = (listing.price * platformFeePercent) / 10_000;
    uint256 sellerProceeds = listing.price - fee;

    // Transfer NFT
    IERC721(listing.nftContract).safeTransferFrom(listing.seller, msg.sender, listing.tokenId);

    // Pay seller
    (bool sent, ) = payable(listing.seller).call{ value: sellerProceeds }('');
    require(sent, 'ETH transfer to seller failed');

    emit Sale(listingId, msg.sender, listing.seller, listing.tokenId, listing.price);
  }

  /**
   * @notice Cancel a listing (seller only).
   */
  function cancelListing(uint256 listingId) external nonReentrant {
    Listing storage listing = listings[listingId];
    require(listing.active, 'Listing not active');
    require(listing.seller == msg.sender, 'Not seller');
    listing.active = false;
    emit ListingCancelled(listingId, msg.sender);
  }

  // =========================================================
  // Admin
  // =========================================================
  function setFee(uint256 newFee) external onlyOwner {
    require(newFee <= MAX_FEE, 'Fee too high');
    platformFeePercent = newFee;
    emit FeeUpdated(newFee);
  }

  function withdrawFees() external onlyOwner nonReentrant {
    (bool sent, ) = payable(owner()).call{ value: address(this).balance }('');
    require(sent, 'Withdraw failed');
  }
}
