import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Repository } from 'typeorm';
import { UserDTO } from '../dtos/user.dto';
import { ShoppingLists } from '../models/shopping-lists.entity';
import { UserEntity } from '../models/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ShoppingLists)
    private shoppingListRepository: Repository<ShoppingLists>
  ) { }

  async getAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async login(userDTO: Partial<UserDTO>) {
    const user = await this.usersRepository.findOne({
      where: [{ email: userDTO.email, password: userDTO.password }],
      select: ['id', 'name']
    });

    if (!user) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }

    const shoppingLists = await this.shoppingListRepository.find({
      where: [{ user }],
      select: ['id', 'name']
    })

    console.log(shoppingLists);

    return { user, shoppingLists };
  }

  async create(userDTO: Partial<UserDTO>) {


    const user = await this.usersRepository.findOne({
      where: [{ email: userDTO.email }],
    });

    if (user) {
      throw new BadRequestException();
    }

    return await this.usersRepository.save(userDTO);
  }

  async update(id: number, data: Partial<UserDTO>) {
    let user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    await this.usersRepository.update({ id }, data);
    user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async delete(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.usersRepository.delete({ id });
    return user;
  }
}
