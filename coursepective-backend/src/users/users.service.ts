import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: string, relations=[], relationsLoadStrategy: "join" | "query" = "join") {
    return this.userRepository.findOneOrFail({ where: { id }, relations, 'relationLoadStrategy': relationsLoadStrategy})
  }

  async findOneByEmail(email: string, relations=[], relationsLoadStrategy: "join" | "query" = "join") {
    if (!email) {
      throw new NotFoundException('user not found')
    }
    return this.userRepository.findOneOrFail({ where: { email }, relations, 'relationLoadStrategy': relationsLoadStrategy})
  }

  async create(email: string) {
    const user = new User()
    user.email = email
    await this.userRepository.save(user)
    return this.userRepository.findOneBy({ email })
  }

  async findOneByEmailOrCreate(email: string, relations=[], relationsLoadStrategy: "join" | "query" = "join") {
    console.log(email)
    const user = await this.userRepository.findOne({ where: { email }, relations, 'relationLoadStrategy': relationsLoadStrategy})
    console.log(user)
    if (user) {
      return user
    }
    
    return this.create(email)
  }

  async areFriends(user1: User, user2: User) {
    user1 = await this.findOneByEmail(user1.email, ["friends"])
    user2 = await this.findOneByEmail(user2.email, ["friends"])
    console.log(user1, user2)

    return user2.friends.filter(user => user.id == user1.id).length
  }

  async getFriends(user: User): Promise<User[]> { 
    user = await this.findOneByEmail(user.email, ['friends'])
    return user.friends

  }
  
  async addFriend(origin: User, dest: User) {
    origin = await this.findOneByEmail(origin.email, ['friends'])
    dest = await this.findOneByEmail(dest.email, ['friends'])
    origin.friends.push(dest);
    dest.friends.push(origin)
    await this.userRepository.save(origin);
    await this.userRepository.save(dest);
  }

  async unfriend(origin: User, dest: User) {
    origin = await this.findOneByEmail(origin.email, ['friends'])
    dest = await this.findOneByEmail(dest.email, ['friends'])
    origin.friends = origin.friends.filter(user => user.id != dest.id);
    dest.friends = dest.friends.filter(user => user.id != origin.id);
    await this.userRepository.save(origin);
    await this.userRepository.save(dest);
  }
}
