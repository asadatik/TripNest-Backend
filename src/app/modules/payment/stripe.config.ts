import Stripe from "stripe";
import { envVars } from "../../config/env"; // adjust path to your env util

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || envVars.STRIPE_SECRET_KEY;

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
});
