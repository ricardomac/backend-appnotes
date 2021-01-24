import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/backoffice/services/users.service';
import { UserDTO } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../models/user.entity';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return await this.signUser(user)
    }
    return null;
  }

  async login(user: UserDTO) {
    return await this.validateUser(user.email, user.password);
  }

  async register(user: UserDTO) {
    return await this.usersService.create(user);
  }

  async signUser(user: UserEntity) {
    const payload = { sub: user.id, email: user.email }
    return { acess_token: await this.generateToken(payload) }
  }

  private async generateToken(payload: any) {
    return await this.jwtService.signAsync(payload);
  }


}