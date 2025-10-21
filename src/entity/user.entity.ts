import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import bcrypt from "bcryptjs"
@Entity('users')
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: number

    @Column({type: 'varchar', nullable: false})
    name!: string

    @Column({ type: 'varchar', nullable: false, unique: true })
    email!: string

    @Column({type: 'varchar', nullable: false})
    hashed_password!: string

    @Column({type: 'varchar', default: 'user'})
    role!: string

    @Column({type: 'boolean', default: true})
    is_active!: boolean

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date


    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(){
        if(this.hashed_password){
            const salt = await bcrypt.genSalt(10)
            this.hashed_password = await bcrypt.hash(this.hashed_password, salt)
        }
    }

    public checkPassword(password: string) : boolean{
        return bcrypt.compareSync(password, this.hashed_password)
    }

}
