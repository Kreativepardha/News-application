import { Prisma } from "../DB/dbConfig";
import { generateRandomNum, imageValidator, getImageUrl } from "../utils/helper";


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


//updating profile picture 
export const updateProfile = async (req:any, res: any) => {
    const { id } = req.params
    const authUser = req.user

    if(!req.files || Object.keys(req.files).length === 0 ){
        return res.status(400).json({
            message:"Profile image is required"
        })
    }
    const profile = req.files.profile

    //image validation
    const message = imageValidator(profile?.size , profile.mimetype)
    if(message !== null) {
        return res.status(400).json({
            errors: {
                profile: message
            }
        })
    }

    //generate image name and set upload path
    const imgExt = profile?.name.split(".")
    const imageName = generateRandomNum() + "." + imgExt[1];
    const uploadPath = process.cwd() + "/public/images/" + imageName;

    //moving file to specifed public folder in Backend folder
    profile.mv(uploadPath , (err:any) => {
        console.log("image error:", err)
    })

    try {
        //stroing in useer profile pic database
        await Prisma.users.update({
            data:{
                profile: imageName,
            },
            where:{
                id:Number(id)
            }
        })
    
        return res.json({
            message:"Profile updates successfully",
            profileImageUrl: getImageUrl(imageName)
        })


    } catch (err) {
        console.error("Database update error:", err);
        return res.status(500).json({
            message: "Failed to update profile"
        });
    }
   


}