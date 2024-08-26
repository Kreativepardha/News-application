import React, { useEffect, useState } from "react"
import useNewsStore from "../store/useNews"
import useUserStore from "../store/useUserStore"
import { News } from "../types/userTypes"
import { format } from 'date-fns';


export const NewsList = () => {

    const { news, error, isLoading, fetchAllNews, createNews, updateNews, deleteNews} = useNewsStore()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [image, setImage] = useState<File | null> (null)
    const [editMode, setEditMode] = useState(false)
    const [editId, setEditId] = useState<number | null>(null)

    const userId: number | null = useUserStore((state) =>  state.getUserId());

    useEffect(() => {
        fetchAllNews();
    }, [fetchAllNews])

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if(editMode && editId !== null) {
            await updateNews(editId, title, content, image!);
            setEditMode(false)
            setEditId(null)
        } else {
            await createNews(title, content, image!, userId);
        }
        setTitle('')
        setContent('')
        setImage(null)
    }

    const handleEdit = (id: number, title: string, content: string) =>{
        setEditMode(true);
        setEditId(id)
        setTitle(title)
        setContent(content)
    }

    const handleDelete = async (id: number) => {
        await deleteNews(id)
    } 
    // const formattedDate = format(new Date(newsItem.created_at), 'MMMM dd, yyyy hh:mm a');
    return (
        <div>
            <h1>NEws</h1>
            {isLoading && <p>Loading ...</p> }
            {error && <p> {error}</p>}
            <form onSubmit={handleCreateOrUpdate}>
                <input type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
                <input type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
                    <button type="submit">
                        { editMode ? 'Update News' : 'Create News'  }
                    </button>
                </form>
            <div className="">
                { news.length > 0 ? (
                    news.map((newsItem: News, index: number) => (
                        <div key={index}>
                            <h2> {newsItem.heading}   </h2>
                            <p>{newsItem.news} </p>
                            <p>{format(new Date(newsItem.created_at), 'MMM dd, yyyy hh:mm a')} </p>
                            <img src={newsItem.image} alt={newsItem.title} />
                            <button onClick={() => handleEdit(newsItem.id, newsItem.title, newsItem.content)}>  Edit  </button>
                            <button onClick={() => handleDelete(newsItem.id)}> delete </button>
                        </div>
                    ))
                ):(
                    <p>No news exists</p>
                )
                }
            </div>
        </div>
    )
}



