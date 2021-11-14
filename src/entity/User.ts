import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { hashSync } from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @BeforeUpdate()
  @BeforeInsert()
  hashPwd() {
    this.password = hashSync(this.password, 10);
  }
}
