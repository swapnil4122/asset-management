// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

/**
 * @title AssetToken
 * @notice ERC-721 NFT representing a real-world asset on-chain.
 *         Supports minting, burning, pausing, and URI storage.
 */
contract AssetToken is
  ERC721,
  ERC721URIStorage,
  ERC721Enumerable,
  ERC721Pausable,
  AccessControl,
  ReentrancyGuard
{
  // =========================================================
  // Roles
  // =========================================================
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');
  bytes32 public constant PAUSER_ROLE = keccak256('PAUSER_ROLE');
  bytes32 public constant BURNER_ROLE = keccak256('BURNER_ROLE');

  // =========================================================
  // State
  // =========================================================
  uint256 private _nextTokenId;

  // Asset metadata linked to each token
  struct AssetData {
    string assetId; // Off-chain asset UUID
    string assetType; // e.g. "real_estate", "art"
    uint256 valuationUSD; // Valuation at time of minting (in cents)
    bool isFractional; // Whether fractional ownership is enabled
    address fractionalContract; // Address of linked FractionalToken
  }

  mapping(uint256 => AssetData) private _assetData;

  // =========================================================
  // Events
  // =========================================================
  event AssetMinted(
    uint256 indexed tokenId,
    address indexed owner,
    string assetId,
    string tokenURI
  );
  event AssetBurned(uint256 indexed tokenId, address indexed owner);
  event AssetDataUpdated(uint256 indexed tokenId);

  // =========================================================
  // Constructor
  // =========================================================
  constructor(address admin) ERC721('AssetToken', 'ASSET') {
    _grantRole(DEFAULT_ADMIN_ROLE, admin);
    _grantRole(MINTER_ROLE, admin);
    _grantRole(PAUSER_ROLE, admin);
    _grantRole(BURNER_ROLE, admin);
  }

  // =========================================================
  // Minting
  // =========================================================
  /**
   * @notice Mint a new asset NFT.
   * @param to           Recipient address.
   * @param tokenURI_    IPFS URI for asset metadata.
   * @param assetId      Off-chain UUID of the asset.
   * @param assetType    Category of the asset.
   * @param valuationUSD Valuation in USD cents.
   */
  function mint(
    address to,
    string calldata tokenURI_,
    string calldata assetId,
    string calldata assetType,
    uint256 valuationUSD
  ) external onlyRole(MINTER_ROLE) whenNotPaused nonReentrant returns (uint256) {
    uint256 tokenId = _nextTokenId++;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, tokenURI_);

    _assetData[tokenId] = AssetData({
      assetId: assetId,
      assetType: assetType,
      valuationUSD: valuationUSD,
      isFractional: false,
      fractionalContract: address(0)
    });

    emit AssetMinted(tokenId, to, assetId, tokenURI_);
    return tokenId;
  }

  /**
   * @notice Enable fractional ownership by linking an ERC-20 contract.
   */
  function enableFractional(
    uint256 tokenId,
    address fractionalContract
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(_ownerOf(tokenId) != address(0), 'Token does not exist');
    require(fractionalContract != address(0), 'Invalid fractional contract');
    _assetData[tokenId].isFractional = true;
    _assetData[tokenId].fractionalContract = fractionalContract;
    emit AssetDataUpdated(tokenId);
  }

  // =========================================================
  // Burn
  // =========================================================
  function burn(uint256 tokenId) external onlyRole(BURNER_ROLE) {
    address owner = ownerOf(tokenId);
    _burn(tokenId);
    delete _assetData[tokenId];
    emit AssetBurned(tokenId, owner);
  }

  // =========================================================
  // View
  // =========================================================
  function getAssetData(uint256 tokenId) external view returns (AssetData memory) {
    require(_ownerOf(tokenId) != address(0), 'Token does not exist');
    return _assetData[tokenId];
  }

  // =========================================================
  // Pause
  // =========================================================
  function pause() external onlyRole(PAUSER_ROLE) {
    _pause();
  }
  function unpause() external onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  // =========================================================
  // Overrides required by Solidity
  // =========================================================
  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal override(ERC721, ERC721Enumerable, ERC721Pausable) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function _increaseBalance(
    address account,
    uint128 value
  ) internal override(ERC721, ERC721Enumerable) {
    super._increaseBalance(account, value);
  }

  function tokenURI(
    uint256 tokenId
  ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, ERC721URIStorage, ERC721Enumerable, AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
