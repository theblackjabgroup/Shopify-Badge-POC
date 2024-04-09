import React, { useState, useCallback } from 'react';
import { Button, Card, Page, Text, Grid, IndexTable, LegacyCard,RangeSlider, Badge, useIndexResourceState } from '@shopify/polaris';
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
    const [rangeValue, setRangeValue] = useState(32);

    const handleRangeSliderChange = useCallback(
      (value) => setRangeValue(value),
      [],
    );

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
                        <ul role="tablist" class="Polaris-Tabs">
                            <li class="Polaris-Tabs__TabContainer" role="presentation">
                                <button
                                 id="desktop"
                                role="tab" 
                                type="button" 
                                tabindex="0" 
                                class="Polaris-Tabs__Tab Polaris-Tabs__Tab--selected" 
                                aria-selected="true" 
                                aria-controls="desktop-panel">
                                    <span class="Polaris-Tabs__Title">Desktop preview</span>
                                    </button></li>
                                    <li class="Polaris-Tabs__TabContainer" role="presentation">
                                        <button 
                                        id="mobile" 
                                        role="tab" 
                                        type="button" 
                                        tabindex="-1" 
                                        class="Polaris-Tabs__Tab" 
                                        aria-selected="false" 
                                        aria-controls="mobile-panel">
                                            <span class="Polaris-Tabs__Title">Mobile preview</span>
                                            </button></li><li 
                                            class="Polaris-Tabs__DisclosureTab" 
                                            role="presentation"><div>
                                                <button 
                                                type="button" 
                                                class="Polaris-Tabs__DisclosureActivator" 
                                                aria-label="More tabs" 
                                                tabindex="0" 
                                                aria-controls="Polarispopover6" 
                                                aria-owns="Polarispopover6" 
                                                aria-expanded="false">
                                                    <span class="Polaris-Tabs__Title">
                                                        <span class="Polaris-Icon Polaris-Icon--colorSubdued Polaris-Icon--applyColor">
                                                            <span class="Polaris-VisuallyHidden">
                                                                </span>
                                                                <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                                                                    <path d="M6 10a2 2 0 1 1-4.001-.001 2 2 0 0 1 4.001.001zm6 0a2 2 0 1 1-4.001-.001 2 2 0 0 1 4.001.001zm6 0a2 2 0 1 1-4.001-.001 2 2 0 0 1 4.001.001z"></path>
                                                                    </svg>
                                                                    </span>
                                                                    </span>
                                                                    </button>
                                                                    </div>
                                                                    </li>
                                                                    </ul>
                        
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

            
          
            <Card sectioned  spacing="10px" >
            <Text as="h1" variant="bodyLg">
                   Style
                </Text> 
                <RangeSlider
        label="Icon Size"
        value={rangeValue}
        onChange={handleRangeSliderChange}
        output
      />
            </Card>
            


        </Page>
    );
}
