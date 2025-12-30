import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NozzlesService } from './nozzles.service';

@ApiTags('nozzles')
@Controller('nozzles')
export class NozzlesController {
  constructor(private readonly nozzlesService: NozzlesService) {}

  @Get()
  findAll() {
    return this.nozzlesService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.nozzlesService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.nozzlesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nozzlesService.remove(id);
  }
}
