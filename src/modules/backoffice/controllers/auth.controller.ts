import { Controller, Request, Post, Get, UseGuards, Body, HttpException, HttpStatus, UnauthorizedException, Req, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/modules/backoffice/services/auth.service';
import { ApiResponseResult } from 'src/shared/api-response';
import { JwtAuthGuard } from '../../../shared/jwt/jwt-auth.guard';
import { LocalAuthGuard } from '../../../shared/jwt/local-auth.guard';
import { MeDTO } from '../dtos/profile.dto';
import { RefreshTokenDTO } from '../dtos/refresh-token.dto';
import { ShoppingListsDTO } from '../dtos/shopping-lists.dto';
import { UserDTO } from '../dtos/user.dto';
import { UserEntity } from '../models/user.entity';
import { TokensService } from '../services/token.service';
import { UsersService } from '../services/users.service';

export interface AuthenticationPayload {
  user: UserEntity
  shoppingLists: ShoppingListsDTO,
  payload: {
    type: string
    token: string
    refresh_token?: string
  }
}

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private users: UsersService,
    private tokens: TokensService,
    private authService: AuthService) { }


  @Post('/register')
  public async register(@Body() body: UserDTO) {
    const user = await this.users.create(body)

    const token = await this.tokens.generateAccessToken(user)
    const refresh = await this.tokens.generateRefreshToken(user, 60 * 60 * 1 * 1)

    const payload = this.buildResponsePayload(user, token, refresh)

    return {
      status: 'success',
      data: payload,
    }
  }

  @Post('/login')
  public async login(@Body() body: UserDTO) {
    const { email, password } = body

    const result = await this.users.login(body);
    const token = await this.tokens.generateAccessToken(result.user)
    const refresh = await this.tokens.generateRefreshToken(result.user, 60 * 60 * 24 * 30)

    return new ApiResponseResult(true,
      'Autenticado com sucesso',
      this.buildResponsePayload(result, token, refresh));

  }



  private buildResponsePayload(result: any, accessToken: string, refreshToken?: string): AuthenticationPayload {
    return {
      user: result.user,
      shoppingLists: result.shoppingLists,
      payload: {
        type: 'bearer',
        token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      }
    }
  }

  @Post('/refresh')
  public async refresh(@Body() body: RefreshTokenDTO) {
    const { user, token } = await this.tokens.createAccessTokenFromRefreshToken(body.refresh_token)

    const payload = this.buildResponsePayload(user, token)

    console.log(payload);
    return {
      status: 'success',
      data: payload,
    }
  }



  @Post('/me/')
  @UseGuards(JwtAuthGuard)
  public async getUser(@Body() req: MeDTO) {
    // const userId = request.user.id

    const user = await this.users.findById(req.userId)

    console.log(user);

    return {
      status: 'success',
      data: user,
    }
  }

  // // @UseGuards(LocalAuthGuard)
  // @Post('register')
  // async register(@Body() req: UserDTO) {
  //   return new ApiResponseResult(
  //     true,
  //     'Usuario cadastrado com sucesso.',
  //     await this.authService.register(req),
  //   );
  // }

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Body() req: UserDTO) {
  //   return new ApiResponseResult(
  //     true,
  //     'Usuario autenticado com sucesso.',
  //     await this.authService.login(req)
  //   );
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
