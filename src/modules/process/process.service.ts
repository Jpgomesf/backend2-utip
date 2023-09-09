import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  Process,
  IProcess,
  ProcessStepsTypeEnum,
  ProcessStatusTypeEnum,
  IProcessAnalitycs,
} from '../../common'

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel(Process.name) private processModel: Model<Process>,
  ) {}

  async create(process: IProcess): Promise<Process> {
    const createdProcess = new this.processModel(process)
    return createdProcess.save()
  }

  async findAll(): Promise<IProcess[]> {
    const processes = await this.processModel.find().exec()
    return processes.map((process) => this.formatProcess(process))
  }

  async getProcessesAnalitycs(): Promise<IProcessAnalitycs> {
    const processCounts: Record<ProcessStatusTypeEnum, number> = {
      [ProcessStatusTypeEnum.Ok]: 0,
      [ProcessStatusTypeEnum.Warning]: 0,
      [ProcessStatusTypeEnum.Danger]: 0,
      [ProcessStatusTypeEnum.Hold]: 0,
      [ProcessStatusTypeEnum.Delivered]: 0,
    }

    const processes = await this.processModel.find().exec()
    const formatedProcess = processes.map((process) =>
      this.formatProcess(process),
    )
    const total = await this.processModel.countDocuments().exec()
    formatedProcess.forEach((process) => {
      processCounts[process.status]++
    })
    const analitycs: IProcessAnalitycs = {
      ok: processCounts[ProcessStatusTypeEnum.Ok],
      warning: processCounts[ProcessStatusTypeEnum.Warning],
      danger: processCounts[ProcessStatusTypeEnum.Danger],
      hold: processCounts[ProcessStatusTypeEnum.Hold],
      delivered: processCounts[ProcessStatusTypeEnum.Delivered],
      total: total,
    }
    return analitycs
  }

  async findOne(id: string): Promise<IProcess> {
    const process = await this.processModel.findById(id).exec()
    return this.formatProcess(process)
  }

  async update(id: string, updateProcessDto: IProcess) {
    const process = await this.processModel.findById(id).lean().exec()

    if (updateProcessDto.steps && updateProcessDto.steps !== process.steps) {
      updateProcessDto.dateStepUpdate = new Date()
    }

    const updatedProcess = await this.processModel
      .findByIdAndUpdate(id, updateProcessDto, { new: true })
      .lean()
      .exec()

    return updatedProcess
  }

  async remove(id: string): Promise<Process> {
    return this.processModel.findByIdAndRemove(id).exec()
  }

  private formatProcess(process: IProcess) {
    const daysSinceStepUpdate = Math.round(
      (Date.now() - process.dateStepUpdate.getTime()) / (1000 * 3600 * 24),
    )
    process.status = this.getStatus(process, daysSinceStepUpdate)
    process.daysSinceStepUpdate = daysSinceStepUpdate
    return process
  }

  private getStatus(process: IProcess, daysSinceStepUpdated: number) {
    const thresholds = {
      [ProcessStepsTypeEnum.Delegacia]: [10, 15],
      [ProcessStepsTypeEnum.MinisterioPublico]: [5, 7],
      [ProcessStepsTypeEnum.ApresentacaoDefesa]: [30, 40],
      [ProcessStepsTypeEnum.AudienciaInqueritoJudicial]: [30, 45],
      [ProcessStepsTypeEnum.MemoriasDefesa]: [5, 7],
      [ProcessStepsTypeEnum.MemoriasMinisterioPublico]: [5, 7],
      [ProcessStepsTypeEnum.Sentenca]: [10, 15],
      [ProcessStepsTypeEnum.Finalizado]: [Infinity, Infinity],
    }

    const [okThreshold, warningThreshold] = thresholds[process.steps]

    if (process.steps === ProcessStepsTypeEnum.Finalizado) {
      return ProcessStatusTypeEnum.Delivered
    } else if (daysSinceStepUpdated <= okThreshold) {
      process.status = ProcessStatusTypeEnum.Ok
    } else if (daysSinceStepUpdated <= warningThreshold) {
      process.status = ProcessStatusTypeEnum.Warning
    } else if (daysSinceStepUpdated > warningThreshold) {
      process.status = ProcessStatusTypeEnum.Danger
    }
    return process.status
  }
}
