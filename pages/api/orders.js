import jwt from "jsonwebtoken";

import Order from "../../models/Order";
import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }

  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const orders = await Order.find({ user: userId }).populate({
      path: "products.product",
      model: Product,
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
};
