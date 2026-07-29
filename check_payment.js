import { Polar } from "@polar-sh/sdk";
import 'dotenv/config'; // This loads the token from your .env file

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox", 
});

async function verifyPayment(checkoutId) {
  try {
    const result = await polar.checkouts.get({ id: checkoutId });
    console.log("Payment status:", result.status);
    
    if (result.status === 'succeeded') {
      console.log("Access granted!");
    } else {
      console.log("Payment not completed yet.");
    }
  } catch (error) {
    console.error("Error checking payment:", error);
  }
}

// Replace this with a real checkout ID from your sandbox dashboard to test
verifyPayment("REPLACE_WITH_A_REAL_CHECKOUT_ID");