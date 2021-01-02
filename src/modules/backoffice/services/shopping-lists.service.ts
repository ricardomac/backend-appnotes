import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingListsDTO } from 'src/modules/backoffice/dtos/shopping-lists.dto';
import { UserEntity } from 'src/modules/backoffice/models/user.entity';
import { Repository } from 'typeorm';
import { ShoppingListsItemsDTO } from '../dtos/shopping-lists-items.dto';
import { Products } from '../models/products.entity';
import { ShoppingListsItemsEntity } from '../models/shopping-lists-items.entity';
import { ShoppingLists } from '../models/shopping-lists.entity';

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectRepository(ShoppingLists)
    private shoppingListRepository: Repository<ShoppingLists>,
    @InjectRepository(ShoppingListsItemsEntity)
    private shoppingCartItemsRepository: Repository<ShoppingListsItemsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(Products)
    private productRepository: Repository<Products>,
  ) { }

  async getAll(): Promise<any> {
    const result = await this.shoppingListRepository
      .createQueryBuilder('shoppCart')
      .select([
        'shoppCart.id',
        'shoppCart.name',
        `shoppCart.updated_at`,
        'user.id',
        'user.name',
        'shoppingCartsItems.id',
        'product.id',
        'product.name',
        'product.image',
      ])
      .leftJoin('shoppCart.user', 'user')
      .leftJoin('shoppCart.shoppingCartsItems', 'shoppingCartsItems')
      .leftJoin('shoppingCartsItems.product', 'product')
      // .addSelect('COUNT(*) as quantity')
      // .addGroupBy('product.id')
      .getMany();
    return result;
  }

  async getItems(shoppingCartId: number) {
    const result = await this.shoppingCartItemsRepository
      .createQueryBuilder('shoppingCartItems')
      .select([
        'shoppingCartItems',
        'product.id',
        'product.name',
        'product.image',
      ])
      .where(`shoppingCartItems.shoppingCartId = ${shoppingCartId}`)
      .leftJoin('shoppingCartItems.product', 'product')
      .getMany();

    if (!result || result.length <= 0) throw new NotFoundException();
    return result;
  }

  async findById(_id: number): Promise<ShoppingLists[]> {
    const result = await this.shoppingListRepository.find({
      where: [{ id: _id }],
    });

    if (!result || result.length <= 0) throw new NotFoundException();

    return result;
  }

  async create(shoppingCarts: Partial<ShoppingListsDTO>) {
    const user = await this.userRepository.findOne({
      where: { id: shoppingCarts.user_id },
    });

    if (!user) {
      throw new HttpException(
        'Usuário não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const shoppingCart = this.shoppingListRepository.create({
      ...shoppingCarts,
      user,
    });

    await this.shoppingListRepository.save(shoppingCart);
  }

  async addItemToCart(data: ShoppingListsItemsDTO) {
    // const user = new this.create(data);
    const product = await this.productRepository.findOne({
      where: { id: data.productId },
    });

    const shoppingCart = await this.shoppingListRepository.findOne({
      where: { id: data.shoppingCartId },
    });

    const shoppingCartItem = await this.shoppingCartItemsRepository.findOne({
      where: { product: data.productId, shoppingCart: data.shoppingCartId },
    });

    return await this.shoppingCartItemsRepository.save({
      id: null || shoppingCartItem?.id,
      product,
      shoppingCart,
      quantity: data.quantity,
    });
  }

  async update(shoppingCarts: Partial<ShoppingListsDTO>) {
    await this.shoppingListRepository.save(shoppingCarts);
  }

  async delete(shoppingCarts: ShoppingLists) {
    await this.shoppingListRepository.delete(shoppingCarts);
  }
}
