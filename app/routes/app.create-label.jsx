import React, { useState, useCallback ,useEffect} from 'react';
import { Page, TextField,Text, Icon, RadioButton, Card,Link, Button,Checkbox,Thumbnail } from '@shopify/polaris';
import { ButtonPressIcon } from '@shopify/polaris-icons';
import { useLoaderData } from '@remix-run/react';
import { ANNUAL_PLAN, MONTHLY_PLAN, authenticate } from '../shopify.server';
import { json } from '@remix-run/node';

export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);

  let plan = { name: "Free" };

  // Check if the shop has an active payment for any plan
  try {
    const billingCheck = await billing.require({
      plans: [MONTHLY_PLAN, ANNUAL_PLAN],
      isTest: true,
      onFailure: () => {
        console.log('Shop does not have any active plans.');
        return json({ billing});
      },
    });

    const subscription = billingCheck.appSubscriptions[0];
    console.log(`Shop is on ${subscription.name} (id ${subscription.id})`);
    plan = subscription;
  } catch (error) {
    console.error('Error fetching plan:', error);
  }

  // Return both imageUrl and plan in the JSON response
  return json({ plan });
}
export default function CreateLabelPage() {
  // States for each checkbox
  const { plan } = useLoaderData();
  const isOnPaidPlan = plan.name !== 'Free';
  const [formState, setFormState] = useState(plan);
  const [selectImageState,setSelectImageState]=useState(plan)
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

  async function selectProductImage() {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select", // customized action verb, either 'select' or 'add',
    });
  
    if (products) {
      const { images, id, title, handle } = products[0];
  
    // Extract the numerical part of the product ID
    const numericalId = id.split('/').pop();

    // Log the numerical part of the selected product's ID to the console
    console.log("Selected product numerical ID:", numericalId);
  
      setSelectImageState({
        ...selectImageState, // Use functional update to ensure we have the latest state
        productId: id,
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
          <div style={{marginTop:'20px'}}>
          <Card>        
          <div style={{marginTop:'10px',marginBottom:'10px'}}>
              <Button onClick={selectProductImage}>Select Product Image</Button>
              <hr />
            </div> 
            {selectImageState.productImage && (
  <div style={{marginLeft:'60px',padding:'10px'}}>
    <img src={selectImageState.productImage} alt={selectImageState.productTitle} style={{ width: '400px', height: '300px' }} />
  </div>
)}
          </Card>
          </div>


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