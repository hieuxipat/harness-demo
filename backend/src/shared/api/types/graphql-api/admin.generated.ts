/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as AdminTypes from './admin.types';

export type ShopSettingsQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type ShopSettingsQuery = { shop: (
    Pick<AdminTypes.Shop, 'checkoutApiSupported' | 'contactEmail' | 'createdAt' | 'email' | 'ianaTimezone' | 'id' | 'myshopifyDomain' | 'name' | 'shopOwnerName' | 'timezoneAbbreviation' | 'timezoneOffset' | 'updatedAt' | 'url'>
    & { billingAddress: Pick<AdminTypes.ShopAddress, 'address1' | 'address2' | 'city' | 'company' | 'country' | 'countryCodeV2' | 'latitude' | 'longitude' | 'phone' | 'province' | 'provinceCode' | 'zip'>, features: Pick<AdminTypes.ShopFeatures, 'storefront'>, plan: Pick<AdminTypes.ShopPlan, 'displayName' | 'partnerDevelopment' | 'shopifyPlus'>, primaryDomain: Pick<AdminTypes.Domain, 'host' | 'id'> }
  ) };

export type GetCurrentActiveChargesQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type GetCurrentActiveChargesQuery = { currentAppInstallation: { activeSubscriptions: Array<(
      Pick<AdminTypes.AppSubscription, 'createdAt' | 'currentPeriodEnd' | 'id' | 'name' | 'returnUrl' | 'status' | 'test' | 'trialDays'>
      & { lineItems: Array<(
        Pick<AdminTypes.AppSubscriptionLineItem, 'id'>
        & { plan: { pricingDetails: (
            Pick<AdminTypes.AppRecurringPricing, 'interval'>
            & { price: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }
          ) } }
      )> }
    )> } };

export type AppInstallationMetafieldsQueryVariables = AdminTypes.Exact<{
  namespace?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type AppInstallationMetafieldsQuery = { currentAppInstallation: (
    Pick<AdminTypes.AppInstallation, 'id'>
    & { metafields: { nodes: Array<Pick<AdminTypes.Metafield, 'key' | 'namespace' | 'value'>> } }
  ) };

export type AppInstallationIdQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type AppInstallationIdQuery = { currentAppInstallation: Pick<AdminTypes.AppInstallation, 'id'> };

export type ThemeListQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type ThemeListQuery = { themes?: AdminTypes.Maybe<{ edges: Array<{ node: (
        Pick<AdminTypes.OnlineStoreTheme, 'createdAt' | 'id' | 'name' | 'role' | 'themeStoreId'>
        & { files?: AdminTypes.Maybe<{ nodes: Array<(
            Pick<AdminTypes.OnlineStoreThemeFile, 'filename' | 'contentType'>
            & { body: Pick<AdminTypes.OnlineStoreThemeFileBodyText, 'content'> }
          )> }> }
      ) }>, pageInfo: Pick<AdminTypes.PageInfo, 'endCursor' | 'hasNextPage' | 'hasPreviousPage'> }> };

export type AppSubscriptionCreateMutationVariables = AdminTypes.Exact<{
  lineItems: Array<AdminTypes.AppSubscriptionLineItemInput> | AdminTypes.AppSubscriptionLineItemInput;
  name: AdminTypes.Scalars['String']['input'];
  returnUrl: AdminTypes.Scalars['URL']['input'];
  test?: AdminTypes.InputMaybe<AdminTypes.Scalars['Boolean']['input']>;
  trialDays?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  replacementBehavior?: AdminTypes.InputMaybe<AdminTypes.AppSubscriptionReplacementBehavior>;
}>;


export type AppSubscriptionCreateMutation = { appSubscriptionCreate?: AdminTypes.Maybe<(
    Pick<AdminTypes.AppSubscriptionCreatePayload, 'confirmationUrl'>
    & { appSubscription?: AdminTypes.Maybe<Pick<AdminTypes.AppSubscription, 'id'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }
  )> };

export type WebhookSubscriptionDeleteMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type WebhookSubscriptionDeleteMutation = { webhookSubscriptionDelete?: AdminTypes.Maybe<(
    Pick<AdminTypes.WebhookSubscriptionDeletePayload, 'deletedWebhookSubscriptionId'>
    & { userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }
  )> };

export type CreateAppDataMetafieldMutationVariables = AdminTypes.Exact<{
  metafieldsSetInput: Array<AdminTypes.MetafieldsSetInput> | AdminTypes.MetafieldsSetInput;
}>;


export type CreateAppDataMetafieldMutation = { metafieldsSet?: AdminTypes.Maybe<{ metafields?: AdminTypes.Maybe<Array<Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key'>>>, userErrors: Array<Pick<AdminTypes.MetafieldsSetUserError, 'field' | 'message'>> }> };

interface GeneratedQueryTypes {
  "#graphql\n        query ShopSettings {\n            shop {\n                billingAddress {\n                    address1\n                    address2\n                    city\n                    company\n                    country\n                    countryCodeV2\n                    latitude\n                    longitude\n                    phone\n                    province\n                    provinceCode\n                    zip\n                }\n                checkoutApiSupported\n                contactEmail\n                createdAt\n                email\n                features {\n                    storefront\n                }\n                ianaTimezone\n                id\n                myshopifyDomain\n                name\n                plan {\n                    displayName\n                    partnerDevelopment\n                    shopifyPlus\n                }\n                primaryDomain {\n                    host\n                    id\n                }\n                shopOwnerName\n                timezoneAbbreviation\n                timezoneOffset\n                updatedAt\n                url\n            }\n        }\n    ": {return: ShopSettingsQuery, variables: ShopSettingsQueryVariables},
  "#graphql\n        query GetCurrentActiveCharges {\n            currentAppInstallation {\n                activeSubscriptions {\n                  createdAt\n                  currentPeriodEnd\n                  id\n                  lineItems {\n                    id \n                    plan {\n                      pricingDetails {\n                        ... on AppRecurringPricing { \n                          interval\n                          price {\n                            amount\n                            currencyCode\n                          }\n                        }\n                      }\n                    }\n                  }\n                  name\n                  returnUrl\n                  status\n                  test\n                  trialDays\n                }\n            }\n        }\n    ": {return: GetCurrentActiveChargesQuery, variables: GetCurrentActiveChargesQueryVariables},
  "#graphql\n        query AppInstallationMetafields($namespace: String){\n          currentAppInstallation {\n            id\n            metafields(namespace: $namespace first: 10) {\n              nodes {\n                key\n                namespace\n                value\n              }\n            }\n          }\n        }\n        ": {return: AppInstallationMetafieldsQuery, variables: AppInstallationMetafieldsQueryVariables},
  "#graphql\n        query AppInstallationId {\n          currentAppInstallation {\n            id\n          }\n        }\n        ": {return: AppInstallationIdQuery, variables: AppInstallationIdQueryVariables},
  "#graphql\n      query ThemeList {\n        themes(first: 20, , roles: [UNPUBLISHED, MAIN]) {\n          edges {\n            node {\n              createdAt\n              id\n              name\n              role\n              themeStoreId\n              files(filenames: \"config/settings_data.json\"){\n                nodes {\n                  body {\n                    ... on OnlineStoreThemeFileBodyText {\n                      content\n                    }\n                  }\n                  filename\n                  contentType\n\n                }\n              }\n            }\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n            hasPreviousPage\n          }\n        }\n      }\n      ": {return: ThemeListQuery, variables: ThemeListQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\n        mutation appSubscriptionCreate($lineItems: [AppSubscriptionLineItemInput!]!, $name: String!, $returnUrl: URL!, $test: Boolean, $trialDays: Int, $replacementBehavior: AppSubscriptionReplacementBehavior) {\n          appSubscriptionCreate(lineItems: $lineItems, name: $name, returnUrl: $returnUrl, test: $test, trialDays: $trialDays, replacementBehavior: $replacementBehavior) {\n            appSubscription {\n              id\n            }\n            confirmationUrl\n            userErrors {\n              field\n              message\n            }\n          }\n        }\n      ": {return: AppSubscriptionCreateMutation, variables: AppSubscriptionCreateMutationVariables},
  "#graphql\n      mutation webhookSubscriptionDelete($id: ID!) {\n        webhookSubscriptionDelete(id: $id) {\n          userErrors {\n            field\n            message\n          }\n          deletedWebhookSubscriptionId\n        }\n      }": {return: WebhookSubscriptionDeleteMutation, variables: WebhookSubscriptionDeleteMutationVariables},
  "#graphql\n          mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {\n            metafieldsSet(metafields: $metafieldsSetInput) {\n              metafields {\n                id\n                namespace\n                key\n              }\n              userErrors {\n                field\n                message\n              }\n            }\n          }": {return: CreateAppDataMetafieldMutation, variables: CreateAppDataMetafieldMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
