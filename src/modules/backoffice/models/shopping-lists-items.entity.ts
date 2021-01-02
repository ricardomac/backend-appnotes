import { Products } from 'src/modules/backoffice/models/products.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GenericEntity } from './generic.entity';
import { ShoppingLists } from './shopping-lists.entity';

@Entity({
  name: 'shopping_lists_items',
})
export class ShoppingListsItemsEntity extends GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  quantity: number;

  @ManyToOne(() => Products, (type) => type.product)
  @JoinColumn({ name: 'productId' })
  product: Products;

  @ManyToOne(() => ShoppingLists, (type) => type.shoppingListsItems)
  @JoinColumn({ name: 'shoppingListId' })
  shoppingList: ShoppingLists;
}
