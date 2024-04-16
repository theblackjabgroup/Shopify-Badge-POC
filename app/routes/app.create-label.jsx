import React, { useState, useCallback } from 'react';
import { Page, TextField,Text, Icon, RadioButton, Card,Link, Button,Checkbox } from '@shopify/polaris';
import { ButtonPressIcon } from '@shopify/polaris-icons';
import { useLoaderData } from '@remix-run/react';
import { ANNUAL_PLAN, MONTHLY_PLAN, authenticate } from '../shopify.server';
import { json } from '@remix-run/node';


export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);

  try {
    // Attempt to check if the shop has an active payment for any plan
    const billingCheck = await billing.require({
      plans: [MONTHLY_PLAN, ANNUAL_PLAN],
      isTest: true,
      // Instead of redirecting on failure, just catch the error
      onFailure: () => {
        console.log('Shop does not have any active plans.');
        return json({ billing, plan: { name: "Free" } });
      },
    });

    // If the shop has an active subscription, log and return the details
    const subscription = billingCheck.appSubscriptions[0];
    console.log(`Shop is on ${subscription.name} (id ${subscription.id})`);
    return json({ billing, plan: subscription });

  } catch (error) {
    // If there is an error, return an empty plan object
    console.error('Error fetching plan:', error);
    return json({ billing, plan: { name: "Free" } });
  }
}

export default function CreateLabelPage() {
  // States for each checkbox
  const { plan } = useLoaderData();
  const isOnPaidPlan = plan.name !== 'Free';
  const [formState, setFormState] = useState(plan);
  const [isProductPageChecked, setIsProductPageChecked] = useState(false);
  const [isHomePageChecked, setIsHomePageChecked] = useState(false);
  const [isCartPageChecked, setIsCartPageChecked] = useState(false);
  const [isAllImagesOnProductPageChecked, setAllImagesOnProductPageChecked] = useState(true);
  const [isSelectedImagesonProductChecked,setSelectedImagesonProductChecked]=useState(false)
    // State for the width and height input values
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
  
    // Handlers for the width and height input changes
    const handleWidthChange = (newValue) => setWidth(newValue);
    const handleHeightChange = (newValue) => setHeight(newValue);
  // Handlers for each checkbox
  const handleProductPageChange = useCallback((newChecked) => setIsProductPageChecked(newChecked), []);
  const handleHomePageChange = useCallback((newChecked) => setIsHomePageChecked(newChecked), []);
  const handleCartPageChange = useCallback((newChecked) => setIsCartPageChecked(newChecked), []);
  // Corrected handler for the radio button
  const handleAllImagesOnProductPageChange = useCallback(() => {
    // setAllImagesOnProductPageChecked(true);
  }, []);
  const handleSelectedImagesOnProductPageChange = useCallback(() => {
    // setAllImagesOnProductPageChecked(true);
  }, []);



  async function selectProduct() {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select", // customized action verb, either 'select' or 'add',
    });

    if (products) {
      const { images, id, variants, title, handle } = products[0];

      setFormState({
        ...formState,
        productId: id,
        productVariantId: variants[0].id,
        productTitle: title,
        productHandle: handle,
        productAlt: images[0]?.altText,
        productImage: images[0]?.originalSrc,
      });
    }
  }

  return (
    <Page title="Create Label">
      <div className='grid' style={{display: 'grid',gridTemplateColumns: '1.2fr 0.8fr',gap: '10px'}}>
        <div className='product-view-card'>
          <Card>
            <Text as="h1" variant="bodyMd">
                Product View
            </Text>
          </Card>
        </div>
        <div>
          <Card>
            <Text as="h1" variant="bodyMd">
                Select and Optimize Label  
            </Text>
            <div style={{marginTop:'10px'}}>
                <Button variant='primary' >Select Label<Icon source={ButtonPressIcon} tone="base"/></Button>
                <hr />
            </div>
            <div style={{marginTop:'10px',marginBottom:'10px'}}>
              <Button onClick={selectProduct}>Select Products</Button>
              <hr />
            </div>
            <div className='label-size' style={{marginTop:'10px',marginBottom:'10px'}}>
            <Text><strong>Label Size</strong></Text>
      <div style={{display:'flex', flexDirection:'row', alignItems: 'center', gap: '10px',marginBottom:'5px'}}>
        <TextField
          label="Width"
          type="text"
          value={width}
          onChange={handleWidthChange}
          suffix="%"
          autoComplete="off"
        />
        <TextField
          label="Height"
          type="text"
          value={height}
          onChange={handleHeightChange}
          suffix="%"
          autoComplete="off"
        />
      </div>
      <Text>The label size will adjust based on the percentages of the product/collection image.</Text>
      <hr />
            </div>
            <div className='label-page-selection' style={{textAlign: 'left', marginTop:'10px'}}>
              <Text as="h3" variant="bodyMd" bold><strong>Show Label On</strong></Text>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <Checkbox
                  label="Product Page"
                  checked={isProductPageChecked}
                  onChange={handleProductPageChange}
                />
                <Checkbox
                  label="Home Page"
                  checked={isHomePageChecked}
                  onChange={handleHomePageChange}
                />
                <Checkbox
                  label="Cart Page"
                  checked={isCartPageChecked}
                  onChange={handleCartPageChange}
                />
              </div>
              <hr />
            </div>
            <div className='image-for-label-selection' style={{marginTop:'10px'}}>
              <Text as="h3" variant="bodyMd" bold><strong>On Pages Show Label on</strong></Text>
              <div>
                <RadioButton
                  label="All Images"
                  checked={isAllImagesOnProductPageChecked}
                  id="enabled"
                  // Since you want it always enabled, you don't provide a way to change its state
                  onChange={handleAllImagesOnProductPageChange}
                />
              </div>
              <div>
                <RadioButton
                disabled={!isOnPaidPlan}
                  label="Selected Images"
                  checked={isSelectedImagesonProductChecked}
                  id="enabled"
                  // Since you want it always enabled, you don't provide a way to change its state
                  onChange={handleSelectedImagesOnProductPageChange}
                />
              </div>
              {isOnPaidPlan ? '':<Link url="/app/payments">Upgrade</Link>}            
              <hr />
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}