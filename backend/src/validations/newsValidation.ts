import { title } from "process";
import { z } from "zod";


export const newsBody = z.object({
title: z.string()
    .min(5, "Minimum 5 characters required")
    .max(100),
content: z.string()
    .min(10, "Minimum 10 letters required")
    .max(30000, "sorry you have reached max no of chars"),
})