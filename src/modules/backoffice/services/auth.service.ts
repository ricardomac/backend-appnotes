import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/backoffice/services/users.service';
import { UserDTO } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../models/user.entity';
import { ShoppingListsService } from './shopping-lists.service';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private shoppingListService: ShoppingListsService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { email, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserDTO) {
    return await this.signUser(user);
  }

  async register(user: UserDTO) {
    return await this.usersService.create(user);
  }

  async signUser(user: any) {
    const payload = { sub: user.id, email: user.email }
    // const shoppingLists = await this.shoppingListService.findByUser(user.id);
    // console.log(shoppingLists);
    // return { user, shoppingLists };
    return { acess_token: await this.generateToken(payload) }
  }

  private async generateToken(payload: any) {
    return await this.jwtService.signAsync(payload);
  }


}