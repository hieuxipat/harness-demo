import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountAppliedHistory } from './discount-applied-history.entity';
import { DiscountType, PlanSubscription, PricingPlan } from '../types/app-pricing.enum';

@Entity(`discount_code`)
export class DiscountCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ update: false })
  @Index('discount_code', { unique: true })
  code: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: true })
  @Index('code_active')
  isActive: boolean;

  @Column({ nullable: true })
  startTime: Date;

  @Column({ nullable: true })
  expireTime: Date;

  @Column({ default: DiscountType.Percent, update: false })
  discountType: DiscountType;

  @Column({ type: 'float' })
  discountValue: number;

  @Column({ type: 'simple-array', nullable: true })
  plansApply?: PricingPlan[];

  @Column({ default: PlanSubscription.Monthly })
  cycleApply: PlanSubscription;

  @Column({ nullable: true })
  numberCycleApply: number;

  @Column({ nullable: true })
  trialDays: number;

  @Column({ type: 'simple-array', nullable: true })
  shopsApply?: string[];

  @Column({ nullable: true })
  usageLimit: number;

  @Column({ default: 1 })
  usagePerShop: number;

  @OneToMany(() => DiscountAppliedHistory, (history) => history.discountCode, { cascade: ['remove'] })
  appliedHistory: DiscountAppliedHistory[];
}
