// UserLogin.ts
import {
    Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn, Column, BeforeInsert
} from 'typeorm';
import { randomUUID } from 'node:crypto';
import { User } from './User.js';

@Entity('user_logins')
export class UserLogin {
    @PrimaryColumn('uuid')
    id!: string;

    @BeforeInsert()
    setId() {
        if (!this.id) this.id = randomUUID();
    }

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
