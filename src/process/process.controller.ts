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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
import { Process } from './schema/process.schema';
import { ProcessService } from './process.service';
import { CreateProcessDto } from './dto/process.dto';

@ApiTags('processes')
@Controller('processes')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}


  @Post()
  @ApiOperation({ summary: 'Create process' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createProcessDto: CreateProcessDto) {
    const process = createProcessDto;
    try {
      return await this.processService.create(process);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all Processes' })
  @ApiResponse({
    status: 200,
    description: 'Returns the process with stats',
    type: [Process],
  })
  async findAll() {
    try {
      return await this.processService.findAll();
    } catch (e: any) {
      throw new NotFoundException(e.message);
    }
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get the total number of processes and the amount of dangerLevels' })
  async getOverview() {
    try {
        return this.processService.getDangerLevelStats();
      } catch (e: any) {
        throw new BadRequestException(e.message);
      }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get process by id' })
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
  @ApiOperation({ summary: 'Change process by id' })
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
  @ApiOperation({ summary: 'Delete process by id' })
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
