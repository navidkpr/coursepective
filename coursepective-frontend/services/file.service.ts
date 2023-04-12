import axios from "axios";
import moment from "moment";
import AppConfig from "../config/app_config";

export interface File {
    rating: number,
    id: string,
    timePosted: string,
    location: string,
    name: string,
    user: {
        profilePictureUrl: string,
        email: string,
    }
}

class FileService {

    async getCourseFiles(courseId: string, userEmail: string | null | undefined): Promise<File[]>  {
        let files: File[]
        if (!userEmail) {
            files = (await axios.get(`${AppConfig.Backend.BaseUrl}/files/course/${courseId}`)).data.files
        } else {
            files = (await axios.get(`${AppConfig.Backend.BaseUrl}/files/course/${courseId}/${userEmail}`)).data.files
        }

        console.log(files)
        
        for(let i = 0; i < files.length; i++) {
            files[i].timePosted = moment(new Date(files[i].timePosted)).fromNow()
        }
        
        return files
    }

    async uploadFile(config: any): Promise<boolean> {
        config['url'] = AppConfig.Backend.BaseUrl + config["url"]
        try {
            const response = await axios(config)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

export default FileService