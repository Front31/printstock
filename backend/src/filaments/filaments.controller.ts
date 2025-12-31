import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FilamentsService } from './filaments.service';
import { CreateFilamentDto } from './dto/create-filament.dto';
import { UpdateFilamentDto } from './dto/update-filament.dto';
import { CreateUsageDto } from './dto/create-usage.dto';

@ApiTags('filaments')
@Controller('filaments')
export class FilamentsController {
  constructor(private readonly filamentsService: FilamentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all filaments' })
  findAll(
    @Query('material') material?: string,
    @Query('opened') opened?: string,
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.filamentsService.findAll({
      material,
      opened: opened === 'true' ? true : opened === 'false' ? false : undefined,
      searchQuery: q,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get filament by ID' })
  findOne(@Param('id') id: string) {
    return this.filamentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create filament' })
  create(@Body() createFilamentDto: CreateFilamentDto) {
    return this.filamentsService.create(createFilamentDto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
  }))
  @ApiOperation({ summary: 'Update filament' })
  update(@Param('id') id: string, @Body() updateFilamentDto: UpdateFilamentDto) {
    return this.filamentsService.update(id, updateFilamentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete filament' })
  remove(@Param('id') id: string) {
    return this.filamentsService.remove(id);
  }

  @Post(':id/usage')
  @ApiOperation({ summary: 'Add usage' })
  addUsage(@Param('id') id: string, @Body() createUsageDto: CreateUsageDto) {
    return this.filamentsService.addUsage(id, createUsageDto);
  }
}
