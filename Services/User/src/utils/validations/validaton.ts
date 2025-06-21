
import { z } from "zod";

export const signupSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Please enter a valid email address" }),

  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name cannot be empty" }),
  password: z
    .string({ required_error: "password is required" })
    .trim()
    .min(3, { message: "password cannot be less than 3" })
    .max(8,{message:"password cannot be greater than 8"}),

});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Please enter a valid email address" }),

  password: z
    .string({ required_error: "password is required" })
    .trim()
    .min(3, { message: "password cannot be less than 3" })
    .max(8,{message:"password cannot be greater than 8"}),

});
