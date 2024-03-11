import { json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import shopify from "app/shopify.server";

export async function loader({ request }) {
  const { admin } = await shopify.authenticate.admin(request);
  const response = await admin.graphql(`
    {
      products(first: 10) {
        nodes {
          id
          title
          description
        }
      }
    }
  `);

  const parsedResponse = await response.json();

  return json({
    products: parsedResponse.data.products.nodes,
   });
 }

 export default function Productpage() {
  const { products } = useLoaderData();

  return (
    <div>
      <h1>Shopify Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            {/* Add additional product details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}