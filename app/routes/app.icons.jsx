import React, { useState, useCallback } from 'react';
import { Button, Card, Page, Text, Grid, IndexTable, LegacyCard,RangeSlider, Popover,ColorPicker, TextField, BlockStack ,Select,FormLayout} from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import { json } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';

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
  const navigate = useNavigate(); // Instantiate the navigate function
    
  const handleCreateLabelClick = () => {
    navigate('/app/create-label'); // Use the navigate function to redirect
};
    
    return (
    <Page title='Icons Page'>
       <div style={{margin:'10px'}}>
        <Card>
          <strong>Labels</strong>
          <hr />
          <p>Highlight product images and collection images.</p>
          <Button onClick={handleCreateLabelClick}>Create Label</Button>
        </Card>
       </div>
    </Page>
    );
}
