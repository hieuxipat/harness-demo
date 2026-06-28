export const WEBHOOK_TOPICS = {
  APP_UNINSTALL: 'app/uninstalled',
  SHOP_UPDATE: 'shop/update',
  ORDER_CREATED: 'orders/create',
};

export interface IShopifyWebhookOrder {
  id: number;
  admin_graphql_api_id: string;
  app_id: number;
  browser_ip: string;
  buyer_accepts_marketing: boolean;
  cancel_reason?: OrderCancelReason;
  cancelled_at?: string;
  cart_token: string;
  checkout_id: number;
  checkout_token: string;
  client_details?: IShopifyOrderClientDetail;
  closed_at: string;
  confirmed: boolean;
  contact_email: string;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set: IShopifyMoneySet;
  current_total_additional_fees_set?: IShopifyMoneySet;
  current_total_discounts: string;
  current_total_discounts_set: IShopifyMoneySet;
  current_total_duties_set: IShopifyMoneySet;
  current_total_price: string;
  current_total_price_set: IShopifyMoneySet;
  current_total_tax: string;
  current_total_tax_set: IShopifyMoneySet;
  customer_locale: string;
  device_id?: string;
  discount_codes: IShopifyOrderDiscountCode[];
  email: string;
  estimated_taxes: boolean;
  financial_status: OrderFinancialStatus;
  fulfillment_status: OrderFulfillmentStatus;
  landing_site: string;
  landing_site_ref?: string;
  location_id?: number;
  merchant_of_record_app_id?: number;
  note?: string;
  note_attributes: IShopifyOrderNoteAttribute[];
  number: number;
  order_number: number;
  order_status_url: string;
  original_total_additional_fees_set: IShopifyMoneySet;
  original_total_duties_set: IShopifyMoneySet;
  payment_gateway_names: string[];
  phone?: string;
  presentment_currency: string;
  processed_at: string;
  reference: string;
  referring_site?: string;
  source_identifier: string;
  source_name: string;
  source_url?: string;
  subtotal_price: string;
  subtotal_price_set: IShopifyMoneySet;
  tags: string;
  tax_lines: IShopifyTaxLine[];
  taxes_included: boolean;
  test: boolean;
  token?: string;
  total_discounts: string;
  total_discounts_set: IShopifyMoneySet;
  total_line_items_price: string;
  total_line_items_price_set: IShopifyMoneySet;
  total_outstanding: string;
  total_price: string;
  total_price_set: IShopifyMoneySet;
  total_shipping_price_set: IShopifyMoneySet;
  total_tax: string;
  total_tax_set: IShopifyMoneySet;
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id?: number;
  billing_address: IShopifyOrderAddress;
  customer: IShopifyCustomer;
  discount_applications: IShopifyOrderDiscountApplication;
  fulfillments: IShopifyFulfillment[];
  line_items: IShopifyLineItem[];
  payment_terms?: IShopifyOrderPaymentTerm;
  refunds: [];
  shipping_address?: IShopifyOrderAddress;
  shipping_lines: IShopifyShippingLine[];
  name: string;
}

export interface IShopifyOrderPaymentTerm {
  amount: number;
  currency: string;
  payment_terms_name: string;
  payment_terms_type: string;
  due_in_days: number;
  payment_schedules: IShopifyOrderPaymentTermSchedule[];
}
export interface IShopifyOrderPaymentTermSchedule {
  amount: number;
  currency: string;
  issued_at: string;
  due_at: string;
  completed_at: string;
  expected_payment_method: string;
}

export interface IShopifyShippingLine {
  code: string;
  discounted_price: string;
  discounted_price_set: IShopifyMoneySet;
  price: string;
  price_set: IShopifyMoneySet;
  source: string;
  title: string;
  tax_lines: IShopifyTaxLine[];
  carrier_identifier: string;
  requested_fulfillment_service_id?: string;
  id: number;
  delivery_category?: string;
  phone?: string;
  discount_allocations?: IShopifyDiscountAllocation[];
}

export interface IShopifyMoneySet {
  shop_money: IShopifyMoney;
  presentment_money: IShopifyMoney;
}

export interface IShopifyMoney {
  amount: string;
  currency_code: string;
}

export interface IShopifyOrderAddress {
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  country_code?: string;
  first_name?: string;
  last_name?: string;
  latitude?: number;
  longitude?: number;
  name?: string;
  phone?: string;
  province?: string;
  province_code?: string;
  zip?: string;
}

export interface IShopifyOrderAddressUpdate {
  address1?: string;
  address2?: string;
  city?: string;
  countryCode?: string;
  provinceCode?: string;
}

export interface IShopifyFulfillment {
  id: number;
  admin_graphql_api_id: string;
  created_at: string;
  location_id: number;
  name: string;
  order_id: number;
  origin_address?: object;
  receipt: {
    testcase: boolean;
    authorization: string;
  };
  service: string;
  shipment_status?: FulfillmentShipmentStatus;
  status: FulfillmentStatus;
  tracking_company: string;
  tracking_number: string;
  tracking_numbers: string[];
  tracking_url: string;
  tracking_urls: string[];
  updated_at: string;
  line_items: IShopifyLineItem[];
}

export interface IShopifyLineItem {
  id: number;
  admin_graphql_api_id: string;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status: OrderFulfillmentStatus;
  gift_card: boolean;
  grams: number;
  name: string;
  price: string;
  price_set: IShopifyMoneySet;
  product_exists: boolean;
  product_id: number;
  properties: { name: string; value: string }[];
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: IShopifyMoneySet;
  variant_id: number;
  variant_inventory_management?: string;
  variant_title?: string;
  vendor: string;
  tax_lines: IShopifyTaxLine[];
  duties: [];
  current_quantity?: number;
  attributed_staffs?: [];
  discount_allocations: {
    amount: string;
    amount_set: IShopifyMoneySet;
    discount_application_index: number;
  }[];
}

export interface IShopifyTaxLine {
  price: string;
  rate: number;
  title: string;
  channel_liable: boolean;
  price_set: IShopifyMoneySet;
}

export interface IShopifyOrderClientDetail {
  accept_language: string;
  browser_height?: number;
  browser_ip: string;
  browser_width?: number;
  session_hash?: string;
  user_agent: string;
}

export interface IShopifyOrderDiscountCode {
  code: string;
  amount: string;
  type: OrderDiscountType;
}

export interface IShopifyOrderNoteAttribute {
  name: string;
  value: string;
}

export interface IShopifyCustomer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  state: string;
  note?: string;
  verified_email: boolean;
  multipass_identifier?: null;
  tax_exempt: boolean;
  phone?: string;
  email_marketing_consent: IShopifyCustomerEmailMarketingConsent;
  sms_marketing_consent?: IShopifyCustomerSmsMarketingConsent;
  tags: string;
  currency: string;
  accepts_marketing_updated_at: string;
  marketing_opt_in_level: string;
  tax_exemptions: [];
  admin_graphql_api_id: string;
  default_address: IShopifyCustomerAddress;
}

export interface IShopifyOrderDiscountApplication {
  discount_applications: IShopifyDiscountApplication[];
}

export interface IShopifyDiscountApplication {
  allocation_method: OrderDiscountMethod;
  code?: string;
  description: string;
  target_selection: OrderDiscountTargetSelection;
  target_type: OrderDiscountTargetType;
  title: string;
  type: OrderDiscountType;
  value: string;
  value_type: OrderDiscountValueType;
}

export interface IShopifyDiscountAllocation {
  amount: string;
  discount_application_index: number;
  amount_set: IShopifyMoneySet;
}

export interface IShopifyCustomerEmailMarketingConsent {
  state: string;
  opt_in_level: string;
  consent_updated_at: string;
}

export interface IShopifyCustomerSmsMarketingConsent {
  state: string;
  opt_in_level: string;
  consent_updated_at: string;
  consent_collected_from: string;
}

export interface IShopifyCustomerAddress {
  address1: string;
  address2?: string;
  city: string;
  company: string;
  country: string;
  country_code: string;
  country_name: string;
  customer_id: number;
  default: boolean;
  first_name: string;
  id: number;
  last_name: string;
  name: string;
  phone?: string;
  province: string;
  province_code: string;
  zip: string;
}

export enum OrderCancelReason {
  CUSTOMER = 'customer',
  FRAUD = 'fraud',
  INVENTORY = 'inventory',
  DECLINED = 'declined',
  OTHER = 'other',
}

export enum OrderDiscountType {
  FIXED = 'fixed_amount',
  PERCENT = 'percentage',
  SHIPPING = 'shipping',
}

export enum OrderFinancialStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  PARTIAL_PAID = 'partially_paid',
  PAID = 'paid',
  PARTIAL_REFUND = 'partially_refunded',
  REFUNDED = 'refunded',
  VOIDED = 'voided',
}

export enum OrderDiscountMethod {
  ACROSS = 'across',
  EACH = 'each',
  ONE = 'one',
}

export enum OrderDiscountTargetSelection {
  ALL = 'all',
  ENTITLED = 'entitled',
  EXPLICIT = 'explicit',
}

export enum OrderDiscountTargetType {
  ITEM = 'line_item',
  SHIPPING = 'shipping_line',
}

export enum OrderDiscountType {
  AUTO = 'automatic',
  CODE = 'discount_code',
  MANUAL = 'manual',
  SCRIPT = 'script',
}

export enum OrderDiscountValueType {
  FIXED = 'fixed_amount',
  PERCENT = 'percentage',
}

export enum OrderFulfillmentStatus {
  FULFILLED = 'fulfilled',
  NULL = 'null',
  PARTIAL = 'partial',
  RESTOCKED = 'restocked',
}

export enum FulfillmentShipmentStatus {
  LABEL_PRINTED = 'label_printed',
  LABEL_PURCHASED = 'label_purchased',
  ATTEMPTED_DELIVERY = 'attempted_delivery',
  READY_FOR_PICKUP = 'ready_for_pickup',
  CONFIRMED = 'confirmed',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILURE = 'failure',
}

export enum FulfillmentStatus {
  PENDING = 'pending',
  OPEN = 'open',
  SUCCESS = 'success',
  CANCELLED = 'cancelled',
  ERROR = 'error',
  FAILURE = 'failure',
}
