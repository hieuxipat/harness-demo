import * as qs from 'qs';
import { DefaultMetaResponse } from 'src/docs/default/default-response.swagger';
import { AppPricingPlan } from 'src/modules/app-pricing/entities/app-pricing.entity';
import { ShopInfo } from 'src/modules/shop/entities/shop-info.entity';
import { MONTH_NAME, TEST_SHOPS } from 'src/shared/types/shared.constant';

export const formatDateString = (time?: Date | number | string, format: string = 'yyyy-mm-dd') => {
  let timestamp = new Date(time).getTime();
  if (!timestamp || !time) timestamp = Date.now();
  const date = new Date(timestamp);
  const year = String(date.getFullYear());
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const monthName = MONTH_NAME[date.getMonth() + 1];
  format = format.replace('yyyy', year);
  format = format.replace('mm', month);
  format = format.replace('mn', monthName);
  format = format.replace('dd', day);
  return format;
};

export const unixTimestamp = (time?: Date | number | string): number => {
  if (!time) time = Date.now();
  let timestamp = new Date(time).getTime();
  if (!timestamp || !time) timestamp = Date.now();
  return Math.floor(timestamp / 1000);
};

export const objectToQuerystring = (obj = {}) => {
  return qs.stringify(obj);
};

export const calculateYearlyPricingPlan = (plan: AppPricingPlan): number => {
  const annuallyDiscount = plan.annuallyDiscount || 0;
  const discountedPrice = plan.price * (1 - annuallyDiscount / 100);
  return Math.max(Number(discountedPrice.toFixed(2)), 0);
};

export const parseQueryFromUrl = (url: string): Record<string, any> => {
  let querystring: string;
  const query = {};
  try {
    querystring = new URL(url).search;
  } catch (e) {
    return null;
  }
  const pairs = (querystring[0] === '?' ? querystring.substr(1) : querystring).split('&');
  for (let i = 0; i < pairs.length; i++) {
    const [key, value] = pairs[i].split('=');
    query[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }
  return query;
};

export const formatMetaResponse = (currentPage: number, perPage: number, total: number): DefaultMetaResponse => {
  let totalPage = 1;
  if (perPage > 0) totalPage = Math.ceil(total / perPage);
  return { perPage, currentPage, totalPage, totalResult: total };
};

export const formatPaginationRequest = (page: number, perPage: number): { skip: number; take?: number } => {
  page = Number(page);
  const skip = page ? Math.max((page - 1) * perPage, 0) : 0;
  const take = perPage === -1 ? undefined : perPage;
  return { skip, take };
};

export const isTestShop = (shopInfo: ShopInfo): boolean => {
  const { shop, email } = shopInfo || {};
  if (TEST_SHOPS.includes(shop)) return true;
  else if (email?.includes('@omegatheme.com')) return true;
  // else if (shopifyPlan === 'partner_test') return true;
  return false;
};
