import { Prisma } from "../DB/dbConfig";


export const getUser = async (req:any, res:any) =>{
    const userId = req.user?.userId;
    if(!userId) {
    return res.status(400).json({    message:"user id is missing"})
    }  
    try {
        const user = await Prisma.users.findUnique({
        where: { id: userId},
        select: {
            id:true,
            name: true,
            email: true,
        }
        });
        if(!user) {
            return res.status(404).json({
                message:"User not found"
            })
        }
    return res.status(200).json({ 
        message: "user details retrieveed",
        user  
    })

    } catch (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }

}