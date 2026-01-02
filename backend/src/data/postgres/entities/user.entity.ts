import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('users')
  export class User {
  
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column('text')
    name!: string;
  
    @Column('text', { unique: true })
    email!: string;
  
    @Column('boolean', { default: false })
    emailValidated!: boolean;
  
    @Column('text')
    password!: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
  
  }