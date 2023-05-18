import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DangerLevelStats } from './model/dangerLevel.model'
import { Process } from '../../common'

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel(Process.name) private processModel: Model<Process>,
  ) {}

  async create(createProcessDto: CreateProcessDto): Promise<Process> {
    const createdProcess = new this.processModel(createProcessDto)
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
    updateProcessDto: CreateProcessDto,
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

  private formatProcess(process: Process): any {
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
    const dangerLevel = this.getDangerLevel(process)
    return {
      ...process.toJSON(),
      daysSinceCreated,
      daysSinceUpdated,
      daysSinceStatusUpdated,
      daysCounter: daysSinceStatusUpdated,
      dangerLevel,
    }
  }

  private getDangerLevel(process: Process): any {
    const status = process.get('status')
    const statusDateUpdated = process.get('dateStatusUpdated')
    const daysSinceStatusUpdated = Math.round(
      (Date.now() - statusDateUpdated.getTime()) / (1000 * 3600 * 24),
    )
    switch (status) {
      case 'inq':
        if (daysSinceStatusUpdated <= 30) {
          return 'ok'
        } else if (daysSinceStatusUpdated <= 45) {
          return 'warning'
        } else if (daysSinceStatusUpdated > 45) {
          return 'danger'
        }
        break
      case 'den':
        if (daysSinceStatusUpdated <= 10) {
          return 'ok'
        } else if (daysSinceStatusUpdated <= 15) {
          return 'warning'
        } else if (daysSinceStatusUpdated > 15) {
          return 'danger'
        }
        break
      case 'def':
        if (daysSinceStatusUpdated <= 5) {
          return 'ok'
        } else if (daysSinceStatusUpdated <= 8) {
          return 'warning'
        } else if (daysSinceStatusUpdated > 8) {
          return 'danger'
        }
        break
      case 'aij':
        if (daysSinceStatusUpdated <= 25) {
          return 'ok'
        } else if (daysSinceStatusUpdated <= 30) {
          return 'warning'
        } else if (daysSinceStatusUpdated > 30) {
          return 'danger'
        }
        break
      case 'sen':
        return 'completed'
    }
    return null
  }
}
