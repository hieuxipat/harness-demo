import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { PlanSubscription, PricingPlan } from 'src/modules/app-pricing/types/app-pricing.enum';

@Entity('shop_general')
export class ShopGeneral {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index('shop_unique', { unique: true })
  shop: string;

  @Column({ default: 0 })
  lastAccess: number;

  @Column({ default: PricingPlan.Free })
  plan: PricingPlan;

  @Column({ default: PlanSubscription.Yearly })
  subscription: PlanSubscription;

  @Column()
  planUpdatedAt: number;

  @Column({ default: true })
  displayOnboarding: boolean;
}
