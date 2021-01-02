import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDTO } from '../dtos/product.dto';
import { Products } from '../models/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

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

  async create(productDTO: Partial<ProductDTO>) {
    this.productsRepository.save(productDTO);
  }

  async update(products: Products) {
    this.productsRepository.save(products);
  }

  async delete(products: Products) {
    this.productsRepository.delete(products);
  }
}
