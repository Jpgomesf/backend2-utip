import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DangerLevelStats } from './model/dangerLevel.model';
import { Process } from './schema/process.schema';
import { CreateProcessDto } from './dto/process.dto';

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel(Process.name) private processModel: Model<Process>,
  ) {}

  async create(createProcessDto: CreateProcessDto): Promise<Process> {
    const createdProcess = new this.processModel(createProcessDto);
    return createdProcess.save();
  }

  async findAll(): Promise<any[]> {
    const processes = await this.processModel.find().exec();
    return processes.map((process) => this.formatProcess(process));
  }

  async getDangerLevelStats(): Promise<any> {
    const dangerLevelStats = new DangerLevelStats();
    const processes = await this.processModel.find().exec();
    processes.forEach((process) => {
      const dangerLevel = this.getDangerLevel(process);
      if (dangerLevel) {
        dangerLevelStats[dangerLevel]++;
      }
    });
    dangerLevelStats.total = processes.length;
    return dangerLevelStats;
  }

  async findOne(id: string): Promise<Process> {
    return this.processModel.findById(id).exec();
  }

  async update(
    id: string,
    createProcessDto: CreateProcessDto,
  ): Promise<Process> {
    return this.processModel
      .findByIdAndUpdate(id, createProcessDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Process> {
    return this.processModel.findByIdAndRemove(id).exec();
  }

  private formatProcess(process: Process): any {
    const createdAt = process.get('createdAt');
    const updatedAt = process.get('updatedAt');
    const daysSinceCreated = Math.round((Date.now() - createdAt.getTime()) / (1000 * 3600 * 24));
    const daysSinceUpdated = Math.round((Date.now() - updatedAt.getTime()) / (1000 * 3600 * 24));
    const dangerLevel = this.getDangerLevel(process);
    return {
      ...process.toJSON(),
      daysSinceCreated,
      daysSinceUpdated,
      daysCounter: createdAt === updatedAt ? daysSinceCreated : daysSinceUpdated,
      dangerLevel,
    };
  }

  private getDangerLevel(process: Process): any {
    const status = process.get('status');
    const createdAt = process.get('createdAt');
    const updatedAt = process.get('updatedAt');
    const daysSinceCreated = Math.round((Date.now() - createdAt.getTime()) / (1000 * 3600 * 24));
    const daysSinceUpdated = Math.round((Date.now() - updatedAt.getTime()) / (1000 * 3600 * 24));
    switch (status) {
      case 'inq':
        if (daysSinceUpdated <= 30) {
          return 'ok';
        } else if (daysSinceUpdated <= 45) {
          return 'warning';
        } else if (daysSinceUpdated > 45) {
          return 'danger';
        }
        break;
      case 'den':
        if (daysSinceUpdated <= 10) {
          return 'ok';
        } else if (daysSinceUpdated <= 15) {
          return 'warning';
        } else if (daysSinceUpdated > 15) {
          return 'danger';
        }
        break;
      case 'def':
        if (daysSinceUpdated <= 5) {
          return 'ok';
        } else if (daysSinceUpdated <= 8) {
          return 'warning';
        } else if (daysSinceUpdated > 8) {
          return 'danger';
        }
        break;
      case 'aij':
        if (daysSinceUpdated <= 25) {
          return 'ok';
        } else if (daysSinceUpdated <= 30) {
          return 'warning';
        } else if (daysSinceUpdated > 30) {
          return 'danger';
        }
        break;
      case 'sen':
        return null;
    }
    return null;
  }

}