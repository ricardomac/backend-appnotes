import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/shared/constants';
import { HttpErrorFilter } from 'src/shared/http-error.filter';
import { LoggingInterceptor } from 'src/shared/logging.interceptor';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from '../../shared/jwt/jwt.strategy';
import { LocalStrategy } from '../../shared/jwt/local.strategy';
import { ProductsController } from './controllers/products.controller';
import { ShoppingListsItemsController } from './controllers/shopping-lists-items.controller';
import { ShoppingListsController } from './controllers/shopping-lists.controller';
import { UsersController } from './controllers/users.controller';
import { CompletedPurchases } from './models/completed_purchases.entity';
import { Products } from './models/products.entity';
import { ShoppingListsItemsEntity } from './models/shopping-lists-items.entity';
import { ShoppingLists } from './models/shopping-lists.entity';
import { UserEntity } from './models/user.entity';
import { CompletedPurchasesService } from './services/completed_purchases.service';
import { ProductsService } from './services/products.service';
import { ShoppingListsItemsService } from './services/shopping-lists-items.service';
import { ShoppingListsService } from './services/shopping-lists.service';
import { UsersService } from './services/users.service';
import { AuthController } from './controllers/auth.controller';
import { RefreshToken } from './models/refresh-token.entity';
import { TokensService } from './services/token.service';
import { RefreshTokensService } from './services/refresh-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RefreshToken,
      Products,
      ShoppingLists,
      ShoppingListsItemsEntity,
      CompletedPurchases
    ]),
    PassportModule,
    JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [
    AuthController,
    UsersController,
    ProductsController,
    ShoppingListsController,
    ShoppingListsItemsController,
  ],
  providers: [
    UsersService,
    TokensService,
    RefreshTokensService,
    ProductsService,
    ShoppingListsService,
    ShoppingListsItemsService,
    CompletedPurchasesService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class BackofficeModule {}
