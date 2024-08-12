import { z } from "zod";


export const RegisterBody = z.object({
  name: z.string()
        .min(2, { message: "Name should contain atleast 2 chars" })
        .max(150, { message:"Name should be less than 150 chars long" }),
  email: z.string()
       .email({message: "Email should be in correct format"}),
  password: z.string()
        .min(6, { message: "Password should be at least 6 chars long"  })
        .max(100, { message: "Password should be less than 100 chars long"})
});

export const LoginBody = z.object({
    email: z.string()
         .email({message: "Email should be in correct format"}),
    password: z.string()
          .min(6, { message: "Password should be at least 6 chars long"  })
          .max(100, { message: "Password should be less than 100 chars long"})
  });