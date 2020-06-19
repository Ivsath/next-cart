import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connectDb();

export default async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the user already exists in the db
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).send(`A user already exists with email ${email}`);
    }
    // --if not, hash their password
    const hash = await bcrypt.hash(password, 10);
    // Create user
    const newUser = await new User({
      name,
      email,
      password: hash,
    }).save();
    console.log({ newUser });
    // Create token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Send back token
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signup user. Please try again later");
  }
};
