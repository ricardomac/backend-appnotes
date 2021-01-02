import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CONNREFUSED } from 'dns';
import { ShoppingCartsDTO } from 'src/modules/backoffice/dtos/shopping-carts.dto';
import { UserEntity } from 'src/modules/backoffice/models/user.entity';
import { Repository } from 'typeorm';
import { ShoppingCartsItemsDTO } from '../dtos/shopping-carts-items.dto';
import { Products } from '../models/products.entity';
import { ShoppingCartsItemsEntity } from '../models/shopping-carts-items.entity';
import { ShoppingCarts } from '../models/shopping-carts.entity';

@Injectable()
export class ShoppingCartsService {
  constructor(
    @InjectRepository(ShoppingCarts)
    private shoppingCartRepository: Repository<ShoppingCarts>,
    @InjectRepository(ShoppingCartsItemsEntity)
    private shoppingCartItemsRepository: Repository<ShoppingCartsItemsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(Products)
    private productRepository: Repository<Products>,
  ) {}

  async getAll(): Promise<any> {
    const result = await this.shoppingCartRepository
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

  async findById(_id: number): Promise<ShoppingCarts[]> {
    const result = await this.shoppingCartRepository.find({
      where: [{ id: _id }],
    });

    if (!result || result.length <= 0) throw new NotFoundException();

    return result;
  }

  async create(shoppingCarts: Partial<ShoppingCartsDTO>) {
    const user = await this.userRepository.findOne({
      where: { id: shoppingCarts.user_id },
    });

    if (!user) {
      throw new HttpException(
        'Usuário não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const shoppingCart = this.shoppingCartRepository.create({
      ...shoppingCarts,
      user,
    });

    await this.shoppingCartRepository.save(shoppingCart);
  }

  async addItemToCart(data: ShoppingCartsItemsDTO) {
    // const user = new this.create(data);
    const product = await this.productRepository.findOne({
      where: { id: data.productId },
    });

    const shoppingCart = await this.shoppingCartRepository.findOne({
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

  async update(shoppingCarts: Partial<ShoppingCartsDTO>) {
    await this.shoppingCartRepository.save(shoppingCarts);
  }

  async delete(shoppingCarts: ShoppingCarts) {
    await this.shoppingCartRepository.delete(shoppingCarts);
  }
}
