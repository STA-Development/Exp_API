import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {CreateUserDto} from '../dto/userCreateDto'
import {UpdateUserDto} from '../dto/userUpdateDto'
import {User} from '../entity/user'
import {dbAuth} from '../auth/preauthMiddleware'

@Injectable()
export class UserRepository {
  @InjectRepository(User)
  userRepository: Repository<User>

  findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  findOneById(id: number): Promise<User> {
    return this.userRepository.findOne(id)
  }

  findOne(uid: string): Promise<User> {
    return this.userRepository.findOne({
      relations: ['userSubCriteria', 'userSubCriteria.subCriteria'],
      where: {authUid: uid},
    })
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto)
    return this.userRepository.save(user)
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    })
    return this.userRepository.save(user)
  }

  async remove(id: number): Promise<User> {
    const removeUserId = await this.userRepository.findOne(id)
    await dbAuth.deleteUser(removeUserId.authUid)
    return this.userRepository.remove(removeUserId)
  }

  async changeSalary(id: number, salary: number): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      salary,
    })
    return this.userRepository.save(user)
  }

  async uploadImage(uid: string, publicId: string, url: string, id: number): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      avatar: url,
      avatarPublicId: publicId,
    })
    return this.userRepository.save(user)
  }
}
