import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { delay } from 'rxjs/operators';
import { ProductDTO } from '../dtos/product.dto';
import { Products } from '../models/products.entity';
import { ProductsService } from '../services/products.service';

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  get(@Param() params) {
    return this.service.findById(params.id);
  }

  @Post()
  create(@Body() product: ProductDTO) {
    return this.service.create(product);
  }

  @Put()
  update(@Body() products: Products) {
    return this.service.update(products);
  }

  @Delete(':id')
  deleteUser(@Param() params) {
    return this.service.delete(params.id);
  }
}
