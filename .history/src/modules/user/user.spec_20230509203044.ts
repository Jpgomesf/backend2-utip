import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { User } from '../../common/schemas/user.schema'
import { getModelToken } from '@nestjs/mongoose'
import { InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common'

describe('UserController', () => {
  let controller: UserController
  let service: UserService

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
    }).compile()

    controller = module.get<UserController>(UserController)
    service = module.get<UserService>(UserService)
  })

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      }

      jest
        .spyOn(service, 'findUserByEmail')
        .mockImplementation(() => Promise.resolve(null))

      jest
        .spyOn(service, 'createUser')
        .mockImplementation(() =>
          Promise.resolve({ id: '456', ...createUserDto } as User),
        )

      expect(await controller.createUser(createUserDto)).toStrictEqual({
        id: '456',
        ...createUserDto,
      } as User)
    })

    it('should throw NotAcceptableException when user already exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      }

      jest
        .spyOn(service, 'findUserByEmail')
        .mockImplementation(() => Promise.resolve({} as User))

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        NotAcceptableException,
      )
    })

    it('should throw InternalServerErrorException when create operation fails', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      }

      jest
        .spyOn(service, 'findUserByEmail')
        .mockImplementation(() => Promise.resolve(null))

      jest.spyOn(service, 'createUser').mockRejectedValue(
        new Error('create operation failed'),
      )

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: '123',
          email: 'example1@gmail.com',
          name: 'John',
          password: 'password1',
        } as User,
        {
          id: '456',
          email: 'example2@gmail.com',
          name: 'Jane',
          password: 'password2',
        } as User,
      ]

      jest
        .spyOn(service, 'getUsers')
        .mockImplementation(() => Promise.resolve(users))

      expect(await controller.getUsers()).toEqual(users)
    })

    it('should throw NotFoundException when no users are found', async () => {
      jest
        .spyOn(service, 'getUsers')
        .mockImplementation(() => Promise.resolve([]))

      await expect(controller.getUsers()).rejects.toThrow(NotFoundException)
    })

    it('should throw InternalServerErrorException when getUsers operation fails', async () => {
      jest
        .spyOn(service, 'getUsers')
        .mockRejectedValue(new Error('getUsers operation failed'))

      await expect(controller.getUsers()).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })
  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const userId = '123'

      jest.spyOn(service, 'getUserById').mockImplementation(() =>
        Promise.resolve({
          id: userId,
          email: 'example@gmail.com',
          name: 'Rodolf',
          password: 'shovel123',
        } as User),
      )

      expect(await controller.getUserById(userId)).toStrictEqual({
        id: userId,
        email: 'example@gmail.com',
        name: 'Rodolf',
        password: 'shovel123',
      } as User)
    })

    it('should throw NotFoundException when user is not found', async () => {
      const userId = '456'

      jest
        .spyOn(service, 'getUserById')
        .mockImplementation(() => Promise.resolve(null))

      await expect(controller.getUserById(userId)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      const userId = '123'

      jest.spyOn(service, 'getUserById').mockImplementation(() => Promise.resolve({     
        id: userId,
        email: 'example@gmail.com',
        name: 'Rodolf',
        password: 'shovel123', } as User))
      jest.spyOn(service, 'deleteUser').mockImplementation(() => Promise.resolve())

      await expect(controller.deleteUser(userId)).resolves.toBeUndefined()
      expect(service.deleteUser).toHaveBeenCalledWith(userId)
    })

    it('should throw NotFoundException when user is not found', async () => {
      const userId = '456'

      jest.spyOn(service, 'getUserById').mockImplementation(() => Promise.resolve(null))

      await expect(controller.deleteUser(userId)).rejects.toThrow(NotFoundException)
    })

    it('should throw InternalServerErrorException when delete operation fails', async () => {
      const userId = '789'

      jest.spyOn(service, 'getUserById').mockImplementation(() => Promise.resolve({     
        id: userId,
        email: 'example@gmail.com',
        name: 'Rodolf',
        password: 'shovel123', } as User))
      jest.spyOn(service, 'deleteUser').mockRejectedValue(new Error('delete operation failed'))

      await expect(controller.deleteUser(userId)).rejects.toThrow(InternalServerErrorException)
    })
  })
  describe('updateUser', () => {
    it('should update a user by id', async () => {
      const userId = '123'
      const updateUserDto = {
        email: 'newemail@gmail.com',
        name: 'New Name',
        password: 'newpassword',
      }

      const existingUser = {
        id: userId,
        email: 'example@gmail.com',
        name: 'Rodolf',
        password: 'shovel123',
      } as User

      const updatedUser = {
        ...existingUser,
        ...updateUserDto,
      } as User

      jest.spyOn(service, 'getUserById').mockResolvedValue(existingUser)
      jest.spyOn(service, 'updateUser').mockResolvedValue(updatedUser)

      expect(await controller.updateUser(userId, updateUserDto)).toEqual(updatedUser)
    })

    it('should throw NotFoundException when user is not found', async () => {
      const userId = '456'
      const updateUserDto = {
        email: 'newemail@gmail.com',
        name: 'New Name',
        password: 'newpassword',
      }

      jest.spyOn(service, 'getUserById').mockResolvedValue(null)

      await expect(controller.updateUser(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw InternalServerErrorException when update operation fails', async () => {
      const userId = '789'
      const updateUserDto = {
        email: 'newemail@gmail.com',
        name: 'New Name',
        password: 'newpassword',
      }

      const existingUser = {
        id: userId,
        email: 'example@gmail.com',
        name: 'Rodolf',
        password: 'shovel123',
      } as User

      jest.spyOn(service, 'getUserById').mockResolvedValue(existingUser)
      jest.spyOn(service, 'updateUser').mockRejectedValue(new Error('update operation failed'))

      await expect(controller.updateUser(userId, updateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })
})
