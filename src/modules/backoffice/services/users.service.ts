import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Repository } from 'typeorm';
import { UserDTO } from '../dtos/user.dto';
import { ShoppingLists } from '../models/shopping-lists.entity';
import { UserEntity } from '../models/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ShoppingLists)
    private shoppingListRepository: Repository<ShoppingLists>
  ) { }



  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  public async validateCredentials(user: UserEntity, password: string): Promise<boolean> {
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new UnauthorizedException()
    }
    return valid;
  }

  async create(createUserDto: UserDTO) {

    const user = await this.usersRepository.findOne({
      where: [{ email: createUserDto.email }],
    });

    if (user) {
      throw new BadRequestException("Não foi possivel registrar o usuário. Verifique as informações.");
    }

    const hash = await this.hashPassword(createUserDto.password);
    return await this.usersRepository.save({
      ...createUserDto,
      password: hash
    });
  }

  // async create(userDTO: Partial<UserDTO>) {

  //   const user = await this.usersRepository.findOne({
  //     where: [{ email: userDTO.email }],
  //   });

  //   if (user) {
  //     throw new BadRequestException();
  //   }

  //   return await this.usersRepository.save(userDTO);
  // }

  async getAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return await this.usersRepository.findOne({
      where: { email: email },
    })
  }

  async findById(id: number) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async login(userDTO: Partial<UserDTO>) {
    const user = await this.findByEmail(userDTO.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    await this.validateCredentials(user, userDTO.password);

    const shoppingLists = await this.shoppingListRepository.find({
      where: [{ user }],
      select: ['id', 'name']
    })

    return {
      user,
      shoppingLists
    };
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
