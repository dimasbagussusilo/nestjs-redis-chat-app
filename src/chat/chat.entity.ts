import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('chats')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: string;

  @Column()
  group: string;

  @Column('text')
  content: string;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;
}
