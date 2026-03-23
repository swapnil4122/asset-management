// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

/**
 * @title FractionalToken
 * @notice ERC-20 representing fractional shares of a specific asset NFT.
 *         One FractionalToken contract is deployed per fractionalised asset.
 */
contract FractionalToken is ERC20, ERC20Burnable, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');

  // The parent NFT details
  address public immutable assetTokenContract;
  uint256 public immutable assetTokenId;

  // =========================================================
  // Events
  // =========================================================
  event SharesMinted(address indexed to, uint256 amount);
  event SharesBurned(address indexed from, uint256 amount);

  // =========================================================
  // Constructor
  // =========================================================
  constructor(
    string memory name_,
    string memory symbol_,
    address admin,
    address assetTokenContract_,
    uint256 assetTokenId_,
    uint256 initialSupply
  ) ERC20(name_, symbol_) {
    assetTokenContract = assetTokenContract_;
    assetTokenId = assetTokenId_;

    _grantRole(DEFAULT_ADMIN_ROLE, admin);
    _grantRole(MINTER_ROLE, admin);

    // Mint initial supply to admin
    _mint(admin, initialSupply);
    emit SharesMinted(admin, initialSupply);
  }

  // =========================================================
  // Minting
  // =========================================================
  function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
    _mint(to, amount);
    emit SharesMinted(to, amount);
  }

  // =========================================================
  // Override burn to emit event
  // =========================================================
  function burnFrom(address account, uint256 amount) public override {
    super.burnFrom(account, amount);
    emit SharesBurned(account, amount);
  }
}
