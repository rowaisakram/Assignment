import { compare, hash } from "bcrypt";
import UserModel from "../../model/user/index.js";
import jwt from "jsonwebtoken";

const authController = {
  signup: async (req, res) => {
    try {
      const payload = req.body;
      const userCheck = await UserModel.findOne({
        where: {
          email: payload.email,
        },
      });
      if (userCheck) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
      const hpassword = await hash(payload.password, 10);
      const user = await UserModel.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: hpassword,
      });
      res.status(201).json({
        message: "User Created Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  signin: async (req, res) => {
    try {
      const payload = req.body;

      const userCheck = await UserModel.findOne({
        where: {
          email: payload.email,
        },
      });
      if (!userCheck) {
        return res.status(401).json({
          message: "Invalid Credentials",
        });
      }

      const comparepass = await compare(payload.password, userCheck.password);
      if (!comparepass) {
        return res.status(401).json({
          message: "Invalid Credentials",
        });
      }
      const data = {
        id: userCheck.id,
        email: userCheck.email,
      };
      const token = jwt.sign(data, process.env.JWT_SECRET_Key, {
        expiresIn: "1h",
      });
      res.status(200).json({
        message: "Login Successfully",
        data,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
};
export default authController;
