import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: string) {
    return this.userRepository.findOneByOrFail({ id })
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneByOrFail({ email })
  }

  async create(email: string) {
    const user = new User()
    user.email = email
    await this.userRepository.save(user)
    return this.userRepository.findOneBy({ email })
  }

  async findOneByEmailOrCreate(email: string) {
    console.log(email)
    const user = await this.userRepository.findOneBy({ email })
    console.log(user)
    if (user) {
      return user
    }
    
    return this.create(email)
  }
}
