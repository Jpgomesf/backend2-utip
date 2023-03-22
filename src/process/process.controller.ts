import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Process } from './schema/process.schema';
import { ProcessService } from './process.service';
import { CreateProcessDto } from './dto/process.dto';

@Controller('processes')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Post()
  async create(@Body() createProcessDto: CreateProcessDto) {
    const process = new Process(createProcessDto);
    try {
      return await this.processService.create(process);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.processService.findAll();
    } catch (e: any) {
      throw new NotFoundException(e.message);
    }
  }

  @Get('overview')
  async getOverview() {
    try {
        return this.processService.getDangerLevelStats();
      } catch (e: any) {
        throw new BadRequestException(e.message);
      }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const process = await this.processService.findOne(id);
      if (!process) {
        throw new NotFoundException('Process not found');
      }
      return process;
    } catch (e: any) {
      throw new NotFoundException(e.message);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProcessDto: CreateProcessDto,
  ) {
    try {
      const process = await this.processService.findOne(id);
      if (!process) {
        throw new NotFoundException('Process not found');
      }
      Object.assign(process, updateProcessDto);
      return process.save();
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const process = await this.processService.findOne(id);
      if (!process) {
        throw new NotFoundException('Process not found');
      }
      return await this.processService.remove(id);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }
}
