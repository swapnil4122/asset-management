import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('assets')
@ApiBearerAuth()
@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Register a new asset' })
  async create(@Body() createAssetDto: CreateAssetDto, @Request() req: any) {
    return this.assetService.create(createAssetDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all assets owned by the logged-in user' })
  async findAll(@Request() req: any) {
    return this.assetService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset details by ID' })
  async findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }
}
