/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { Prisma } from "../DB/dbConfig";
import { generateRandomNum, getImageUrl, imageValidator } from "../helper";



class UserContoller {
    static async getUser(req: Request, res: Response) {
  try {
          const userId = (req as any).user?.userId;
          if(!userId) {
          return res.status(401).json({ message:"user id is missing"  })
          }
          
          const user = await Prisma.users.findUnique({
            where: {
                id:userId
            },
            select: {
                id:true,
                name:true,
                email:true
            }
          });
          if(!user) {
            return res.status(404).json({
                message:"user not found"
            })
          }
          return res.status(200).json({
            user
          })
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
    static async updateProfile(req: any,res: Response) {
        try {
            const { id } = req.params;
            // const authUser = req.user;
            if(!req.files || Object.keys(req.files).length === 0) {
                    return  res.status(400).json({
                        message:"Profile image is required"
                    })
            }
            const profile = req.files.profile

            const message = imageValidator(profile?.size, profile.mimetype)
            if(message !== null) {
                return res.status(400).json({
                    errors: {
                        profile: message
                    }
                })
            }

            const imgExt = profile?.name.split(".")
            const imageName = generateRandomNum() + "." + imgExt[1]
            const uploadPath = process.cwd() + "/public/image/" + imageName

            profile.mv(uploadPath, (err: any) => {
                console.log("image error:" ,err)
            })

            await Prisma.users.update({
                data:{
                    profile: imageName,
                },
                where:{
                    id: Number(id)
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
    }

    export default UserContoller;