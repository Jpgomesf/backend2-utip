import { ProcessController } from './process.controller';
import { ProcessService } from './process.service';
import { BadRequestException } from '@nestjs/common';

describe('ProcessController', () => {
  let processController: ProcessController;
  let processService: ProcessService;

  beforeEach(() => {
    processService = new ProcessService();
    processController = new ProcessController(processService);
  });

  it('should create a new process', async () => {
    const process = {
      name: 'Process 1',
      description: 'This is the first process.',
      dateStepUpdate: new Date(),
      incarcerationDate: new Date(),
      stepsHistory: [
        {
          name: 'Step 1',
          startDate: new Date(),
          endDate: null,
        },
      ],
    };

    const spy = jest.spyOn(processService, 'create');

    const result = await processController.create(process);

    expect(spy).toHaveBeenCalledWith(process);
    expect(result).toBeDefined();
  });

  it('should throw an error if the process is invalid', async () => {
    const process = {
      name: '',
    };

    expect(async () => {
      await processController.create(process);
    }).rejects.toThrow(BadRequestException);
  });
});