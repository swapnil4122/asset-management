import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);
  private readonly pinataApiKey: string | undefined;
  private readonly pinataSecretApiKey: string | undefined;
  private readonly pinataApiUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  constructor(private readonly configService: ConfigService) {
    this.pinataApiKey = this.configService.get<string>('PINATA_API_KEY');
    this.pinataSecretApiKey = this.configService.get<string>('PINATA_SECRET_API_KEY');
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!this.pinataApiKey || !this.pinataSecretApiKey) {
      this.logger.warn(
        'Pinata API keys not configured. Returning mock IPFS hash.',
      );
      return `mock-ipfs-hash-${Date.now()}`;
    }

    try {
      const formData = new FormData();
      formData.append('file', file.buffer, { filename: file.originalname });

      const response = await axios.post(this.pinataApiUrl, formData, {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: this.pinataApiKey,
          pinata_secret_api_key: this.pinataSecretApiKey,
        },
      });

      return response.data.IpfsHash;
    } catch (error: unknown) {
      this.logger.error(`Error uploading to IPFS: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}
