import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const email = createUserDto.email.toLocaleLowerCase();
    const existingRole = await this.userRepository.findOne({
      where: { email: email },
    });

    if (existingRole) {
      throw new HttpException('User with this email, already exist', 400);
    }
    const ddate = new Date();

    const protectedPassword = await this.hashPassword(createUserDto.password);

    return await this.userRepository.save({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      username: createUserDto.username,
      password: protectedPassword,
      createdAt: ddate,
      updatedAt: ddate,
    });
  }

  async findOne(id: number) {
    const Record = await this.userRepository.find({
      where: {
        id,
      },
    });
    return Record;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingRole = await this.userRepository.findOne({
      where: { id },
    });

    if (!existingRole) {
      throw new HttpException("User doesn't exist", 400);
    }
    const ddate = new Date();

    await this.userRepository.update(
      { id },
      {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        email: updateUserDto.email,
        username: updateUserDto.username,
        password: updateUserDto.password,
        updatedAt: ddate,
      },
    );

    const updatedRole = await this.userRepository.findOne({
      where: { id },
    });
    return updatedRole;
  }

  private hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }
}
