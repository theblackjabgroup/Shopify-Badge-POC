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
      returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/payments?upgrade_initiated=true`,
    }),
  });

  return null;
}

// import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server";

// export async function loader({ request }) {
//   const { billing, session } = await authenticate.admin(request);
//   let { shop } = session;

//   let myShop = shop.replace(".myshopify.com", "");
//   let url = new URL(request.url);
//   let plan_item = url.searchParams.get('plan_item') || 'monthly';
  
//   let plan = plan_item === 'monthly' ? MONTHLY_PLAN : ANNUAL_PLAN;

//   // Fetch current plan details
//   const currentBillingStatus = await billing.require({
//     plans: [MONTHLY_PLAN, ANNUAL_PLAN],
//     onFailure: async () => billing.request({
//       plan: plan,
//       isTest: true,
//       returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/payments?upgrade_initiated=true`,
//     }),
//   });

//   if (currentBillingStatus.appSubscriptions && currentBillingStatus.appSubscriptions.length > 0) {
//     const currentPlan = currentBillingStatus.appSubscriptions[0].name;

//     // Check if the current plan is different from the selected plan
//     if ((plan_item === 'monthly' && currentPlan !== MONTHLY_PLAN.name) ||
//         (plan_item === 'annual' && currentPlan !== ANNUAL_PLAN.name)) {
//       // Initiate the plan change
//       await billing.request({
//         plan: plan,
//         isTest: true,
//         returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/payments?upgrade_initiated=true`,
//       });
//     }
//   } else {
//     // If no active subscription is found, request the selected plan
//     await billing.request({
//       plan: plan,
//       isTest: true,
//       returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/payments?upgrade_initiated=true`,
//     });
//   }

//   return null;
// }
