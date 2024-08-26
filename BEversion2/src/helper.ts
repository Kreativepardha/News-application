import { ZodError } from "zod";
import {v4 as uuidv4} from 'uuid'



export const formatError = (error: ZodError):any => {
    let errors: any = {};
    error.errors?.map((issue) => {
        errors[issue.path?.[0]] = issue.message;
    })

    return errors;
}

export const supportedMimes = ["image/png", "image/jpg", "image/jpeg", "image/svg", "image/gif"]

export const imageValidator = (size: number, mime: string) :any => {
    if(bytesToMb(size) > 2) {
        return "Image size must be less than 2 mb"
    }
    else if (!supportedMimes.includes(mime)) {
        return "image must be of png jpg jpeg svg gif or webp format"
    }
    return null;
}


export const generateRandomNum = () => {
    return uuidv4();
}


export const  bytesToMb = (bytes: number) => {
    return bytes / (1024 * 1024)
}

export const getImageUrl = (imgName:any) => {
    return `${process.env.APP_URL}/images/${imgName}`
}