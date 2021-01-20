import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Products } from './products.entity';
import { ShoppingLists } from './shopping-lists.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'completed_purcharses',
})
export class CompletedPurchases {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  quantity: number;

  @ManyToOne(() => Products, (type) => type.product)
  @JoinColumn({ name: 'productId' })
  product: Products;

  @ManyToOne(() => ShoppingLists, (type) => type.shoppingListsItems, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'shoppingListId' })
  shoppingList: ShoppingLists;

  @CreateDateColumn()
  created_at: Date;

}
