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
import { ApproveVerificationDto } from './dto/approve-verification.dto';
import { RejectVerificationDto } from './dto/reject-verification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@asset-mgmt/shared-types';
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VERIFIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all verification requests (Verifier/Admin only)' })
  async findAll() {
    return this.verificationService.findAll();
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VERIFIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all pending verification requests (Verifier/Admin only)' })
  async getPending() {
    return this.verificationService.getPendingRequests();
  }

  @Get('asset/:assetId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get verification requests for a specific asset' })
  async findByAssetId(@Param('assetId') assetId: string) {
    return this.verificationService.findByAssetId(assetId);
  }

  @Post('approve/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VERIFIER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Approve a verification request (Verifier/Admin only)',
  })
  async approve(
    @Param('id') id: string,
    @Body() approveDto: ApproveVerificationDto,
    @Request() req: any,
  ) {
    return this.verificationService.approveRequest(id, req.user.id, approveDto);
  }

  @Post('reject/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VERIFIER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Reject a verification request (Verifier/Admin only)',
  })
  async reject(
    @Param('id') id: string,
    @Body() rejectDto: RejectVerificationDto,
    @Request() req: any,
  ) {
    return this.verificationService.rejectRequest(id, req.user.id, rejectDto);
  }
}
