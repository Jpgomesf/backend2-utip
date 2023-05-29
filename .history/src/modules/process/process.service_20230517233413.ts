import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Process, IProcess, ProcessStepsTypeEnum, ProcessStatusTypeEnum, DIProcessResult} from '../../common'

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel(Process.name) private processModel: Model<Process>,
  ) {}

  async create(process: IProcess): Promise<Process> {
    const createdProcess = new this.processModel(process)
    return createdProcess.save()
  }

  async findAll(): Promise<DIProcessResult[]> {
    const processes = await this.processModel.find().exec()
    return processes.map((process) => this.formatProcess(process))
  }

  async getProcessesAnalitycs() {
    const processCounts: Record<ProcessStatusTypeEnum, number> = {
      [ProcessStatusTypeEnum.Ok]: 0,
      [ProcessStatusTypeEnum.Warning]: 0,
      [ProcessStatusTypeEnum.Danger]: 0,
      [ProcessStatusTypeEnum.Hold]: 0,
      [ProcessStatusTypeEnum.Delivered]: 0,
    }

    const processes = await this.processModel.find().exec()
    const formatedProcess = processes.map((process) => this.formatProcess(process))
    const total = await this.processModel.countDocuments().exec()
    formatedProcess.forEach((process) => {
      processCounts[process.status]++
    }) 
    return { processCounts, total }
  }

  async findOne(id: string) {
    const process = await this.processModel.findById(id).exec()
    return this.formatProcess(process)
  }

  async update(id: string, updateProcessDto: IProcess) {
    const process = await this.processModel
      .findByIdAndUpdate(id, updateProcessDto, { new: true })
      .exec()

    if (updateProcessDto.status && updateProcessDto.status !== process.status) {
      process.dateStepUpdate = new Date()
      process.save()
    }

    return process
  }

  async remove(id: string): Promise<Process> {
    return this.processModel.findByIdAndRemove(id).exec()
  }

  private async formatProcess(process: IProcess) {
    const daysSinceStepUpdate = Math.round(
      (Date.now() - process.dateStepUpdate.getTime()) / (1000 * 3600 * 24),
    )
    process.status = this.getStatus(process, daysSinceStepUpdate)
    process.daysSinceStepUpdate =  daysSinceStepUpdate
    await this.processModel.findOneAndUpdate(process)
    return process
  }

  private getStatus(process: IProcess, daysSinceStepUpdated: number) {
    switch (process.steps) {
      case ProcessStepsTypeEnum.Delegacia:
        if (daysSinceStepUpdated <= 10) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStepUpdated <= 15) {
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStepUpdated > 15) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.MinisterioPublico:
        if (daysSinceStepUpdated <= 5) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStepUpdated <= 7) {
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStepUpdated > 7) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.ApresentacaoDefesa:
        if (daysSinceStepUpdated <= 30) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStepUpdated <= 40) { 
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStepUpdated > 40) {
          return process.status = ProcessStatusTypeEnum.Danger
        }
        break
      case ProcessStepsTypeEnum.AudienciaInqueritoJudicial:
        if (daysSinceStepUpdated <= 30) {
          return process.status = ProcessStatusTypeEnum.Ok
        } else if (daysSinceStepUpdated <= 45) {
          return process.status = ProcessStatusTypeEnum.Warning
        } else if (daysSinceStepUpdated > 45) {
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
