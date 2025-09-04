// User.ts
import {
    Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index, BeforeInsert
} from 'typeorm';
import { randomUUID } from 'node:crypto';

@Entity('users')
export class User {
    @PrimaryColumn('uuid')
    id!: string;

    @BeforeInsert()
    setId() {
        if (!this.id) this.id = randomUUID();
    }

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 80 })
    username!: string;

    @Column({ type: 'varchar', length: 255 })
    password!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date | null;
}
