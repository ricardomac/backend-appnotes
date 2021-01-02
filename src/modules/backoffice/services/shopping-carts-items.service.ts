import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingCartsItemsDTO } from '../dtos/shopping-carts-items.dto';
import { ShoppingCartsDTO } from '../dtos/shopping-carts.dto';
import { Products } from '../models/products.entity';
import { ShoppingCartsItemsEntity } from '../models/shopping-carts-items.entity';
import { ShoppingCarts } from '../models/shopping-carts.entity';

@Injectable()
export class ShoppingCartsItemsService {
  constructor(
    @InjectRepository(ShoppingCartsItemsEntity)
    private shoppingCartItemsRepository: Repository<ShoppingCartsItemsEntity>,
  ) {}

  // async addItemToCart(shoppingCartsItemsDTO: Partial<ShoppingCartsItemsDTO>) {
  //   const user = this.shoppingCartItemsRepository.create(shoppingCartsItemsDTO);
  //   await this.shoppingCartItemsRepository.save(user);
  //   return user;
  // }

  async getAll(): Promise<ShoppingCartsItemsEntity[]> {
    return await this.shoppingCartItemsRepository.find({
      relations: ['product', 'shoppingCart'],
    });
  }
}
