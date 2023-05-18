import { Test, TestingModule } from '@nestjs/testing'
import { ProcessController } from './process.controller'
import { ProcessService } from './process.service'
import { BadRequestException } from '@nestjs/common'
import { ProcessStatusTypeEnum, ProcessStepsTypeEnum, IProcess } from '../../common'
import { getModelToken } from '@nestjs/mongoose'
import { Process } from '../../common/schemas/process.schema'

describe('ProcessController', () => {
  let controller: ProcessController
  let service: ProcessService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessController],
      providers: [
        ProcessService,
        {
          provide: getModelToken('Process'),
          useValue: {},
        },
      ],
    })
      .overrideProvider(ProcessService)
      .useValue({
        create: jest.fn().mockResolvedValue({
        steps: ProcessStepsTypeEnum.InqueritoPolicial,
        status: ProcessStatusTypeEnum.Ok,
        processNumber: '123456',
        attorneyName: 'John Doe',
        defendantName: 'Jane Doe',
        description: 'Some description',
        daysSinceStepUpdate: 5,
        dateStepUpdate: new Date(),
      }),
      })
      .compile()

    controller = module.get<ProcessController>(ProcessController)
    service = module.get<ProcessService>(ProcessService)
  })

  describe('create', () => {
    it('should create a new process successfully', async () => {
      const createProcessDto: IProcess = {
        steps: ProcessStepsTypeEnum.InqueritoPolicial,
        status: ProcessStatusTypeEnum.Ok,
        processNumber: '123456',
        attorneyName: 'John Doe',
        defendantName: 'Jane Doe',
        description: 'Some description',
        daysSinceStepUpdate: 5,
        dateStepUpdate: new Date(),
      }

      const createdProcess = {
        id: '1',
        ...createProcessDto,
      } as Process

      jest.spyOn(service, 'create').mockResolvedValue(createdProcess)

      const result = await controller.create(createProcessDto)

      expect(result).toEqual(createdProcess)
    })

    it('should throw a BadRequestException if the process creation fails', async () => {
      const createProcessDto: IProcess = {
        steps: ProcessStepsTypeEnum.InqueritoPolicial,
        status: ProcessStatusTypeEnum.Ok,
        processNumber: '123456',
        attorneyName: 'John Doe',
        defendantName: 'Jane Doe',
        description: 'Some description',
        daysSinceStepUpdate: 5,
        dateStepUpdate: new Date(),
      }

      jest.spyOn(service, 'create').mockRejectedValue(new Error('Failed to create process'))

      await expect(controller.create(createProcessDto)).rejects.toThrow(BadRequestException)
    })
  })
})