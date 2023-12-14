import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn()
	userId: number

	@Column({ type: 'varchar', length: 100 })
	name: string

	@Column({ type: 'varchar', length: 100, unique: true })
	email: string

	@Column({ type: 'varchar' })
	password: string
}
