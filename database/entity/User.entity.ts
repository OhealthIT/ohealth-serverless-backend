import { Entity, PrimaryGeneratedColumn, Column } from "typeorm/browser";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false })
  firstName: string;

  @Column("text", { nullable: true })
  lastName: string;

  @Column("text", { nullable: true, default: 18 })
  age: number;
}
