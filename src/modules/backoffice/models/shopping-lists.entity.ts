import { UserEntity } from 'src/modules/backoffice/models/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GenericEntity } from './generic.entity';
import { ShoppingListsItemsEntity } from './shopping-lists-items.entity';

@Entity({
  name: 'shopping_lists',
})
export class ShoppingLists extends GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  // @ManyToOne(() => UserEntity, (user) => user.shopping_lists, {
  //   nullable: false,
  // })
  // user: UserEntity;

  @ManyToOne(() => UserEntity, {
    nullable: false,
  })
  user: UserEntity;

  @OneToMany(() => ShoppingListsItemsEntity, (type) => type.shoppingList)
  shoppingListsItems: ShoppingListsItemsEntity[];
}
