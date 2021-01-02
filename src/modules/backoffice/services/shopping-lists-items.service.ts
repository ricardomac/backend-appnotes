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
    private shoppingCartItemsRepository: Repository<ShoppingListsItemsEntity>,
  ) {}

  // async addItemToCart(shoppingCartsItemsDTO: Partial<ShoppingCartsItemsDTO>) {
  //   const user = this.shoppingCartItemsRepository.create(shoppingCartsItemsDTO);
  //   await this.shoppingCartItemsRepository.save(user);
  //   return user;
  // }

  async getAll(): Promise<ShoppingListsItemsEntity[]> {
    return await this.shoppingCartItemsRepository.find({
      relations: ['product', 'shoppingCart'],
    });
  }
}
