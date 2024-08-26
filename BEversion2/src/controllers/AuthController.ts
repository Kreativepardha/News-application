import {Request, Response} from 'express'
import { loginBody, registerBody } from '../validations/authValidations';
import { any, ZodError } from 'zod';
import { formatError } from '../helper';
import bcrypt from 'bcrypt'
import { Prisma } from '../DB/dbConfig';
import { LoginInterface, RegisterInterface } from '../interfaces/authInterface';
import jwt from 'jsonwebtoken'
import errorMap from 'zod/lib/locales/en';
import { sendEmail } from '../config/mailer';
import logger from '../config/logger';
import { emailQueue, emailQueueName } from '../jobs/SendEmail';



export const JWT_SECRET = process.env.JWT_SECRET  as string  ;

class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const result = registerBody.safeParse(req.body)
                if(!result.success) {
                    return res.status(400).json({
                         message:"Invalid or incomplete inputs" , 
                         errors: formatError(result.error) 
                     });
                }
                const payload: RegisterInterface = result.data

                const existingUser = await Prisma.users.findUnique({
                     where: {  email: payload.email } 
                      })
                      if(existingUser) {
                        return res.status(400).json({
                            message:"User already exists"
                        })
                      }
                      const salt = await bcrypt.genSalt(10)
                      const hashedPassword = await bcrypt.hash(payload.password, salt)
                      const user = await Prisma.users.create({
                        data: {
                            name: payload.name,
                            email: payload.email,
                            password: hashedPassword
                        }
                      })
                   return res.status(201).json({
                        message: "User registered successfully",
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                        }
                      })
        } catch (err) {
            if(err instanceof ZodError) {
                const errors = formatError(err);
                res.status(422).json({message: "Invalid errors:", errors})
            } 
                res.status(500).json({
                    message:"Internal server error", data:err
                })
        }
    }

    static async login(req: Request, res: Response) {
        
        try {
            const result = loginBody.safeParse(req.body);

            if(!result.success) {
                return res.status(402).json({
                    message: "Invalid inputs try again",
                    errors: formatError(result.error)
                })
            }
            const payload: LoginInterface = result.data;

            const user = await Prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            });

            if(!user) {
                return res.status(400).json({
                    message:"User does not exists"
                })
            }
            const isPasswordValid = await bcrypt.compare(payload.password,user.password)
                if(!isPasswordValid) {
                    return res.status(400).json({
                        message:"Invalid email or password"
                    })
                }
            const token = jwt.sign(
                {
                 userId: user.id,
                 email: user.email
                },
                 JWT_SECRET,
                {expiresIn: '30d'} )

                return res.status(200).json({
                    message:"Login successfull",
                    token: `Bearer ${token}`
                })
        } catch (err) {
            if(err instanceof ZodError) {
                const errors = formatError(err);
                res.status(422).json({message: "Invalid errors:", errors})
            }          
            console.error("Login error:", err);  
            res.status(500).json({
                message:"Internal server error", data:err
            })
        }
}
    static async sendToEmail(req: Request, res: Response ){
       try {
        const {email} = req.query;
        const payload = [
            {
            toEmail: email,
            subject: "HEY I AAAAA",
            body: "<h1> TITLE </h1>"
        } ,
        {
            toEmail: email,
            subject: "HEY I BBBBBBBBBBBBBBBBBB",
            body: "<h1> TITLE </h1>"
        } ,
        {
            toEmail: email,
            subject: "HEY I cCcccccccccccccccc",
            body: "<h1> TITLE </h1>"
        } ,
    ]

        console.log("============BEFORE================")
        // await sendEmail(payload.toEmail, payload.subject, payload.body)
        await emailQueue.add(emailQueueName, payload)
        console.log("============AFTER================")
        return res.status(200).json({
            message: "Job added successfully"
        })
    } catch (err) {
            logger.error({ type:"Email Error", body: err})
        return res.status(500).json({message: "Something wen tworng", 
            error: err ,  // Provide the actual error message
        })
    } 
    } 
};


export default AuthController;