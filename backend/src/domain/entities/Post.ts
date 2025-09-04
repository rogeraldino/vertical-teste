// Post.ts
import {
    Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, BeforeInsert
} from 'typeorm';
import { randomUUID } from 'node:crypto';
import { User } from './User.js';

@Entity('posts')
export class Post {
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

    @Column({ type: 'varchar', length: 140 })
    title!: string;

    @Column({ type: 'text' })
    message!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
