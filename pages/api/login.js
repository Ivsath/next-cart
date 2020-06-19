import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connectDb();

export default async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists with the provided email
    const user = await User.findOne({ email }).select("+password");
    // --if not, return error
    if (!user) {
      return res.status(404).send(`No user exist with email ${email}`);
    }
    // Check to see if users' password matches the one in the db
    const passwordsMatch = await bcrypt.compare(password, user.password);

    // --if so, generate token
    if (passwordsMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      // Send token back to the client
      res.status(200).json(token);
    } else {
      res.status(401).send("Incorrect password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
};
