import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {
            findById: jest.fn().mockResolvedValue({
              id: '123',
              email: 'example@gmail.com',
              name: 'Rodolf',
              password: 'shovel123',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const userId = '123';

      jest.spyOn(service, 'getUserById').mockImplementation(() =>
        Promise.resolve({
          id: userId,
          email: 'example@gmail.com',
          name: 'Rodolf',
          password: 'shovel123',
        } as User),
      );

      expect(await controller.getUserById(userId)).toStrictEqual({
        id: userId,
        email: 'example@gmail.com',
        name: 'Rodolf',
        password: 'shovel123',
      } as User);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const userId = '456';

      jest
        .spyOn(service, 'getUserById')
        .mockImplementation(() => Promise.resolve(null));

      await expect(controller.getUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      const userId = '123';

      jest.spyOn(service, 'getUserById').mockImplementation(() => Promise.resolve({     
        id: userId,
        email: 'example@gmail.com',
        name: 'Rodolf',
        password: 'shovel123', } as User));
      jest.spyOn(service, 'deleteUser').mockImplementation(() => Promise.resolve());

      await expect(controller.deleteUser(userId)).resolves.toBeUndefined();
      expect(service.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const userId = '456';

      jest.spyOn(service, 'getUserById').mockImplementation(() => Promise.resolve(null));

      await expect(controller.deleteUser(userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException when delete operation fails', async () => {
      const userId = '789';

      jest.spyOn(service, 'getUserById').mockImplementation(() => Promise.resolve({     
        id: userId,
        email: 'example@gmail.com',
        name: 'Rodolf',
        password: 'shovel123', } as User));
      jest.spyOn(service, 'deleteUser').mockRejectedValue(new Error('delete operation failed'));

      await expect(controller.deleteUser(userId)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
