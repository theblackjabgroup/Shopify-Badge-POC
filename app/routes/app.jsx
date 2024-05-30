import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import { PlanProvider } from "./app.plancontext"; // Import the PlanProvider

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
     <PlanProvider>
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
         <Link to="/app/getstarted">Get Started</Link>
         <Link to="/app/labels">Labels</Link>
        <Link to="/app/api">Add-Badge</Link>
        <Link to="/app/badges">Badges</Link>
        <Link to="/app/additional">Additional page</Link>
        <Link to="/app/payments">Payments</Link>
      </ui-nav-menu>
      <Outlet />
      </PlanProvider>
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
