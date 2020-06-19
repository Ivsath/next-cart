import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import { characters } from "shortid";

connectDb();

export default async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Validate name / email / password
    if (!isLength(name, { min: 3, max: 10 })) {
      return res.status(422).send("Name must be 3-10 characters long");
    } else if (!isLength(password, { min: 6 })) {
      return res
        .status(422)
        .send("Password must be at least 6 characters long");
    } else if (!isEmail(email)) {
      return res.status(422).send("Email must be valid");
    }
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
