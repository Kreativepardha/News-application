


export interface User {
    id: number;
    name: string | null;
    email: string;
    password: string;
    image?: string | null;
}


export interface UserLogin {
    email: string;
    password: string;
}

export interface UserRegister extends UserLogin {
    name?: string;
}

export interface News{
    id: number;
    heading: string;
    news:string;
    image?:string;
    userId: number;
    created_at?: string;
}