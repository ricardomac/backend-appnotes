import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { UserEntity } from "./user.entity"

@Entity({
  name: 'refresh_token',
})
export class RefreshToken {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, {
    nullable: false,
  })
  user: UserEntity

  @Column()
  is_revoked: boolean

  @Column()
  expires: Date
}