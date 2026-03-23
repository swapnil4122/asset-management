import {
  Injectable,
  OnModuleInit,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { Asset } from '../asset/entity/asset.entity';
import { AssetStatus } from '@asset-mgmt/shared-types';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {
    const rpcUrl =
      this.configService.get<string>('BLOCKCHAIN_RPC_URL') ||
      'http://localhost:8545';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async onModuleInit() {
    this.logger.log('Initializing Blockchain Event Listeners...');
    this.setupListeners();
  }

  private async setupListeners() {
    const assetTokenAddress = this.configService.get<string>(
      'ASSET_TOKEN_ADDRESS',
    );
    if (!assetTokenAddress) {
      this.logger.warn(
        'ASSET_TOKEN_ADDRESS not configured. Skipping listeners.',
      );
      return;
    }

    try {
      // Basic ABI for AssetMinted event
      const abi = [
        'event AssetMinted(uint256 indexed tokenId, address indexed owner, string assetId, string tokenURI)',
      ];

      const assetTokenContract = new ethers.Contract(
        assetTokenAddress,
        abi,
        this.provider,
      );

      assetTokenContract.on(
        'AssetMinted',
        async (tokenId, owner, assetId, _tokenURI) => {
          this.logger.log(
            `AssetMinted Event Detected: tokenId=${tokenId}, assetId=${assetId}`,
          );

          const asset = await this.assetRepository.findOne({
            where: { id: assetId },
          });
          if (asset) {
            asset.tokenId = tokenId.toString();
            asset.status = AssetStatus.TOKENIZED;
            await this.assetRepository.save(asset);
            this.logger.log(`Asset ${assetId} updated to TOKENIZED status.`);
          }
        },
      );
    } catch (error: unknown) {
      this.logger.error(`Error setting up listeners: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async mintAsset(assetId: string): Promise<string> {
    const asset = await this.assetRepository.findOne({ where: { id: assetId } });
    if (!asset) throw new NotFoundException('Asset not found');
    if (asset.status !== AssetStatus.VERIFIED) {
      throw new BadRequestException(
        'Asset must be VERIFIED before tokenization',
      );
    }

    const assetTokenAddress = this.configService.get<string>(
      'ASSET_TOKEN_ADDRESS',
    );
    const privateKey = this.configService.get<string>('ADMIN_PRIVATE_KEY');

    if (!assetTokenAddress || !privateKey) {
      throw new InternalServerErrorException('Blockchain configuration missing');
    }

    try {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      const abi = [
        'function mint(address to, string tokenURI, string assetId, string assetType, uint256 valuationUSD) external returns (uint256)',
      ];
      const contract = new ethers.Contract(assetTokenAddress, abi, wallet);

      // Use ipfsHash from entity or metadata
      let ipfsHash = asset.ipfsHash;
      if (!ipfsHash && asset.metadata && typeof asset.metadata === 'object') {
        ipfsHash = (asset.metadata as Record<string, unknown>).ipfsHash as string;
      }

      const tokenURI = ipfsHash ? `ipfs://${ipfsHash}` : `ipfs://mock-${assetId}`;

      this.logger.log(`Minting NFT for asset ${assetId}...`);
      const tx = await contract.mint(
        asset.ownerId,
        tokenURI,
        asset.id,
        asset.assetType,
        Math.round(asset.valuationUSD * 100), // to cents
      );

      this.logger.log(`Mint transaction submitted: ${tx.hash}`);
      return tx.hash;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Minting failed: ${message}`);
      throw new InternalServerErrorException(`Minting failed: ${message}`);
    }
  }
}
