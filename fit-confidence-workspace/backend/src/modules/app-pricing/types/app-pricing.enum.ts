export enum PricingPlan {
  Free = 'free',
  Charge = 'charge',
}

export enum PlanSubscription {
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export enum PricingTag {
  BestSeller = 'Best seller',
  Recommended = 'Recommended',
  BestValue = 'Best value',
}

export enum DiscountType {
  //discount by percent
  Percent = 0,
  //discount fixed amount
  Fixed = 1,
  //apply price amount for plan
  Price = 2,
}
