import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { GenericEntity } from './generic.entity';
import { ShoppingListsItemsEntity } from './shopping-lists-items.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'products',
})
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    nullable: false,
    default: 0,
  })
  quantity: number;

  @ManyToOne(() => UserEntity, {
    nullable: true,
  })
  user: UserEntity;

  @OneToMany(() => ShoppingListsItemsEntity, (type) => type.product)
  product: Products;
}
