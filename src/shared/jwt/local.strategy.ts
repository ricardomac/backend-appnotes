import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { jwtConstants } from 'src/shared/constants';
import { AuthService } from '../../modules/backoffice/services/auth.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(private moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(request: Request, email: string, password: string) {
    const contextId = ContextIdFactory.getByRequest(request);
    // "AuthService" is a request-scoped provider
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    const user = await authService.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;

  }

  // async validate(email: string, password: string): Promise<any> {

  // }
}