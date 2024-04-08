import React, { useState } from 'react';
import { Button, Card, Page, Text, Grid, IndexTable, LegacyCard, Badge, useIndexResourceState } from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ request }) {
    const { admin } = await authenticate.admin(request);
    let allProducts = [];
    let lastCursor = null;
    let hasNextPage = true;

    while (hasNextPage) {
        const query = `
        {
          products(first: 250, after: ${lastCursor ? `"${lastCursor}"` : null}) {
            edges {
              node {
                id
                title
                description
              }
              cursor
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      `;

        const response = await admin.graphql(query);
        const parsedResponse = await response.json();
        const products = parsedResponse.data.products.edges.map(edge => edge.node);
        allProducts = [...allProducts, ...products];

        hasNextPage = parsedResponse.data.products.pageInfo.hasNextPage;
        if (hasNextPage) {
            lastCursor = parsedResponse.data.products.edges[parsedResponse.data.products.edges.length - 1].cursor;
        }
    }

    return json({
        products: allProducts,
    });
}

export default function ButtonExample() {
    const { products } = useLoaderData();
    const [selectedProducts, setSelectedProducts] = useState([]);

    async function selectProduct() {
        const selectedProducts = await window.shopify.resourcePicker({
          type: "product",
          action: "select", // customized action verb, either 'select' or 'add',
        });

        if (selectedProducts) {
          const updatedSelectedProducts = selectedProducts.map(product => ({
            id: product.id,
            title: product.title,
            description: product.description
          }));

          setSelectedProducts(updatedSelectedProducts);
        }
      }

    return (
        <Page title='Icons Page'>
            <Card sectioned>
                <Text as="h2" variant="bodyMd">
                    Add Icons to your products
                </Text>
                <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <LegacyCard title="Design Icons" sectioned>
                            <Button onClick={selectProduct}><strong>Select Products</strong></Button>
                        </LegacyCard>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <LegacyCard title="Preview" sectioned>
                            <p>View a summary of your online store’s orders.</p>
                        </LegacyCard>
                    </Grid.Cell>
                </Grid>
            </Card>

            {selectedProducts.length > 0 && (
                <Card sectioned>
                    <Text as="h2">Selected Products</Text>
                    <IndexTable
                        resourceName={{
                            singular: 'Product',
                            plural: 'Products',
                        }}
                        selectedItems={selectedProducts.map(product => product.id)}
                        onSelectionChange={(selected) => {
                            const updatedSelectedProducts = products.filter(product => selected.includes(product.id));
                            setSelectedProducts(updatedSelectedProducts);
                        }}
                        itemCount={selectedProducts.length}
                        headings={[
                            { title: 'Title' },
                            { title: 'Description' },
                        ]}
                    >
                        {selectedProducts.map((product, index) => (
                            <IndexTable.Row
                                key={product.id}
                                id={product.id}
                                selected={true}
                                position={index}
                            >
                                <IndexTable.Cell>
                                    <Text>{product.title}</Text>
                                </IndexTable.Cell>
                                <IndexTable.Cell>{product.description}</IndexTable.Cell>
                            </IndexTable.Row>
                        ))}
                    </IndexTable>
                </Card>
            )}
        </Page>
    );
}
