import { supportedMimes } from "../config/fileSystem"

export const imageValidator = (size:any, mime:any) => {
    if(bytesToMb(size) > 2) {
        return "Image size must be less than 2 mb"
    }
    else if(supportedMimes.includes(mime)){
        return "Image must be png jpg jpeg svg gif webp"
    }

    return null;





}


export const  bytesToMb = (bytes:any) => {
        return bytes / (1024 * 1024)
}