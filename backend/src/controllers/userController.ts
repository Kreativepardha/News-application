import { Prisma } from "../DB/dbConfig";
import { imageValidator } from "../utils/helper";


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

export const updateUser = async (req:any, res: any) => {
    const { id } = req.params
    const authUser = req.user

    if(!req.files || Object.keys(req.files).length === 0 ){
        return res.status(400).json({
            message:"Profile image is required"
        })
    }
    const profile = req.files.profile
    const message = imageValidator(profile?.size , profile.mimetype)
    if(message !== null) {
        return res.status(400).json({
            errors: {
                profile: message
            }
        })
    }
}