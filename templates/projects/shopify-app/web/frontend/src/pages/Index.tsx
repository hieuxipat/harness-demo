import { Page, Layout, Card, Text, BlockStack } from '@shopify/polaris';

export const IndexPage = () => {
  return (
    <Page title="{{project_name}}">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Welcome to {{project_name}}
              </Text>
              <Text as="p" variant="bodyMd">
                Your Shopify app is ready. Start building!
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
