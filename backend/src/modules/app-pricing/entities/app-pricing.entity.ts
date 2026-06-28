import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { PricingPlan, PricingTag } from '../types/app-pricing.enum';

@Entity('app_pricing_plan')
@Index('default_plan', ['isDefault', 'isActive'])
export class AppPricingPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index('name', { unique: true })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  monthlyDescription: string;

  @Column({ type: 'text', nullable: true })
  annuallyDescription: string;

  @Column()
  @Index('plan', { unique: true })
  plan: PricingPlan;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float', default: 0 })
  annuallyDiscount: number;

  @Column({ type: 'float' })
  annuallyMonthlyDisplayPrice: number;

  @Column({ type: 'float' })
  annuallyPrice: number;

  @Column({ default: 0 })
  trialDays?: number;

  @Column({ nullable: true })
  tag?: PricingTag;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: 0 })
  @Index('order')
  order: number;

  @Column({ default: true })
  @Index('active_plan')
  isActive: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
