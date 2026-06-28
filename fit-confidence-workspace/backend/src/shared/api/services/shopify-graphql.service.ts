import { ApiVersion, GraphqlClient, RequestedTokenType, Session, Shopify, shopifyApi } from '@shopify/shopify-api';
import { Injectable } from '@nestjs/common';
import '@shopify/shopify-api/adapters/node';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopInfo } from 'src/modules/shop/entities/shop-info.entity';
import { In, Like, Repository } from 'typeorm';
import { DiscountType, PlanSubscription, PricingPlan } from 'src/modules/app-pricing/types/app-pricing.enum';
import { AppPricingPlan } from 'src/modules/app-pricing/entities/app-pricing.entity';
import { isTestShop, objectToQuerystring } from 'src/shared/utils/functions';
import {
  AppPricingInterval,
  AppSubscriptionReplacementBehavior,
  AppSubscriptionStatus,
  CurrencyCode,
} from '../types/graphql-api/admin.types';
import { IShopifyAppMetafieldPayload, IShopifyAuth, IShopifyDiscountPayload } from '../types/shopify-api.types';
import { ShopGeneral } from 'src/modules/shop/entities/shop-general.entity';
import { EventEmitterName } from 'src/shared/types/shared.enum';
import { OnEvent } from '@nestjs/event-emitter';
import { AppPricingService } from 'src/modules/app-pricing/app-pricing.service';
import { ShopInstalled } from 'src/modules/shop/entities/shop-installed.entity';

@Injectable()
export class ShopifyGraphQLService {
  private shopify: Shopify;

  constructor(
    private readonly appPricingService: AppPricingService,
    @InjectRepository(ShopInfo)
    private readonly shopInfoRepository: Repository<ShopInfo>,
    @InjectRepository(ShopGeneral)
    private readonly shopGeneralRepository: Repository<ShopGeneral>,
    @InjectRepository(ShopInstalled)
    private readonly shopInstalledRepository: Repository<ShopInstalled>,
    @InjectRepository(AppPricingPlan)
    private readonly appPricingPlanRepository: Repository<AppPricingPlan>,
  ) {
    this.shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET,
      apiVersion: ApiVersion.October24,
      hostName: process.env.APP_SERVER_DOMAIN,
      isEmbeddedApp: true,
    });
  }

  async getOfflineShopifyToken(shop: string, sessionToken: string) {
    const tokenResponse = await this.shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OfflineAccessToken,
    });
    return tokenResponse.session;
  }

  async generateShopAppMetafields(shop: string): Promise<IShopifyAppMetafieldPayload> {
    const [shopGeneral] = await Promise.all([this.shopGeneralRepository.findOne({ where: { shop } })]);
    const metafields: IShopifyAppMetafieldPayload = {
      shop,
      rootLink: process.env.APP_SERVER_DOMAIN,
      publicKey: '',
      data: {
        shopGeneral,
      },
    };
    return metafields;
  }

  async cancelAllChargePlan(shop: string) {
    const shopInfo = await this.shopInfoRepository.findOne({ where: { shop } });
    const accessToken = shopInfo?.accessToken;
    const activeCharges = await this.queryCurrentActiveCharges({ shop, accessToken });
    for (const activeCharge of activeCharges) {
      if (activeCharge.status !== AppSubscriptionStatus.Active) continue;
      await this.mutateChargeCancel(activeCharge.id, { shop, accessToken });
    }
  }

  // Query API
  async queryShopSetting(auth: IShopifyAuth) {
    const client = await this.getGraphqlClient(auth);
    const response = await client.request(
      `#graphql
        query ShopSettings {
            shop {
                billingAddress {
                    address1
                    address2
                    city
                    company
                    country
                    countryCodeV2
                    latitude
                    longitude
                    phone
                    province
                    provinceCode
                    zip
                }
                checkoutApiSupported
                contactEmail
                createdAt
                email
                features {
                    storefront
                }
                ianaTimezone
                id
                myshopifyDomain
                name
                plan {
                    displayName
                    partnerDevelopment
                    shopifyPlus
                }
                primaryDomain {
                    host
                    id
                }
                shopOwnerName
                timezoneAbbreviation
                timezoneOffset
                updatedAt
                url
            }
        }
    `,
    );
    return response?.data;
  }

  async queryCurrentActiveCharges(auth: IShopifyAuth) {
    const client = await this.getGraphqlClient(auth);
    const response = await client.request(
      `#graphql
        query GetCurrentActiveCharges {
            currentAppInstallation {
                activeSubscriptions {
                  createdAt
                  currentPeriodEnd
                  id
                  lineItems {
                    id 
                    plan {
                      pricingDetails {
                        ... on AppRecurringPricing { 
                          interval
                          price {
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                  }
                  name
                  returnUrl
                  status
                  test
                  trialDays
                }
            }
        }
    `,
    );
    return response?.data?.currentAppInstallation?.activeSubscriptions;
  }

  async queryAppInstallationMetafields(auth: IShopifyAuth) {
    const client = await this.getGraphqlClient(auth);
    const response = await client.request(
      `#graphql
        query AppInstallationMetafields($namespace: String){
          currentAppInstallation {
            id
            metafields(namespace: $namespace first: 10) {
              nodes {
                key
                namespace
                value
              }
            }
          }
        }
        `,
      {
        variables: {
          namespace: process.env.SHOPIFY_APP_EXTENSION_NAME,
        },
      },
    );
    return response.data;
  }

  async queryAppInstallationId(auth: IShopifyAuth) {
    const client = await this.getGraphqlClient(auth);
    const response = await client.request(
      `#graphql
        query AppInstallationId {
          currentAppInstallation {
            id
          }
        }
        `,
    );
    return response.data;
  }

  async queryThemes(auth: IShopifyAuth) {
    const client = await this.getGraphqlClient(auth);
    const response = await client.request(
      `#graphql
      query ThemeList {
        themes(first: 20, , roles: [UNPUBLISHED, MAIN]) {
          edges {
            node {
              createdAt
              id
              name
              role
              themeStoreId
              files(filenames: "config/settings_data.json"){
                nodes {
                  body {
                    ... on OnlineStoreThemeFileBodyText {
                      content
                    }
                  }
                  filename
                  contentType

                }
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
      `,
    );
    return response?.data?.themes?.edges;
  }

  // Mutation API
  async mutateShopifyChargeUrl(
    shop: string,
    plan: PricingPlan,
    subscription?: PlanSubscription,
  ): Promise<{ confirmationUrl: string }> {
    if (!subscription) subscription = PlanSubscription.Monthly;
    const planDetail = await this.appPricingPlanRepository.findOne({ where: { plan } });
    if (!planDetail) throw new Error('Plan not found');
    const shopInfo = await this.shopInfoRepository.findOne({ where: { shop } });
    if (!shopInfo) throw new Error('Shop info not found');
    let discount: IShopifyDiscountPayload;
    let interval: AppPricingInterval;
    let price: number;
    let trialDays = planDetail.trialDays;
    let chargeTitle = process.env.SHOPIFY_APP_CHARGE_TITLE;
    if (subscription === PlanSubscription.Yearly) {
      chargeTitle += ` - ${planDetail.displayName} yearly plan`;
      price = Number(planDetail.annuallyPrice);
      interval = AppPricingInterval.Annual;
    } else {
      chargeTitle += ` - ${planDetail.displayName} plan`;
      price = Number(planDetail.price);
      interval = AppPricingInterval.Every_30Days;
    }
    const discountCheck = await this.appPricingService.currentAppliedCode(shop, plan, subscription);
    if (discountCheck !== false && discountCheck.cycleApply === subscription) {
      if (!discountCheck.plansApply || discountCheck.plansApply.includes(plan)) {
        discount = {};
        if (discountCheck?.trialDays) trialDays = discountCheck.trialDays;
        if (discountCheck?.discountValue && discountCheck?.discountType === DiscountType.Percent) {
          const discountPercent = discountCheck.discountValue / 100;
          discount.value = {
            percentage: discountPercent,
          };
        }
        if (discountCheck?.discountValue && discountCheck.discountType === DiscountType.Fixed) {
          const discountPercent = +((price - discountCheck.discountValue) / price);
          discount.value = {
            percentage: discountPercent,
          };
        }
        if (discountCheck.numberCycleApply) {
          discount.durationLimitInIntervals = discountCheck.numberCycleApply;
        }
      }
    }

    const returnUrlPayload = {
      shop,
      plan,
      subscription,
      discount: discount ? true : undefined,
    };
    const variables = {
      name: chargeTitle,
      returnUrl: `${process.env.APP_SERVER_DOMAIN}/shopify/charge?${objectToQuerystring(returnUrlPayload)}`,
      test: process.env.SHOPIFY_APP_CHARGE_TEST_MODE === 'test',
      trialDays,
      replacementBehavior: AppSubscriptionReplacementBehavior.ApplyImmediately,
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails: {
              price: { amount: price, currencyCode: CurrencyCode.Usd },
              interval,
              discount,
            },
          },
        },
      ],
    };
    if (isTestShop(shopInfo)) variables.test = true;
    const client = await this.getGraphqlClient({ shop, accessToken: shopInfo.accessToken });
    const response = await client.request(
      `#graphql
        mutation appSubscriptionCreate($lineItems: [AppSubscriptionLineItemInput!]!, $name: String!, $returnUrl: URL!, $test: Boolean, $trialDays: Int, $replacementBehavior: AppSubscriptionReplacementBehavior) {
          appSubscriptionCreate(lineItems: $lineItems, name: $name, returnUrl: $returnUrl, test: $test, trialDays: $trialDays, replacementBehavior: $replacementBehavior) {
            appSubscription {
              id
            }
            confirmationUrl
            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        variables,
      },
    );
    const confirmationUrl = response.data?.appSubscriptionCreate?.confirmationUrl;
    if (!confirmationUrl) throw new Error('Get confirmationUrl failed');
    return { confirmationUrl };
  }

  async mutationDeleteWebhook(webhookId: string, auth: IShopifyAuth) {
    if (!String(webhookId).includes('gid://shopify')) {
      webhookId = `gid://shopify/WebhookSubscription/${webhookId}`;
    } else {
      webhookId = String(webhookId);
    }
    const client = await this.getGraphqlClient(auth);
    const response = await client.request(
      `#graphql
      mutation webhookSubscriptionDelete($id: ID!) {
        webhookSubscriptionDelete(id: $id) {
          userErrors {
            field
            message
          }
          deletedWebhookSubscriptionId
        }
      }`,
      {
        variables: { id: webhookId },
      },
    );
    return response.data;
  }

  async mutateMetafield(key: 'app_data', metafields: IShopifyAppMetafieldPayload, auth: IShopifyAuth, retry?: boolean) {
    const appInstallationId = await this.queryAppInstallationId(auth);
    const ownerId = appInstallationId.currentAppInstallation.id;
    const client = await this.getGraphqlClient(auth);
    try {
      const response = await client.request(
        `#graphql
          mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafieldsSetInput) {
              metafields {
                id
                namespace
                key
              }
              userErrors {
                field
                message
              }
            }
          }`,
        {
          variables: {
            metafieldsSetInput: {
              key,
              namespace: process.env.SHOPIFY_APP_EXTENSION_NAME,
              ownerId,
              type: 'json',
              value: JSON.stringify(metafields),
            },
          },
        },
      );
      if (response?.data?.metafieldsSet?.userErrors?.length && !retry) {
        throw new Error('Create metafields failed');
      }
      return response.data;
    } catch (err) {
      console.error(err);
      metafields.data = null;
      metafields.manualData = true;
      // metafields.publicKey = await this.adminService.generateShopPublicMetafieldKey(auth.shop);
      if (!retry) await this.mutateMetafield(key, metafields, auth, true);
    }
  }

  async mutateChargeCancel(chargeId: string, auth: IShopifyAuth) {
    if (!String(chargeId).includes('gid://shopify')) chargeId = `gid://shopify/AppSubscription/${chargeId}`;
    else chargeId = String(chargeId);
    const client = await this.getGraphqlClient(auth);
    const response = await client.request(
      `#graphql
        mutation AppSubscriptionCancel($id: ID!) {
          appSubscriptionCancel(id: $id, prorate: $prorate) {
            userErrors {
              field
              message
            }
            appSubscription {
              id
              status
            }
          }
        }
      `,
      {
        variables: { id: chargeId, prorate: true },
      },
    );
    return response.data;
  }

  // Private methods
  private createSession(shop: string, accessToken: string): Session {
    return new Session({ id: '', isOnline: false, shop, state: '', accessToken });
  }

  private async getGraphqlClient(auth: IShopifyAuth): Promise<GraphqlClient> {
    const { shop } = auth;
    let { accessToken } = auth;
    if (!accessToken) {
      const shopSetting = await this.shopInfoRepository.findOne({ where: { shop } });
      accessToken = shopSetting?.accessToken;
    }
    const session = this.createSession(shop, accessToken);
    return new this.shopify.clients.Graphql({ session });
  }

  // Events
  @OnEvent(EventEmitterName.MetafieldAppUpdate)
  async triggerUpdateMetafields(payload: { shop: string }): Promise<void> {
    const shopInfos = await this.shopInfoRepository.find({
      where: { shop: Like(payload.shop) },
      select: { shop: true, accessToken: true },
    });
    const shopsInstall = await this.shopInstalledRepository.find({
      where: { shop: In(shopInfos.map((shopInfo) => shopInfo.shop)), uninstalled: false, closeStore: false },
    });
    const activeShops = shopsInstall.map((shopInstall) => shopInstall.shop);
    const total = shopInfos.length;
    let count = 0;
    for (const shopInfo of shopInfos) {
      console.log(++count, '/', total);
      if (!activeShops.includes(shopInfo.shop)) continue;
      try {
        const metafields: IShopifyAppMetafieldPayload = await this.generateShopAppMetafields(shopInfo.shop);
        await this.mutateMetafield('app_data', metafields, shopInfo);
      } catch (err) {
        console.error(err);
      }
    }
  }
}
