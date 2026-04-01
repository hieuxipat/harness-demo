import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ExampleService } from './example.service';
import { CreateExampleDto, UpdateExampleDto } from './example.dto';

@Controller('examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  async findAll() {
    const data = await this.exampleService.findAll();
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.exampleService.findById(id);
    if (!data) {
      throw new NotFoundException('Example not found');
    }
    return { data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateExampleDto) {
    const data = await this.exampleService.create(dto);
    return { data };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateExampleDto) {
    const data = await this.exampleService.update(id, dto);
    return { data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.exampleService.remove(id);
  }
}
