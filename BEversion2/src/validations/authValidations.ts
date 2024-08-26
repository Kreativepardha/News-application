import z from 'zod'


export const registerBody  = z.object({
    name: z.string()
        .min(2, {message: "name should contain atleast 2 chars"})
        .max(150, { message: "Name should not contain more than 150 chars" })
        .optional().default('Anonymous'),

    email: z.string()
    .email({ message: "Email should be valid format"}),
    password: z.string()
    .min(3, { message: "password should contain atleast 3 chars"})
    .max(100, {message: "password should not contain more than 100 chars"})
    })


    export const loginBody  = z.object({
        email: z.string()
            .email({ message: "Email should be valid format"}),
        password: z.string()
            .min(3, { message: "password should contain atleast 3 chars"})
            .max(100, {message: "password should not contain more than 100 chars"})
        })
    

    // loginBody.safeparse(req.body)

    // body2 = loginvody.safe()
    //if (!body.sccess){}