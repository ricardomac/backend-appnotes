import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GenericEntity } from './generic.entity';
import { ShoppingListsItemsEntity } from './shopping-lists-items.entity';

@Entity({
  name: 'products',
})
export class Products extends GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  image: string;
  // @ManyToOne(() => User, (type) => type.products, {
  //   nullable: false,
  // })
  // user: User;

  @OneToMany(() => ShoppingListsItemsEntity, (type) => type.product)
  product: Products;
}
