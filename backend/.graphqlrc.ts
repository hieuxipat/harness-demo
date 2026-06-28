import { shopifyApiProject, ApiType } from '@shopify/api-codegen-preset';

export default {
  // For syntax highlighting / auto-complete when writing operations
  schema: 'https://shopify.dev/admin-graphql-direct-proxy',
  documents: ['./src/shared/api/services/shopify-graphql.service.ts'],
  ignoreNoDocuments: true,
  projects: {
    // To produce variable / return types for Admin API operations
    default: shopifyApiProject({
      apiType: ApiType.Admin,
      apiVersion: '2025-04',
      documents: ['./src/shared/api/services/shopify-graphql.service.ts'],
      outputDir: './src/shared/api/types/graphql-api',
      declarations: false,
    }),
  },
};
