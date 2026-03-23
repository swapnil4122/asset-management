import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { CreateVerificationRequestDto } from './dto/create-verification-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('verification')
@ApiBearerAuth('JWT')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('request')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit a new verification request' })
  async create(
    @Body() createDto: CreateVerificationRequestDto,
    @Request() req: any,
  ) {
    return this.verificationService.create(createDto, req.user.id);
  }

  @Get('requests')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all verification requests (Verifier/Admin only ideally)' })
  async findAll() {
    return this.verificationService.findAll();
  }

  @Get('asset/:assetId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get verification requests for a specific asset' })
  async findByAssetId(@Param('assetId') assetId: string) {
    return this.verificationService.findByAssetId(assetId);
  }
}
