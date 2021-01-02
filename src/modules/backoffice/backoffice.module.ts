import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpErrorFilter } from 'src/shared/http-error.filter';
import { LoggingInterceptor } from 'src/shared/logging.interceptor';
import { ProductsController } from './controllers/products.controller';
import { ShoppingCartsItemsController } from './controllers/shopping-carts-items.controller';
import { ShoppingCartsController } from './controllers/shopping-carts.controller';
import { UsersController } from './controllers/users.controller';
import { Products } from './models/products.entity';
import { ShoppingCartsItemsEntity } from './models/shopping-carts-items.entity';
import { ShoppingCarts } from './models/shopping-carts.entity';
import { UserEntity } from './models/user.entity';
import { ProductsService } from './services/products.service';
import { ShoppingCartsItemsService } from './services/shopping-carts-items.service';
import { ShoppingCartsService } from './services/shopping-carts.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      Products,
      ShoppingCarts,
      ShoppingCartsItemsEntity,
    ]),
  ],
  controllers: [
    UsersController,
    ProductsController,
    ShoppingCartsController,
    ShoppingCartsItemsController,
  ],
  providers: [
    UsersService,
    ProductsService,
    ShoppingCartsService,
    ShoppingCartsItemsService,
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class BackofficeModule {}
