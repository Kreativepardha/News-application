import jwt, { JwtPayload } from 'jsonwebtoken'


export const authMiddleware = ( req:any, res:any, next:any ) =>{
        const authHeader= req.headers.authorization
        console.log("auth header is ",authHeader)
        if(!authHeader) {
            return res.status(401).json({  message:"User is not authentictaed" })
        }

        const token  = authHeader.split(` `)[1];
        if (token == null) return res.status(401).json({ message: 'Unauthorized' });
    if(!token)  return res.status(401).json({ message: "User is not authenticated"  })

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

            req.user = decoded

            next()
        } catch (err) {
            return res.status(401).json({   message: "Invalid  TOken"})
        }



    }