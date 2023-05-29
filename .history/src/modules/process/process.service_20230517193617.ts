import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DangerLevelStats } from './model/dangerLevel.model'
import { Process, IProcess, ProcessStepsTypeEnum, ProcessStatusTypeEnum} from '../../common'

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel(Process.name) private processModel: Model<Process>,
  ) {}

  async create(process: IProcess): Promise<Process> {
    const createdProcess = new this.processModel(process)
    return createdProcess.save()
  }

  async findAll(): Promise<any[]> {
    const processes = await this.processModel.find().exec()
    return processes.map((process) => this.formatProcess(process))
  }

  async getDangerLevelStats(): Promise<any> {
    const dangerLevelStats = new DangerLevelStats()
    const processes = await this.processModel.find().exec()
    processes.forEach((process) => {
      const dangerLevel = this.getDangerLevel(process)
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
    // Check if the status has been changed
    if (updateProcessDto.status && updateProcessDto.status !== process.status) {
      process.dateStatusUpdated = new Date() // Set the dateStatusUpdated to the current date/time
    }

    Object.assign(process, updateProcessDto)
    return process.save()
  }

  async remove(id: string): Promise<Process> {
    return this.processModel.findByIdAndRemove(id).exec()
  }

  private formatProcess(process: Process) {
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
      ...process.toJSON(),
      daysSinceCreated,
      daysSinceUpdated,
      daysSinceStatusUpdate: daysSinceStatusUpdated,
      status: status,
    }
  }

  private getStatus(process: IProcess) {
    const daysSinceStatusUpdated = Math.round(
      (Date.now() - process.dateStatusUpdate.getTime()) / (1000 * 3600 * 24),
    )
    switch (process.steps) {
      case ProcessStepsTypeEnum.InqueritoPolicial:
        if (daysSinceStatusUpdated <= 30) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStatusUpdated <= 45) {
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStatusUpdated > 45) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.MinisterioPublico:
        if (daysSinceStatusUpdated <= 10) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStatusUpdated <= 15) {
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStatusUpdated > 15) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.ApresentacaoDefesa:
        if (daysSinceStatusUpdated <= 5) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStatusUpdated <= 8) { 
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStatusUpdated > 8) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.AudienciaInqueritoJudicial:
        if (daysSinceStatusUpdated <= 25) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStatusUpdated <= 30) {
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStatusUpdated > 30) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.Sentenca:
        if (daysSinceStatusUpdated <= 10) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStatusUpdated <= 15) {
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStatusUpdated > 15) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.Finalizado:
        return process.status = ProcessStatusTypeEnum.Delivered
    }
    return null
  }
}
