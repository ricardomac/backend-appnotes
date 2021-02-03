import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { delay } from 'rxjs/operators';
import { JwtAuthGuard } from 'src/shared/jwt/jwt-auth.guard';
import { ProductDTO } from '../dtos/product.dto';
import { Products } from '../models/products.entity';
import { ProductsService } from '../services/products.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
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

  @Get('user/:id')
  getFindByUser(@Param() params) {
    return this.service.findByUser(params.id);
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
