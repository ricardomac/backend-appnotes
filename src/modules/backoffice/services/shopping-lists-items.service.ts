import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingListsItemsDTO } from '../dtos/shopping-lists-items.dto';
import { ShoppingListsDTO } from '../dtos/shopping-lists.dto';
import { Products } from '../models/products.entity';
import { ShoppingListsItemsEntity } from '../models/shopping-lists-items.entity';
import { ShoppingLists } from '../models/shopping-lists.entity';

@Injectable()
export class ShoppingListsItemsService {
  constructor(
    @InjectRepository(ShoppingListsItemsEntity)
    private shoppingListsItemsEntityRepository: Repository<ShoppingListsItemsEntity>,
  ) { }

  async getAll(): Promise<ShoppingListsItemsEntity[]> {
    return await this.shoppingListsItemsEntityRepository.find({
      relations: ['product', 'shoppingList'],
    });
  }
}
