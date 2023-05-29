import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DangerLevelStats } from './model/dangerLevel.model'
import { Process, IProcess, ProcessStepsTypeEnum, ProcessStatusTypeEnum} from '../../common'
import { DIProcessResult } from 'src/common/types/dtos/process.dto'

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel(Process.name) private processModel: Model<Process>,
  ) {}

  async create(process: IProcess): Promise<Process> {
    const createdProcess = new this.processModel(process)
    return createdProcess.save()
  }

  async findAll() {
    const processes = await this.processModel.find().exec()
    return processes.map((process) => this.formatProcess(process))
  }

  async getProcessAnalitycs() {
    const dangerLevelStats = new DangerLevelStats()
    const processes = await this.processModel.find().exec()
    processes.forEach((process) => {
      const dangerLevel = this.getStatus(process)
      if (dangerLevel) {
        dangerLevelStats[dangerLevel]++
      }
    })
    dangerLevelStats.total = processes.length
    return dangerLevelStats
  }

  async findOne(id: string): Promise<Process> {
    return this.processModel.findById(id).exec()
  }

  async update(
    id: string,
    updateProcessDto: IProcess,
  ): Promise<Process> {
    const process = await this.processModel.findById(id)
    if (updateProcessDto.status && updateProcessDto.status !== process.status) {
      process.dateStatusUpdated = new Date() 
    }
    Object.assign(process, updateProcessDto)
    return process.save()
  }

  async remove(id: string): Promise<Process> {
    return this.processModel.findByIdAndRemove(id).exec()
  }

  private formatProcess(process: Process): DIProcessResult {
    const createdAt = process.get('createdAt')
    const updatedAt = process.get('updatedAt')
    const statusDateUpdated = process.get('dateStatusUpdated')
    const daysSinceCreated = Math.round(
      (Date.now() - createdAt.getTime()) / (1000 * 3600 * 24),
    )
    const daysSinceUpdated = Math.round(
      (Date.now() - updatedAt.getTime()) / (1000 * 3600 * 24),
    )
    const daysSinceStatusUpdated = Math.round(
      (Date.now() - statusDateUpdated.getTime()) / (1000 * 3600 * 24),
    )
    const status = this.getStatus(process)
    return {
      ...process,
      daysSinceCreated,
      daysSinceUpdated,
      daysSinceStepUpdate: daysSinceStatusUpdated,
      status: status,
    }
  }

  private getStatus(process: IProcess) {
    const daysSinceStepUpdated = Math.round(
      (Date.now() - process.dateStatusUpdate.getTime()) / (1000 * 3600 * 24),
    )
    switch (process.steps) {
      case ProcessStepsTypeEnum.InqueritoPolicial:
        if (daysSinceStepUpdated <= 30) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStepUpdated <= 45) {
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStepUpdated > 45) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.MinisterioPublico:
        if (daysSinceStepUpdated <= 10) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStepUpdated <= 15) {
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStepUpdated > 15) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.ApresentacaoDefesa:
        if (daysSinceStepUpdated <= 5) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStepUpdated <= 8) { 
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStepUpdated > 8) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.AudienciaInqueritoJudicial:
        if (daysSinceStepUpdated <= 25) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStepUpdated <= 30) {
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStepUpdated > 30) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.Sentenca:
        if (daysSinceStepUpdated <= 10) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStepUpdated <= 15) {
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStepUpdated > 15) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.Finalizado:
        return process.status = ProcessStatusTypeEnum.Delivered
    }
    return null
  }
}
