import { supportedMimes } from "../config/fileSystem"
import {v4 as uuidv4} from 'uuid'


export const imageValidator = (size:number, mime: string) => {
    if(bytesToMb(size) > 2) {
        return "Image size must be less than 2 mb"
    }
    else if(!supportedMimes.includes(mime)){
        return "Image must be png jpg jpeg svg gif webp"
    }
    return null;
}


export const  bytesToMb = (bytes:number) => {
        return bytes / (1024 * 1024)
}

export const generateRandomNum = () => {
    return uuidv4();
}


export const getImageUrl = (imgName:any) => {
    return `${process.env.APP_URL}/images/${imgName}`
}