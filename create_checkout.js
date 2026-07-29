import { Polar } from "@polar-sh/sdk";
import 'dotenv/config';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});

async function createCheckout() {
  try {
    const checkout = await polar.checkouts.create({
      product_id: '216d16c1-bbb1-4ff4-94c5-bc4aa4e76fd7', // Put your ID here
      success_url: 'http://localhost:3000/success',
    });
    
    console.log("Success! Your new Checkout ID is:", checkout.id);
    console.log("Use this link to pay:", checkout.url);
  } catch (error) {
    console.error("Error creating checkout:", error);
  }
}

createCheckout();