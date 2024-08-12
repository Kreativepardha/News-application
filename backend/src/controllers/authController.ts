import { Prisma } from "../DB/dbConfig";
import { LoginBody, RegisterBody } from "../validations/AuthValidation";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const JWT_SECRET= process.env.JWT_SECRET;

export const register = async (req:any, res:any) => {
        const body = req.body;
        const {success} = RegisterBody.safeParse(body);
            if(!success) {
                return res.status(400).json({
                    message:"Invalid inputs"
                })
            };
    try {
        const existingUser = await Prisma.users.findUnique({
                                where: {
                                    email:body.email
                                }
                            })
                                if(existingUser) {
                                    return res.status(400).json({
                                        message:"Email Already Taken"
                                    })
                                }
                            const salt = bcrypt.genSaltSync(10);
                            const hashedPassword =  bcrypt.hashSync(body.password, salt);
                            const user = await Prisma.users.create({
                            data:{
                                name:body.name,
                                email:body.email,
                                password:hashedPassword
                            }  
                            })
                    return res.status(201).json({
                        message:"USer Registered successfully",
                        user
                    })
                    } catch (err) {
                        console.error("error creating user", err);
                        return res.status(500).json({
                            message:"Internal Server Error"
                        })
                        
    }};

export const login = async (req:any, res:any) => {
    const body = req.body;

    const validation = LoginBody.safeParse(body)
    if(!validation.success) {
        return res.status(400).json({
            message:"Invalid inputs",
            errors: validation.error.errors
        })
    }

    const user = await Prisma.users.findUnique({
        where:{
            email: body.email        }
    })
    if(!user) {
        return res.status(401).json({
            message:" Invalid User"
        })
    }

    const isPasswordValid = bcrypt.compareSync(body.password, user.password)

    if(!isPasswordValid) {
        return res.status(401).json({
            message:"Invalid Pasword"
        })
    }

    const token = jwt.sign(
        { userId:user.id, email: user.email  }, JWT_SECRET as string
    )

    return res.status(200).json({
        message:"Login Success",
        user:{
            id: user.id, name:user.name, email:user.email
        },
        token: `Bearer ${token}`
    })
}