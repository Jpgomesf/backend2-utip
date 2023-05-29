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
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Process } from '../../common/schemas/process.schema'
import { ProcessService } from './process.service'
import { IProcess, SProcess } from '../../common'

@ApiTags('processes')
@Controller('processes')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create process' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() process: IProcess) {
    const newProcess = { ...process, dateStepUpdate: new Date() }
    console.log()
    try {
      const validatedProcess = SProcess.parse(newProcess)
      return await this.processService.create(validatedProcess)
    } catch (e: any) {
      throw new BadRequestException(e.message)
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
      return await this.processService.findAll()
    } catch (e: any) {
      throw new NotFoundException(e.message)
    }
  }

  @Get('overview')
  @ApiOperation({
    summary: 'Get the total number of processes and the amount of dangerLevels',
  })
  async getOverview() {
    try {
      return this.processService.getProcessesAnalitycs()
    } catch (e: any) {
      throw new BadRequestException(e.message)
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get process by id' })
  async findOne(@Param('id') id: string) {
    try {
      const process = await this.processService.findOne(id)
      if (!process) {
        throw new NotFoundException('Process not found')
      }
      return process
    } catch (e: any) {
      throw new NotFoundException(e.message)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update process by id' })
  async update(
    @Param('id') id: string,
    @Body() updateProcessDto: IProcess,
  ) {
    try {
     return await this.processService.update(id, updateProcessDto)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete process by id' })
  async remove(@Param('id') id: string) {
    try {
      const process = await this.processService.findOne(id)
      if (!process) {
        throw new NotFoundException('Process not found')
      }
      return await this.processService.remove(id)
    } catch (e: any) {
      throw new BadRequestException(e.message)
    }
  }
}
