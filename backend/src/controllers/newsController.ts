import newsTransform from "../transform/newsTransform";
import { Prisma } from "../DB/dbConfig";
import { generateRandomNum, getImageUrl, imageValidator } from "../utils/helper";
import { newsBody } from "../validations/newsValidation"
import redisCache from "../DB/redisConfig";
import logger from "../config/logger";



export const createNews = async (req:any, res:any) => {
        try {   
          
             const body = req.body;
             const {success} = newsBody.safeParse(body)

            if(!req.files || Object.keys(req.files).length === 0){
                return res.status(400).json({
                        message:"Image is required"
                })
            }
        const { title, content, userId } = body;
        const profile = req.files.image

        const message = imageValidator(profile?.size, profile.mimetype)
        if(message) {
            return res.status(400).json({
                errors:{
                    image:message
                }
            })
        }

        const imgExt = profile.name.split(".").pop();
        const imageName = `${generateRandomNum()}.${imgExt}`;
        const uploadPath = `${process.cwd()}/public/images/${imageName}`;

        profile.mv(uploadPath , (err:any) => {
            console.log("image error:", err)
        })
        console.log("Image is",title,"d", content)
        console.log("Image is", profile)
        // insert news data into database
        try {
            const news = await Prisma.news.create({
                data:{
                    title,
                    content,
                    user_id: Number(userId),
                    image: imageName
                }
            });
            // removing cache 
            redisCache.del("/api/v1/news", (err:any) =>{
                if(err) throw err;
            }) 


         


            return res.status(201).json({
                message: "News created successfully",
                news: news,
                imageUrl: getImageUrl(imageName)
            });
        } catch (err) {
            console.error("Database insert error:", err);
                return res.status(500).json({
                    message: "Failed to create news"
                });   
        }

        } catch (err) {
                logger.error(err)
        }
}



export const getNews = async (req:any, res:any) => {
    try {
            const { id } = req.params;
            const news = await Prisma.news.findUnique({
                where:{
                    id:Number(id),
                },
                    include: { user: true }
            });

            if(!news) {
                return res.status(404).json({
                    message:"News not found"
                })

            }

            //formatting news
            const transformedNews = newsTransform(news)
            
            return res.json({
                news:transformedNews,
                imageUrl: getImageUrl(news.image)
            })
    } catch (err) {
        console.error("Error fetching news:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }

}



export const getAllNews = async (req:any, res:any) => {
    try {
        let page = Number (req.query.page) || 1
        let limit = Number(req.query.limit )|| 10

            if(page <= 0 ){
                page = 1
            }
            if(limit <= 0 || limit > 100) {
                limit = 10
            }

            const skip = (page - 1) * limit


        const news = await Prisma.news.findMany({
            take:limit,
            skip:skip,
                include: {
                    user:{
                        select:{
                            id:true,
                            name:true,
                            profile:true,
                        }
                    }
                }
        })
        const total = await Prisma.news.count()

        return res.json({
            news: news.map(n =>( {
                ...newsTransform(n),
                 imageUrl: getImageUrl(n.image)
            })),
            pagination: {
                totalItems: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                pageSize: limit,
            }
        })


    } catch (err) {
        console.error("Error fetching all news:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}



export const deleteNews = async (req:any,res:any) => {
    try {
        const {id} = req.params;
        const deletedNews = await Prisma.news.delete({
            where:{
                id:Number(id)
            }
        }) 
        return res.json({
            message:"News deleted SUccessufly",
            news:deletedNews
        })
    } catch (err) {
        
    }
}




export const updateNews = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const { success, error } = newsBody.safeParse(body);

        if (!success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: error.errors
            });
        }

        const { title, content } = body;
        const updates: any = { title, content };

        if (req.files && req.files.image) {
            const profile = req.files.image;
            const message = imageValidator(profile.size, profile.mimetype);
            if (message) {
                return res.status(400).json({
                    errors: {
                        image: message
                    }
                });
            }

            const imgExt = profile.name.split(".").pop();
            const imageName = `${generateRandomNum()}.${imgExt}`;
            const uploadPath = `${process.cwd()}/public/images/${imageName}`;

            profile.mv(uploadPath, async (err: any) => {
                if (err) {
                    console.error("Image upload error:", err);
                    return res.status(500).json({
                        message: "Failed to upload image"
                    });
                }

                updates.image = imageName;

                try {
                    const news = await Prisma.news.update({
                        where: { id: Number(id) },
                        data: updates,
                    });

                    return res.json({
                        message: "News updated successfully",
                        news: news,
                        imageUrl: getImageUrl(news.image)
                    });

                } catch (error) {
                    console.error("Database update error:", error);
                    return res.status(500).json({
                        message: "Failed to update news"
                    });
                }
            });
        } else {
            // Update without changing the image
            const news = await Prisma.news.update({
                where: { id: Number(id) },
                data: updates,
            });

                //changing format of news
            const transformedNews = news ? newsTransform(news) : null;


            return res.json({
                message: "News updated successfully",
                news: transformedNews,
                // imageUrl: getImageUrl(news.image)
            });
        }

    } catch (err) {
        console.error("Error updating news:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
