"use server";
import { client } from "@/lib/prisma";
import Stripe from "stripe";
import { onAuthenticatedUser } from "./auth";

// Initialize Stripe with versioning and secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  typescript: true,
  apiVersion: "2024-06-20",
});

// Define constants for reusability
const CURRENCY = "usd";
const COMMISSION_AMOUNT = 3960;  // In smallest currency unit (cents)
const SUBSCRIPTION_AMOUNT = 9900;

// Centralized error messages
const ERROR_MESSAGES = {
  PAYMENT_INTENT_FAIL: "Failed to create payment intent.",
  TRANSFER_FAIL: "Failed to complete commission transfer.",
  FETCH_SUBSCRIPTION_FAIL: "Failed to retrieve active subscription.",
  FORM_LOAD_FAIL: "Failed to load form.",
  CREATION_FAIL: "Failed to create subscription.",
  ACTIVATION_FAIL: "Failed to activate subscription.",
  USER_FETCH_FAIL: "Failed to retrieve user information.",
};

// Create centralized error handler
const handleError = (error: any, message: string) => {
  console.error(message, error);
  return { status: 400, message };
};

// 1. Generate Client Secret for Payment
export const onGetStripeClientSecret = async () => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: CURRENCY,
      amount: SUBSCRIPTION_AMOUNT,
      automatic_payment_methods: { enabled: true },
    });

    return paymentIntent ? { secret: paymentIntent.client_secret } : null;
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.PAYMENT_INTENT_FAIL);
  }
};

// 2. Transfer Commission to a Destination Account
export const onTransferCommission = async (destination: string) => {
  if (!destination) {
    return { status: 400, message: "Destination account is required." };
  }
  try {
    const transfer = await stripe.transfers.create({
      amount: COMMISSION_AMOUNT,
      currency: CURRENCY,
      destination,
    });

    return transfer ? { status: 200 } : null;
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.TRANSFER_FAIL);
  }
};

// 3. Fetch Active Subscription by Group ID
export const onGetActiveSubscription = async (groupId: string) => {
  if (!groupId) return { status: 400, message: "Group ID is required." };

  try {
    const subscription = await client.subscription.findFirst({
      where: { groupId, active: true },
    });

    return subscription ? { status: 200, subscription } : { status: 404 };
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.FETCH_SUBSCRIPTION_FAIL);
  }
};

// 4. Create Payment Intent for Group Subscription
export const onGetGroupSubscriptionPaymentIntent = async (groupId: string) => {
  if (!groupId) return { status: 400, message: "Group ID is required." };

  try {
    const groupDetails = await client.subscription.findFirst({
      where: { groupId, active: true },
      select: {
        price: true,
        Group: {
          select: {
            User: { select: { stripeId: true } },
          },
        },
      },
    });

    if (groupDetails && groupDetails.price) {
      const paymentIntent = await stripe.paymentIntents.create({
        currency: CURRENCY,
        amount: groupDetails.price * 100,
        automatic_payment_methods: { enabled: true },
      });

      return paymentIntent ? { secret: paymentIntent.client_secret } : null;
    }
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.FORM_LOAD_FAIL);
  }
};

// 5. Create New Group Subscription
export const onCreateNewGroupSubscription = async (groupId: string, price: string) => {
  if (!groupId || !price) return { status: 400, message: "Group ID and price are required." };

  try {
    const subscription = await client.group.update({
      where: { id: groupId },
      data: {
        subscription: {
          create: { price: parseInt(price) },
        },
      },
    });

    return subscription ? { status: 200, message: "Subscription created." } : null;
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.CREATION_FAIL);
  }
};

// Helper to Activate Subscription and Deactivate Previous Active Ones
const activateSubscription = async (id: string) => {
  // Fetch any active subscription and deactivate it
  const currentActive = await client.subscription.findFirst({
    where: { active: true },
    select: { id: true },
  });

  if (currentActive) {
    await client.subscription.update({
      where: { id: currentActive.id },
      data: { active: false },
    });
  }
  
  // Activate the new subscription
  return await client.subscription.update({
    where: { id },
    data: { active: true },
  });
};

// 6. Activate a Specific Subscription by ID
export const onActivateSubscription = async (id: string) => {
  if (!id) return { status: 400, message: "Subscription ID is required." };

  try {
    const currentStatus = await client.subscription.findUnique({
      where: { id },
      select: { active: true },
    });

    if (currentStatus?.active) {
      return { status: 200, message: "Plan already active." };
    }

    const updatedSubscription = await activateSubscription(id);
    return updatedSubscription ? { status: 200, message: "New plan activated." } : null;
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.ACTIVATION_FAIL);
  }
};

// 7. Retrieve User Stripe Integration ID
export const onGetStripeIntegration = async () => {
  try {
    const user = await onAuthenticatedUser();
    const stripeData = await client.user.findUnique({
      where: { id: user.id },
      select: { stripeId: true },
    });

    return stripeData ? stripeData.stripeId : null;
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.USER_FETCH_FAIL);
  }
};
