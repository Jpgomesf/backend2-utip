import { Test, TestingModule } from '@nestjs/testing'
import { ProcessController } from './process.controller'
import { ProcessService } from './process.service'
import { BadRequestException } from '@nestjs/common'
import { CreateProcessDto } from './dto/process.dto'
import { getModelToken } from '@nestjs/mongoose'
import { Process } from './schema/process.schema'

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
          id: '1',
          processNumber: '123456',
          defendantName: 'John Doe',
          attorneyName: 'Jane Doe',
          status: 'ongoing',
          dateStatusUpdated: new Date(),
          phoneNumber: '+55 31 99999-9999',
        }),
      })
      .compile()

    controller = module.get<ProcessController>(ProcessController)
    service = module.get<ProcessService>(ProcessService)
  })

  describe('create', () => {
    it('should create a new process successfully', async () => {
      const createProcessDto: CreateProcessDto = {
        processNumber: '123456',
        defendantName: 'John Doe',
        attorneyName: 'Jane Doe',
        status: 'ongoing',
        dateStatusUpdated: new Date(),
        phoneNumber: '+55 31 99999-9999',
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
      const createProcessDto: CreateProcessDto = {
        processNumber: '123456',
        defendantName: 'John Doe',
        attorneyName: 'Jane Doe',
        status: 'ongoing',
        dateStatusUpdated: new Date(),
        phoneNumber: '+55 31 99999-9999',
      }

      jest.spyOn(service, 'create').mockRejectedValue(new Error('Failed to create process'))

      await expect(controller.create(createProcessDto)).rejects.toThrow(BadRequestException)
    })
  })
})