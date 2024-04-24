import {json} from '@remix-run/node'
import db from "../db.server";
import { useState, useEffect} from "react";
import { authenticate } from "../shopify.server";
import { xml2json } from 'xml-js';

import {
    useSubmit,
  } from "@remix-run/react";
  import {
    Layout,
    PageActions,
    InlineStack,
    Button,
    Page,
    Text
  } from "@shopify/polaris";
let receivedData;
 export async function loader({request}) {
    return json({
        data: receivedData
    },
    {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Headers": "*",
      },
    })
}
 
 export async function action({request, params}) {
    console.log("inside action ", params);
    const { session } = await authenticate.admin(request);
    const { shop } = session; 

    const labelProductObjs = {
        ...Object.fromEntries(await request.formData()),
        shop,
      };

    console.log("object ",labelProductObjs)
    const arrayToIterate = [labelProductObjs];

    try{
        arrayToIterate.forEach(async obj => { 
            const data = {
                productHandle: obj.productHandle,
                badgeName: obj.badge_name,
                badgeUrl: obj.badge_url,
                shop: shop,             
            };
        const badge = await db.Badge.findFirst({
                                where: { productHandle: obj.productHandle, 
                                         shop: shop },
                            });
        if(!badge)
        {   
            const createdMapping = await db.badge.create({ data })  
            console.log("Creating new mapping of badge and product", createdMapping); 
        }
        else
        {
            const updatedMapping = await db.badge.update({ where: { productHandle: obj.productHandle },data }) 
            console.log("Updating the mapping of badge and product ",updatedMapping)
        }
        });   

        return json({
            ok:true,
            msg:"POST from API"
        });
    }
    catch (error){
        console.error("Error processing POST request:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

const cdnUrl = "https://blackbyttcdn.blr1.digitaloceanspaces.com";
function BadgeProductMapping(props) {
    const [imageUrls, setImageUrl] = useState([]);

    useEffect(() => {
      async function fetchData() {
        
        // Fetch data
        const response = await fetch(cdnUrl);
        const xmlData = await response.text();
        const xmlString = xml2json(xmlData, { compact: true, spaces: 4 });
        const data = JSON.parse(xmlString)
        console.log("Json Data from DigitalOcean",data); // Output the JSON data
        if (!response.ok) {
            throw new Error('Failed to fetch data'); 
          }
        const results = []
        data.ListBucketResult.Contents.forEach((value) => {
            console.log("value ",value.Key._text);
        const badgeInfo = {
            "label": value.Key._text,
            "value": cdnUrl + "/" + value.Key._text
        }
          results.push(
            badgeInfo,
          );
        });
        console.log("results", results)
        // Update the options state
        setImageUrl([
          ...results
        ]) 
        console.log("imageUrl",imageUrls) 
      }
  
      // Trigger the fetch
      fetchData();

    }, []);
    const [formState, setFormState] = useState();

    async function selectProduct() {
        const products = await window.shopify.resourcePicker({
          type: "product",
          action: "select", 
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
      
        
    const submit = useSubmit();
    function handleSave() {
        console.log("selectedOption.key ",selectedOption.key," selectedOption.label ",selectedOption.label," formState.productHandle ",formState.productHandle)
      const data = {
        "badge_url": selectedOption.value,
        "badge_name": selectedOption.label || "",
        "productHandle": formState.productHandle,
      };
        submit(data, { method: "post" });
    }

    const { label, name, ...rest } = props;
    const [selectedOption, setSelectedOption] = useState({ label: '', value: '' });

    return (
        <Page>
        <div>
        <select onChange={(e) => setSelectedOption({ label: e.target.options[e.target.selectedIndex].text, value: e.target.value })} value={selectedOption.value}>
        {
          imageUrls.map((option) => (
           <option key={option.value} value={option.value}>{option.label}</option>
          ))
        }
        </select> 
        {selectedOption !== undefined ? (
    <p>Selected option: {selectedOption.label} {selectedOption.value}</p>   
) : (
    <p>No option selected</p>
)}
        <Layout.Section>
        <InlineStack align="space-between">
            <Text as={"h2"} variant="headingLg">
                    Product
            </Text>
            <Button variant="plain" onClick={selectProduct}>
                Change product
            </Button>
        </InlineStack>
        <PageActions
            primaryAction={{
              content: "Save",
              onAction: handleSave,
            }}
          />
        </Layout.Section>
      </div>
      </Page>
    );
}

export default BadgeProductMapping;