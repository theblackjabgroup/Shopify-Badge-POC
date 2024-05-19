// import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server";
// export async function loader({ request }) {
//   const { billing, session } = await authenticate.admin(request);
//   let { shop } = session;
//   const { plan_item } = new URLSearchParams(request.url.search);
//   console.log("the plan is :", plan_item);
// let myShop = shop.replace(".myshopify.com", "");
// await billing.require({
//   plans: [MONTHLY_PLAN, ANNUAL_PLAN],
// onFailure: async () => billing.request({
//   plan: plan_item === 'monthly' ? MONTHLY_PLAN : ANNUAL_PLAN,
//   isTest: true,
//  returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/payments`,
//  }),
//  });

//  return null; }


import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server";

export async function loader({ request }) {
  const { billing, session } = await authenticate.admin(request);
  let { shop } = session;

  let myShop = shop.replace(".myshopify.com", "");
  let url = new URL(request.url);
  let plan_item = url.searchParams.get('plan_item') || 'monthly';
  
  let plan = plan_item === 'monthly' ? MONTHLY_PLAN : ANNUAL_PLAN;

  await billing.require({
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    onFailure: async () => billing.request({
      plan: plan,
      isTest: true,
      returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/payments`,
    }),
  });

  return null;
}
