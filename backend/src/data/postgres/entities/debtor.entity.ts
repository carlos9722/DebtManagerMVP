import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany,
    BaseEntity
  } from 'typeorm';
  import { Debt } from './debt.entity';
  
  @Entity('debtors')
  export class Debtor extends BaseEntity {
  
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column('varchar', { length: 100 })
    name!: string;
  
    @Column('varchar', { length: 100, nullable: true })
    email?: string;
  
    @Column('varchar', { length: 20, nullable: true })
    phone?: string;
  
    @Column('text', { nullable: true })
    notes?: string;
  
    @OneToMany(() => Debt, (debt) => debt.debtor)
    debts!: Debt[];
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
  }