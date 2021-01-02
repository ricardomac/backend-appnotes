import { Products } from 'src/modules/backoffice/models/products.entity';
import { ShoppingCarts } from 'src/modules/backoffice/models/shopping-carts.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GenericEntity } from './generic.entity';

@Entity({
  name: 'shopping_carts_items',
})
export class ShoppingCartsItemsEntity extends GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  quantity: number;

  @ManyToOne(() => Products, (type) => type.product)
  @JoinColumn({ name: 'productId' })
  product: Products;

  @ManyToOne(() => ShoppingCarts, (type) => type.shoppingCartsItems)
  @JoinColumn({ name: 'shoppingCartId' })
  shoppingCart: ShoppingCarts;
}
