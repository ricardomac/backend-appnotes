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
import { CheckOutDTO } from '../dtos/check-out.dto';
import { ShoppingListsItemsDTO } from '../dtos/shopping-lists-items.dto';
import { ShoppingListsDTO } from '../dtos/shopping-lists.dto';
import { ShoppingListsService } from '../services/shopping-lists.service';

@ApiTags('ShoppingLists')
@Controller('api/shopping-lists')
export class ShoppingListsController {
  constructor(private service: ShoppingListsService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get('items/:id')
  async getItems(@Param('id') id: number) {
    return await this.service.getItems(id);
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() shoppingListsDTO: ShoppingListsDTO) {
    return this.service.create(shoppingListsDTO);
  }

  @Post('add-item')
  async addItemToList(@Body() shoppingListsItemsDTO: ShoppingListsItemsDTO) {
    return await this.service.addItemToList(shoppingListsItemsDTO);
  }

  @Post('check-out')
  async checkOut(@Body() checkOutDTO: CheckOutDTO) {
    return await this.service.checkOut(checkOutDTO);
  }

  @Put()
  update(@Body() shoppingListsDTO: ShoppingListsDTO) {
    return this.service.update(shoppingListsDTO);
  }

  @Delete(':id')
  deleteUser(@Param() params) {
    return this.service.delete(params.id);
  }
}
