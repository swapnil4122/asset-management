import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
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
        async (tokenId, owner, assetId, tokenURI) => {
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
    } catch (error: any) {
      this.logger.error(`Error setting up listeners: ${error.message}`);
    }
  }
}
