import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe'
import { buffer } from 'micro';

import { stripe } from '../../../lib/stripe';
import prismadb from '../../../lib/prismadb';
import { OrderItemProps } from '../../../types'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

const handleStripeWebhook = async (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    const buf = await buffer(req)
	  const sig = req.headers['stripe-signature'] as string

    let event
    
    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret)
    } catch (err: any) {
      console.log("ERROR", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country
    ];

     const addressString = addressComponents.filter((c) => c !== null).join(', ');

     if (event.type === "checkout.session.completed") {
       const order = await prismadb.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || '',
        },
        include: {
          orderItems: true,
        }
      })
      
      const productIds = order.orderItems.map((orderItem) => orderItem.productId);

      await prismadb.product.updateMany({
        where: {
          id: {
            in: [...productIds],
          },
        },
        data: {
          isArchived: true
        }
      })
    }
  }
}

export default handleStripeWebhook;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}
