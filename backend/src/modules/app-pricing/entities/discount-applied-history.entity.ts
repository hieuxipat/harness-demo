import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountCode } from './discount-code.entity';
import { PricingPlan } from '../types/app-pricing.enum';

@Entity('discount_applied_history')
@Index('shop_payment_at', ['shop', 'paymentAt'])
export class DiscountAppliedHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shop: string;

  @Column({ nullable: true })
  planApplied: PricingPlan;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  appliedAt: Date;

  @Column({ nullable: true })
  paymentAt: Date;

  @ManyToOne(() => DiscountCode, (code) => code.appliedHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'fk_applied_history_to_discount_code' })
  discountCode: DiscountCode;
}
