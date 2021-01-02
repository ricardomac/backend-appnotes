import { ShoppingCarts } from 'src/modules/backoffice/models/shopping-carts.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GenericEntity } from './generic.entity';

@Entity({
  name: 'users',
})
export class UserEntity extends GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  // @OneToMany(() => ShoppingCarts, (account) => account.user)
  // shopping_carts: ShoppingCarts;

  // @OneToMany(() => Products, (product) => product.user)
  // products: Products;
}
