import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('users')
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({ unique: true })
    email!: string

    @Column()
    password!: string

    @Column()
    role!: string
    
}
