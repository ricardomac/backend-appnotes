import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpErrorFilter } from 'src/shared/http-error.filter';
import { LoggingInterceptor } from 'src/shared/logging.interceptor';
import { ProductsController } from './controllers/products.controller';
import { ShoppingListsItemsController } from './controllers/shopping-lists-items.controller';
import { ShoppingListsController } from './controllers/shopping-lists.controller';
import { UsersController } from './controllers/users.controller';
import { Products } from './models/products.entity';
import { ShoppingListsItemsEntity } from './models/shopping-lists-items.entity';
import { ShoppingLists } from './models/shopping-lists.entity';
import { UserEntity } from './models/user.entity';
import { ProductsService } from './services/products.service';
import { ShoppingListsItemsService } from './services/shopping-lists-items.service';
import { ShoppingListsService } from './services/shopping-lists.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      Products,
      ShoppingLists,
      ShoppingListsItemsEntity,
    ]),
  ],
  controllers: [
    UsersController,
    ProductsController,
    ShoppingListsController,
    ShoppingListsItemsController,
  ],
  providers: [
    UsersService,
    ProductsService,
    ShoppingListsService,
    ShoppingListsItemsService,
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class BackofficeModule {}
