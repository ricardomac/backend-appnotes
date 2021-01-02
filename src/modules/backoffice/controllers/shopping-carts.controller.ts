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
import { ShoppingCartsDTO } from '../dtos/shopping-carts.dto';
import { ShoppingCartsService } from '../services/shopping-carts.service';

@ApiTags('ShoppingCarts')
@Controller('api/shopping-carts')
export class ShoppingCartsController {
  constructor(private service: ShoppingCartsService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get('cart-items/:id')
  async getItems(@Param('id') id: number) {
    return await this.service.getItems(id);
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() shoppingCarts: ShoppingCartsDTO) {
    return this.service.create(shoppingCarts);
  }

  @Post('add-item')
  async addItemToCart(@Body() shoppingCartsItemsDTO: ShoppingCartsItemsDTO) {
    return await this.service.addItemToCart(shoppingCartsItemsDTO);
  }

  @Put()
  update(@Body() shoppingCarts: ShoppingCartsDTO) {
    return this.service.update(shoppingCarts);
  }

  @Delete(':id')
  deleteUser(@Param() params) {
    return this.service.delete(params.id);
  }
}
