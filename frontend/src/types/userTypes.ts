


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
    title: string;
    content:string;
    image?:string;
    userId: number;
}