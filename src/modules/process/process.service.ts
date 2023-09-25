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
    const processes = await this.processModel
      .find({ stepsHistory: { $exists: true } })
      .lean()
      .exec()

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

    const processes = await this.processModel.find().lean().exec()
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

    if (
      updateProcessDto.stepsHistory &&
      updateProcessDto.stepsHistory.length !== process.stepsHistory.length
    ) {
      const previousStep =
        updateProcessDto.stepsHistory[updateProcessDto.stepsHistory.length - 2]
      const currentStep =
        updateProcessDto.stepsHistory[updateProcessDto.stepsHistory.length - 1]
      if (
        updateProcessDto.stepsHistory[updateProcessDto.stepsHistory.length - 1]
          .startDate
      ) {
        const startDate =
          updateProcessDto.stepsHistory[
            updateProcessDto.stepsHistory.length - 1
          ].startDate
        updateProcessDto.dateStepUpdate = this.toDate(startDate)
        previousStep.finalDate = this.toDate(startDate)
        currentStep.startDate = this.toDate(startDate)
      } else {
        previousStep.finalDate = new Date()
        currentStep.startDate = new Date()
      }
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

  calculateDaysDifference(date: Date): number {
    return Math.round((Date.now() - date.getTime()) / (1000 * 3600 * 24))
  }

  private formatProcess(process: IProcess) {
    const daysSinceStepUpdate = this.calculateDaysDifference(
      process.dateStepUpdate,
    )

    const incarcerationDaysCount = this.calculateDaysDifference(
      process.incarcerationDate,
    )

    process.status = this.getStatus(process, daysSinceStepUpdate)
    process.daysSinceStepUpdate = daysSinceStepUpdate
    process.incarcerationDaysCount = incarcerationDaysCount
    return process
  }

  private getStatus(process: IProcess, daysSinceStepUpdated: number) {
    const lastStep =
      process.stepsHistory?.[process.stepsHistory?.length - 1].step
    const thresholds = {
      [ProcessStepsTypeEnum.Delegacia]: [10, 15],
      [ProcessStepsTypeEnum.MinisterioPublico]: [5, 7],
      [ProcessStepsTypeEnum.ApresentacaoDefesa]: [30, 40],
      [ProcessStepsTypeEnum.AudienciaInqueritoJudicial]: [30, 45],
      [ProcessStepsTypeEnum.MemoriaisDefesa]: [5, 7],
      [ProcessStepsTypeEnum.MemoriaisMinisterioPublico]: [5, 7],
      [ProcessStepsTypeEnum.Sentenca]: [10, 15],
      [ProcessStepsTypeEnum.Finalizado]: [Infinity, Infinity],
    }

    const [okThreshold, warningThreshold] = thresholds[lastStep]

    if (lastStep === ProcessStepsTypeEnum.Finalizado) {
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

  toDate(dateString: Date | string | undefined): Date {
    return dateString ? new Date(dateString) : new Date()
  }
}
