const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { items, userId } = req.body;
  const transformedItems = items.map((item) => ({
    quantity: 1,
    price_data: {
      // description: item.description,
      currency: "inr",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [item.image],
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // shipping_rates: ["shr_1O5vg5SGiXeAvoGp4gDzcJeq"],
    shipping_address_collection: {
      allowed_countries: ["GB", "US", "CA", "IN"],
    },
    line_items: transformedItems,
    mode: "payment",
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/checkout`,
    metadata: {
      userId,
      images: JSON.stringify(items.map((item) => item.image)),
    },
  });

  res.status(200).json({ id: session.id });
};
