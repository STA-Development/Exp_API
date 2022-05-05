import {NotFoundException, Inject, Injectable} from '@nestjs/common'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {CloudinaryService} from '../../cloudinary/cloudinaryService'
import {UserRepository} from '../repository/userRepository'
import {logger} from '../../logger'
import {CreateUserDto} from '../dto/userCreateDto'
import {UpdateUserDto} from '../dto/userUpdateDto'
import {User} from '../entity/user'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private cloudinary: CloudinaryService,
  ) {}

  @Inject()
  usersRepository: UserRepository

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll()
  }

  async findOneById(id: number): Promise<User> {
    let user
    try {
      user = await this.usersRepository.findOneById(id)
    } catch (error) {
      logger.error(`User with ID=${id} not found ${error}`)
    }
    return user
  }

  async findOne(authUid: string): Promise<User> {
    let user
    try {
      user = await this.usersRepository.findOne(authUid)
    } catch (error) {
      logger.error(`User with ID=${authUid} not found ${error}`)
    }
    return user
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.create(createUserDto)
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.update(id, updateUserDto)
    if (!user) {
      throw new NotFoundException(`User with ID=${id} not found`)
    }
    return user
  }

  async remove(id: number, uid: string): Promise<User> {
    try {
      const user = await this.findOne(uid)
      if (user.isAdmin) {
        try {
          return await this.usersRepository.remove(id)
        } catch (err) {
          throw {
            statusCode: 404,
            message: 'Not Found',
          }
        }
      } else {
        throw {
          statusCode: 400,
          message: 'User doesn`t have access to delete other users',
        }
      }
    } catch (err) {
      throw {
        statusCode: 404,
        message: `User with ID=${uid} not found`,
      }
    }
  }

  async changeSalary(userId: string, salary: number, id: number): Promise<User> {
    const user = await this.usersRepository.findOne(userId)
    if (user.isAdmin) {
      const changeSal = await this.userRepository.preload({
        id,
        salary,
      })
      if (!changeSal) {
        throw new NotFoundException(`User with ID=${userId} not found or not admin`)
      }
      return this.userRepository.save(changeSal)
    }
  }

  async uploadImageToCloudinary(file: Express.Multer.File, uid: string) {
    try {
      const user = await this.usersRepository.findOne(uid)
      if (user.avatarPublicId) {
        await this.cloudinary.deleteImg(user.avatarPublicId)
      }
      const cloudinaryRes = await this.cloudinary.uploadImage(file)
      return this.usersRepository.uploadImage(
        uid,
        cloudinaryRes.public_id,
        cloudinaryRes.url,
        user.id,
      )
    } catch (err) {
      throw new NotFoundException(`file is not found`)
    }
  }
}
