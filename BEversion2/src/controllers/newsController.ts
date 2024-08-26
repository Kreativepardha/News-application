import { Request, Response } from "express"
import redisCache from "../config/redisConfig";
import { Prisma } from "../DB/dbConfig";
import { generateRandomNum, getImageUrl, imageValidator } from "../helper";
import newsTransform from "../transform/newsTransform";
import logger from "../config/logger";
import { newsBody } from "../validations/newsValidation";



// user.email = true

class NewsController {
        static async getAllNews(req: Request, res: Response) {
            try {
                    let page = Number(req.query.page) || 1;
                    let limit = Number(req.query.limit) || 10;

                    page = Math.max(page, 1);
                    limit = Math.min(Math.max(limit, 1), 100)
                console.log("hitttttttttttt")
                    const skip = (page - 1) * limit;
                    // const cacheKey = `news:all:${page}:${limit}`
                    // const cachedData = await redisCache.get(cacheKey)

                    // if(cachedData) {
                    //     return res.status(200).json(JSON.parse(cachedData))
                    // }
                    const news = await Prisma.news.findMany({
                        take: limit,
                        skip: skip,
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        profile: true
                                    }
                                }
                            }, orderBy: {
                                created_at: 'desc',
                            }
                    })

                    const total = await Prisma.news.count();

                    const response = {
                        news: news.map(n => ({
                            ...newsTransform(n),
                            imageUrl: getImageUrl(n.image)
                        })),
                        pagination: {
                            totalItems: total,
                            totalPages: Math.ceil(total / limit),
                            currentPage: page,
                            pageSize: limit
                        }
                    }

                    // redisCache.set(cacheKey, JSON.stringify(response), "EX", 60 * 60)

                    return res.status(200).json(response)
            } catch (err) {
                logger.error("error fetching all news", err);
                return res.status(500).json({
                    message: "Internal server Error"
                })
            }
        }
        static async getNews(req: Request, res: Response) {
            try {
                const { id } = req.params;

                // const cachedData = await redisCache.get(`news:${id}`);
                // if(cachedData) {
                //     return res.status(200).json(JSON.parse(cachedData))
                // }
                const news = await Prisma.news.findUnique({
                    where: {  id: Number(id)  },
                    include: { user: true }
                })
                if(!news) {
                    return res.status(404).json({  message: "News not found" })
                }
                const transformedNews = newsTransform(news)

                // redisCache.set(`news:${id}`, JSON.stringify(transformedNews), "EX", 60 * 60)
                
                return res.status(200).json({
                    news: transformedNews,
                    imageUrl: getImageUrl(news.image),
                })
            } catch (err) {
                logger.error("Error fetchng single news item::", err)
                return res.status(500).json({ message: "Internal server error"  })
            }
        }
        static async createNews(req: Request, res: Response) {
            try {
                const body = req.body;
                const result = newsBody.safeParse(req.body);
        
                if (!result.success) {
                    return res.status(400).json({
                        message: "Invalid inputs",
                        errors: result.error?.format(),
                    });
                }
        
                if (!req.files || !req.files.image || Array.isArray(req.files.image)) {
                    return res.status(400).json({
                        message: "An image is required and should be a single file",
                    });
                }
        
                const { title, content, userId } = body;

                const profile = req.files.image;
        
                const validationMessage = imageValidator(profile.size, profile.mimetype);
                if (validationMessage) {
                    return res.status(400).json({
                        errors: {
                            image: validationMessage,
                        },
                    });
                }
        
                const imgExt = profile.name.split(".").pop();
                const imageName = `${generateRandomNum()}.${imgExt}`;
                const uploadPath = `${process.cwd()}/public/images/${imageName}`;
        
                profile.mv(uploadPath, (err) => {
                    if (err) {
                        logger.error("Image upload error:", err);
                        return res.status(500).json({ message: "Failed to upload image" });
                    }
                });
        
                const news = await Prisma.news.create({
                    data: {
                        title,
                        content,
                        user_id: Number(userId),
                        image: imageName,
                    },
                });
        
                // redisCache.del("/api/v1/news", (err: any) => {
                //     if (err) logger.error("Cache deletion error:", err);
                // });
                redisCache.del("/api/v1/news", (err:any) =>{
                    if(err) throw err;
                }) 
    
    
                return res.status(201).json({
                    message: "News created successfully",
                    news: newsTransform(news),
                    imageUrl: getImageUrl(imageName),
                });
            } catch (err) {
                logger.error("Error creating news:", err);
                console.error("err::",err)
                return res.status(500).json({
                    message: "Inaaaaaaaternal server error",
                    err:err
                });
            }
        };
        static async deleteNews(req: Request, res: Response) {
            try {
            const { id } = req.params;
            const deletedNews = await Prisma.news.delete({
                where: {id: Number(id) }
            })

            // redisCache.del("/api/v1/news", (err:any) => {
            //     if(err) logger.error("Cache deletion error::", err);
            // });
            // redisCache.del(`news:${id}`, (err: any) => {
            //     if(err) logger.error("Cache deletion error ::", err);
            // });

            return res.status(200).json({
                message:"News deleted Succesffully",
                news: newsTransform(deletedNews)
            })
        } catch (err) {
            logger.error("Error deleting news:", err);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
        }
        static async updateNews(req: Request, res: Response) {
            try {
                const { id } = req.params;
                const { success, data, error } = newsBody.safeParse(req.body);
        
                if (!success) {
                    return res.status(400).json({
                        message: "Invalid input data",
                        errors: error?.format(),
                    });
                }
        
                const { title, content } = data;
                const updates: any = { title, content };
        
                if (req.files && req.files.image) {
                    const profile = req.files.image;
                
                    if (Array.isArray(profile)) {
                        // Assert that `profile` is an array of `UploadedFile`
                        const firstProfile = profile[0] as any;
                        const validationMessage = imageValidator(firstProfile.size, firstProfile.mimetype);
                
                        if (validationMessage) {
                            return res.status(400).json({
                                errors: {
                                    image: validationMessage,
                                },
                            });
                        }
                
                        const imgExt = firstProfile.name.split(".").pop();
                        const imageName = `${generateRandomNum()}.${imgExt}`;
                        const uploadPath = `${process.cwd()}/public/images/${imageName}`;
                
                        firstProfile.mv(uploadPath, async (err: any) => {
                            if (err) {
                                logger.error("Image upload error:", err);
                                return res.status(500).json({
                                    message: "Failed to upload image",
                                });
                            }
                
                            updates.image = imageName;
                
                            try {
                                const news = await Prisma.news.update({
                                    where: { id: Number(id) },
                                    data: updates,
                                });
                
                                // redisCache.del("/api/v1/news", (err: any) => {
                                //     if (err) logger.error("Cache deletion error:", err);
                                // });
                                // redisCache.del(`news:${id}`, (err: any) => {
                                //     if (err) logger.error("Cache deletion error:", err);
                                // });
                
                                return res.status(200).json({
                                    message: "News updated successfully",
                                    news: newsTransform(news),
                                    imageUrl: getImageUrl(news.image),
                                });
                            } catch (error) {
                                logger.error("Database update error:", error);
                                return res.status(500).json({
                                    message: "Failed to update news",
                                });
                            }
                        });
                
                    } else {
                        // Assert that `profile` is a single `UploadedFile`
                        const profileFile = profile as any;
                        const validationMessage = imageValidator(profileFile.size, profileFile.mimetype);
                
                        if (validationMessage) {
                            return res.status(400).json({
                                errors: {
                                    image: validationMessage,
                                },
                            });
                        }
                
                        const imgExt = profileFile.name.split(".").pop();
                        const imageName = `${generateRandomNum()}.${imgExt}`;
                        const uploadPath = `${process.cwd()}/public/images/${imageName}`;
                
                        profileFile.mv(uploadPath, async (err: any) => {
                            if (err) {
                                logger.error("Image upload error:", err);
                                return res.status(500).json({
                                    message: "Failed to upload image",
                                });
                            }
                
                            updates.image = imageName;
                
                            try {
                                const news = await Prisma.news.update({
                                    where: { id: Number(id) },
                                    data: updates,
                                });
                
                                // redisCache.del("/api/v1/news", (err: any) => {
                                //     if (err) logger.error("Cache deletion error:", err);
                                // });
                                // redisCache.del(`news:${id}`, (err: any) => {
                                //     if (err) logger.error("Cache deletion error:", err);
                                // });
                
                                return res.status(200).json({
                                    message: "News updated successfully",
                                    news: newsTransform(news),
                                    imageUrl: getImageUrl(news.image),
                                });
                            } catch (error) {
                                logger.error("Database update error:", error);
                                return res.status(500).json({
                                    message: "Failed to update news",
                                });
                            }
                        });
                    }
                } else {
                    const news = await Prisma.news.update({
                        where: { id: Number(id) },
                        data: updates,
                    });
                
                    // redisCache.del("/api/v1/news", (err: any) => {
                    //     if (err) logger.error("Cache deletion error:", err);
                    // });
                    // redisCache.del(`news:${id}`, (err: any) => {
                    //     if (err) logger.error("Cache deletion error:", err);
                    // });
                
                    return res.status(200).json({
                        message: "News updated successfully",
                        news: newsTransform(news),
                    });
                }
            }catch(err) {
                logger.error("Error creating news:", err);
                return res.status(500).json({
                    message: "Internal server error",
                });
            }       
        }
        
    }

    export {
        NewsController
    }