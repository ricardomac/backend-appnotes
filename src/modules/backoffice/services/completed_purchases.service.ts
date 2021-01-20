import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompletedPurchasesDTO } from '../dtos/completed-purchases.dto';
import { CompletedPurchases } from '../models/completed_purchases.entity';
import { Products } from '../models/products.entity';
import { ShoppingListsItemsEntity } from '../models/shopping-lists-items.entity';
import { ShoppingLists } from '../models/shopping-lists.entity';
import { UserEntity } from '../models/user.entity';

@Injectable()
export class CompletedPurchasesService {
  constructor(
    @InjectRepository(CompletedPurchases)
    private completedPurchasesRepository: Repository<CompletedPurchases>,
    @InjectRepository(ShoppingLists)
    private shoppingListRepository: Repository<ShoppingLists>,
    @InjectRepository(Products)
    private productRepository: Repository<Products>,
  ) { }


  async create(data: Partial<CompletedPurchasesDTO>) {
    const product = await this.productRepository.findOne({
      where: { id: data.productId },
    });

    const shoppingList = await this.shoppingListRepository.findOne({
      where: { id: data.shoppingListId },
    });

    // return await this.completedPurchasesRepository.save({
    //   product,
    //   shoppingList,
    //   quantity: data.quantity,
    // });
  }


}
