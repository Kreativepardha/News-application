/* eslint-disable @typescript-eslint/no-explicit-any */
import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../controllers/AuthController';


export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log("AUHTHEADEr", authHeader)
    if(!authHeader) { return res.status(401).json({ message:"No Token provided"   })}
   
    const token = authHeader?.split(' ')[1];

    if(!token)  return res.status(401).json({ message: "Invalid token format"  })

        try {
            const decoded = jwt.verify(token,JWT_SECRET) as jwt.JwtPayload;

            (req as any).user = decoded ;
            
            next()
        } catch (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

}