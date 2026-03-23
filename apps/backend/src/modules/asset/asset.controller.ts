import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Patch,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('assets')
@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Register a new asset' })
  async create(@Body() createAssetDto: CreateAssetDto, @Request() req: any) {
    return this.assetService.create(createAssetDto, req.user.id);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary:
      'Get all assets (paginated). Returns owned if authenticated, else public.',
  })
  async findAll(@Query() pagination: PaginationDto, @Request() req: any) {
    return this.assetService.findAll(pagination, req.user?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset details by ID' })
  async findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update asset details (owner only, pending only)' })
  async update(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto,
    @Request() req: any,
  ) {
    return this.assetService.update(id, updateAssetDto, req.user.id);
  }
}
