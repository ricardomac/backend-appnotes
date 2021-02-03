import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from 'src/shared/constants';
import { constants } from 'buffer';
import { UsersService } from 'src/modules/backoffice/services/users.service';
import { UserEntity } from 'src/modules/backoffice/models/user.entity';

export interface AccessTokenPayload {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      signOptions: {
        expiresIn: '60s',
      },
    });
  }

  async validate(payload: AccessTokenPayload): Promise<UserEntity> {
    const { sub: id } = payload

    console.log(payload);

    const user = await this.users.findById(id)

    if (!user) {
      return null
    }

    return user
  }
}