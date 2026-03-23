import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('listings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new asset listing' })
  async create(@Request() req: { user: { id: string } }, @Body() createDto: CreateListingDto) {
    return this.marketplaceService.createListing(req.user.id, createDto);
  }

  @Get('listings')
  @ApiOperation({ summary: 'Get all active listings' })
  async findAll() {
    return this.marketplaceService.findAll();
  }

  @Get('listings/:id')
  @ApiOperation({ summary: 'Get a specific listing' })
  async findOne(@Param('id') id: string) {
    return this.marketplaceService.findOne(id);
  }

  @Delete('listings/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an active listing' })
  async cancel(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.marketplaceService.cancelListing(req.user.id, id);
  }

  @Post('purchase/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase a listed asset' })
  async purchase(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.marketplaceService.purchaseAsset(req.user.id, id);
  }

  @Post('escrow/create/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an escrow deal for a listing' })
  async createEscrow(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.marketplaceService.createEscrow(req.user.id, id);
  }

  @Post('escrow/release/:dealId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Release funds from escrow (Seller/Admin)' })
  async releaseEscrow(@Request() req: { user: { id: string } }, @Param('dealId') dealId: string) {
    return this.marketplaceService.releaseEscrow(req.user.id, dealId);
  }
}
