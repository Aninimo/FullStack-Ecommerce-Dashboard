import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { stripe } from '../../../../lib/stripe';
import prismadb from '../../../../lib/prismadb';
import { ProductProps } from '../../../../types'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'OPTIONS') {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({}));
      return;
    }

    if (req.method === 'POST') {
      const { storeId } = req.query as { storeId: string };
      const { productIds } = req.body;

      if (!productIds || productIds.length === 0) {
        res.status(400).json({ message: 'Product ids are required' });
        return;
      }

      const products = await prismadb.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      products.forEach((product: ProductProps) => {
        line_items.push({
          quantity: 1,
          price_data: {
            currency: 'USD',
              product_data: {
                name: product.name,
              },
            unit_amount:            Math.round(Number(product.price) * 100)
          }
        })
      });

      const order = await prismadb.order.create({
        data: {
          storeId,
          isPaid: false,
          orderItems: {
            create: productIds.map((productId: string) => ({
              product: {
                connect: {
                  id: productId,
                },
              },
            })),
          },
        },
      });

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        billing_address_collection: 'required',
        phone_number_collection: {
          enabled: true,
        },
        success_url: `https://commerce.aninimi2.repl.co/Cart?success=1`,
        cancel_url: `https://commerce.aninimi2.repl.co/Cart?canceled=1`,
        metadata: {
          orderId: order.id,
        },
      });

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({ url: session.url }));
      return;
    }

    res.status(405).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
