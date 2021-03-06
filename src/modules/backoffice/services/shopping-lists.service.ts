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
import { CheckOutDTO } from '../dtos/check-out.dto';
import { ProductDTO } from '../dtos/product.dto';
import { ShoppingListsItemsDTO } from '../dtos/shopping-lists-items.dto';
import { CompletedPurchases } from '../models/completed_purchases.entity';
import { Products } from '../models/products.entity';
import { ShoppingListsItemsEntity } from '../models/shopping-lists-items.entity';
import { ShoppingLists } from '../models/shopping-lists.entity';

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectRepository(ShoppingLists)
    private shoppingListRepository: Repository<ShoppingLists>,
    @InjectRepository(CompletedPurchases)
    private completedPurchasesRepository: Repository<CompletedPurchases>,
    @InjectRepository(ShoppingListsItemsEntity)
    private shoppingListsItemsRepository: Repository<ShoppingListsItemsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(Products)
    private productRepository: Repository<Products>,
  ) { }

  async getAll(): Promise<any> {
    const result = await this.shoppingListRepository
      .createQueryBuilder('shoppList')
      .select([
        'shoppList.id',
        'shoppList.name',
        `shoppList.updated_at`,
        'user.id',
        'user.name',
        'shoppListsItems.id',
        'product.id',
        'product.name',
        'product.image',
      ])
      .leftJoin('shoppList.user', 'user')
      .leftJoin('shoppList.shoppListsItems', 'shoppListsItems')
      .leftJoin('shoppListsItems.product', 'product')
      // .addSelect('COUNT(*) as quantity')
      // .addGroupBy('product.id')
      .getMany();
    return result;
  }

  async getItems(shoppListId: number) {
    const result = await this.shoppingListsItemsRepository
      .createQueryBuilder('shoppListItems')
      .select([
        'shoppListItems',
        'product.id',
        'product.name',
        'product.image',
      ])
      .where(`shoppListItems.shoppingListId = ${shoppListId}`)
      .leftJoin('shoppListItems.product', 'product')
      .getMany();

    // if (!result || result.length <= 0) throw new NotFoundException();
    return result;
  }

  async findById(_id: number): Promise<ShoppingLists[]> {
    const result = await this.shoppingListRepository.find({
      where: [{ id: _id }],
    });

    if (!result || result.length <= 0) throw new NotFoundException();

    return result;
  }

  async findByUser(user_id: number): Promise<ShoppingLists[]> {
    const result = await this.shoppingListRepository.find({
      where: [{ user: user_id }],
    });

    if (!result || result.length <= 0) throw new NotFoundException();

    return result;
  }

  async create(shoppingListsDTO: Partial<ShoppingListsDTO>) {
    const user = await this.userRepository.findOne({
      where: { id: shoppingListsDTO.user_id },
    });

    if (!user) {
      throw new HttpException(
        'Usuário não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const shoppingList = this.shoppingListRepository.create({
      ...shoppingListsDTO,
      user,
    });

    await this.shoppingListRepository.save(shoppingList);
  }

  async checkOut(data: CheckOutDTO) {

    const shoppingList = await this.shoppingListRepository.findOne({
      where: { id: data.shoppingListId }
    })

    const products = await this.shoppingListsItemsRepository.find({
      where: { shoppingList: shoppingList.id },
      relations: ["product"]
    })

    const onlyProducts = products.map(x => x.product);

    console.log(onlyProducts);

    onlyProducts.forEach(async (product: Products) => {

      var productUpdate = await this.shoppingListsItemsRepository.findOne({
        where: { product }
      })

      await this.productRepository.update(product.id, {
        id: product.id,
        quantity: product.quantity += productUpdate.quantity,
      })

      await this.completedPurchasesRepository.save({
        product,
        quantity: productUpdate.quantity,
        shoppingList
      })

    });

    products.forEach(async (value: ShoppingListsItemsEntity) => {
      await this.shoppingListsItemsRepository.delete(value.id);
    })

  }

  async addItemToList(data: ShoppingListsItemsDTO) {
    const product = await this.productRepository.findOne({
      where: { id: data.productId },
    });

    const shoppingList = await this.shoppingListRepository.findOne({
      where: { id: data.shoppingListId },
    });

    const shoppingListItem = await this.shoppingListsItemsRepository.findOne({
      where: {
        product: data.productId,
        shoppingList: data.shoppingListId
      },
    });

    return await this.shoppingListsItemsRepository.save({
      id: null || shoppingListItem?.id,
      product,
      shoppingList,
      quantity: data.quantity,
    });
  }

  async update(shoppingListsDTO: Partial<ShoppingListsDTO>) {
    await this.shoppingListRepository.save(shoppingListsDTO);
  }

  async delete(shoppingLists: ShoppingLists) {
    await this.shoppingListRepository.delete(shoppingLists);
  }
}
