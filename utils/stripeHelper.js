import Stripe from "stripe";

export const createPaymentIntent = async(amount) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Stripe expects amount in smallest currency unit (paise for INR, cents for USD)
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        automatic_payment_methods: { enabled: true },
    });

    return paymentIntent;
};