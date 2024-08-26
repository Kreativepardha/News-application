import { getImageUrl } from "../helper"



const newsTransform = (news: any) => {
    return {
        id: news.id,
        heading: news.title,
        news: news.content,
        image: getImageUrl(news.image),
        created_at: news.created_at,
        reporter: {
            id: news?.userId?.id,
            name: news?.user_id.name,
            profile: news?.user_id?.profile? getImageUrl(news.user.profile) : "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png"
        
        }
    }
}

export default newsTransform