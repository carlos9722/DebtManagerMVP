import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    BaseEntity
  } from 'typeorm';
  import { Debtor } from './debtor.entity';

  @Entity('debts')
  export class Debt extends BaseEntity {
  
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column('varchar', { length: 200 })
    description!: string;
  
    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;
  
    @Column('boolean', { default: false })
    isPaid!: boolean;
  
    @Column('date', { nullable: true })
    dueDate!: Date;
  
    @Column('date', { nullable: true })
    paidAt!: Date;
  
    @Column('uuid')
    debtorId!: string;
  
    @ManyToOne(() => Debtor, (debtor) => debtor.debts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'debtorId' })
    debtor!: Debtor;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
  }
