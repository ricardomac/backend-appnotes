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
import { ShoppingListsItemsService } from '../services/shopping-lists-items.service';

@ApiTags('ShoppingListsItems')
@Controller('api/shopping-lists-items')
export class ShoppingListsItemsController {
  constructor(private service: ShoppingListsItemsService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }
}
