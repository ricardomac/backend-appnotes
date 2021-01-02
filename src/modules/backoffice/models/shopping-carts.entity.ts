import { ShoppingCartsItemsEntity } from 'src/modules/backoffice/models/shopping-carts-items.entity';
import { UserEntity } from 'src/modules/backoffice/models/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GenericEntity } from './generic.entity';

@Entity({
  name: 'shopping_carts',
})
export class ShoppingCarts extends GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  // @ManyToOne(() => UserEntity, (user) => user.shopping_carts, {
  //   nullable: false,
  // })
  // user: UserEntity;

  @ManyToOne(() => UserEntity, {
    nullable: false,
  })
  user: UserEntity;

  @OneToMany(() => ShoppingCartsItemsEntity, (type) => type.shoppingCart)
  shoppingCartsItems: ShoppingCartsItemsEntity[];
}
