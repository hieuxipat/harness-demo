import { PlanSubscription, PricingPlan } from 'src/modules/app-pricing/types/app-pricing.enum';
export declare class ShopGeneral {
    id: number;
    shop: string;
    lastAccess: number;
    plan: PricingPlan;
    subscription: PlanSubscription;
    planUpdatedAt: number;
    displayOnboarding: boolean;
}
