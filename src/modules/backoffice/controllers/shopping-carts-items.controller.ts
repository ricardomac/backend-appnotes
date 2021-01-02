import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShoppingCartsItemsDTO } from '../dtos/shopping-carts-items.dto';
import { ShoppingCartsItemsService } from '../services/shopping-carts-items.service';

@ApiTags('ShoppingCartsItems')
@Controller('api/shopping-carts-items')
export class ShoppingCartsItemsController {
  constructor(private service: ShoppingCartsItemsService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }
}
