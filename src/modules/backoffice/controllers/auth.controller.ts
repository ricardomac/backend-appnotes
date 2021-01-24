import { Controller, Request, Post, Get, UseGuards, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/modules/backoffice/services/auth.service';
import { ApiResponseResult } from 'src/shared/api-response';
import { JwtAuthGuard } from '../../../shared/jwt/jwt-auth.guard';
import { LocalAuthGuard } from '../../../shared/jwt/local-auth.guard';
import { UserDTO } from '../dtos/user.dto';


@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // @UseGuards(LocalAuthGuard)
  @Post('register')
  async register(@Body() req: UserDTO) {
    return new ApiResponseResult(
      true,
      'Usuario cadastrado com sucesso.',
      await this.authService.register(req),
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() req: UserDTO) {
    return new ApiResponseResult(
      true,
      'Usuario autenticado com sucesso.',
      await this.authService.login(req)
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}