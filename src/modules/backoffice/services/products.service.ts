import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDTO } from '../dtos/product.dto';
import { Products } from '../models/products.entity';
import { UsersService } from './users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private userService: UsersService,
  ) { }

  async getAll(): Promise<Products[]> {
    return await this.productsRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findById(_id: number): Promise<Products[]> {
    return await this.productsRepository.find({
      where: [{ id: _id }],
    });
  }

  async findByUser(userId: number): Promise<Products[]> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException("Não foi possivel obter os produtos.");
    }
    return await this.productsRepository.find({
      where: { user },
    });
  }


  async create(productDTO: Partial<ProductDTO>) {
    const user = await this.userService.findById(productDTO.userId);
    if (!user) {
      throw new BadRequestException("Não foi possivel cadastrar o produto.");
    }

    const product = await this.productsRepository.findOne({
      where: { name: productDTO.name }
    })

    if (product) {
      throw new BadRequestException("Não foi possivel cadastrar o produto.");
    }

    return await this.productsRepository.save({
      ...productDTO,
      user
    });
  }

  async update(products: Products) {
    this.productsRepository.save(products);
  }

  async delete(products: Products) {
    this.productsRepository.delete(products);
  }
}
