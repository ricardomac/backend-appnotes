import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseResult } from 'src/shared/api-response';
import { UserDTO } from '../dtos/user.dto';
import { UserEntity } from '../models/user.entity';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private service: UsersService) { }

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @Post('auth')
  @HttpCode(200)
  // @UseInterceptors(TransformInterceptor)
  async login(@Body() user: UserDTO) {
    if (!user.email || !user.password) {
      throw new HttpException(
        'Por favor informe o e-mail e senha',
        HttpStatus.BAD_REQUEST,
      );
    }
    return new ApiResponseResult(
      true,
      'Usuario autenticado',
      await this.service.login(user),
    );
  }

  @Post()
  async create(@Body() user: UserDTO) {
    return new ApiResponseResult(
      true,
      'Usuario cadastrado com sucesso.',
      await this.service.create(user),
    );
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() user: UserEntity) {
    return new ApiResponseResult(
      true,
      'Usuario atualizado.',
      await this.service.update(id, user),
    );
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
