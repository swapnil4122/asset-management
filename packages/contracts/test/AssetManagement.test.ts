import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('AssetManagement System', function () {
  let assetToken: any;
  let marketplace: any;
  let owner: any;
  let seller: any;
  let buyer: any;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    const AssetTokenFactory = await ethers.getContractFactory('AssetToken');
    assetToken = await AssetTokenFactory.deploy(owner.address);

    const MarketplaceFactory = await ethers.getContractFactory('AssetMarketplace');
    marketplace = await MarketplaceFactory.deploy(owner.address);
  });

  describe('AssetToken', function () {
    it('should mint a new asset NFT', async function () {
      const tokenURI = 'ipfs://test-uri';
      const assetId = 'asset-123';
      const assetType = 'real-estate';
      const valuation = 100000; // $1000.00

      await expect(assetToken.connect(owner).mint(seller.address, tokenURI, assetId, assetType, valuation))
        .to.emit(assetToken, 'AssetMinted')
        .withArgs(0, seller.address, assetId, tokenURI);

      expect(await assetToken.ownerOf(0)).to.equal(seller.address);
      const data = await assetToken.getAssetData(0);
      expect(data.assetId).to.equal(assetId);
    });
  });

  describe('AssetMarketplace', function () {
    const price = ethers.parseUnits('1', 'ether');

    beforeEach(async function () {
      // Mint a token for the seller
      await assetToken.connect(owner).mint(seller.address, 'uri', 'id', 'type', 100);
      // Approve marketplace to spend the token
      await assetToken.connect(seller).approve(await marketplace.getAddress(), 0);
    });

    it('should create a listing', async function () {
      await expect(marketplace.connect(seller).createListing(await assetToken.getAddress(), 0, price))
        .to.emit(marketplace, 'Listed');

      const listing = await marketplace.listings(0);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(price);
      expect(listing.active).to.be.true;
    });

    it('should allow buying an asset', async function () {
      // Create listing first
      await marketplace.connect(seller).createListing(await assetToken.getAddress(), 0, price);

      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      
      // Buy the asset
      await expect(marketplace.connect(buyer).buy(0, { value: price }))
        .to.emit(marketplace, 'Sale');

      expect(await assetToken.ownerOf(0)).to.equal(buyer.address);
      
      const listing = await marketplace.listings(0);
      expect(listing.active).to.be.false;

      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);
    });
  });
});
