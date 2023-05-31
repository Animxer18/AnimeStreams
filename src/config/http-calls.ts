import axios, { RawAxiosRequestHeaders } from "axios"

// export const baseUrl = 'http://192.168.29.158:3000' 
// export const baseUrl = 'http://10.0.99.43:3000'
export const baseUrl = 'https://api.consumet.org'
export const GET = (url: string, header?: RawAxiosRequestHeaders, params?: Object): Promise<any> => {
    return new Promise((resolve, reject) => {
        console.log("URL", baseUrl + url);

        const headers = {
            'Content-Type': 'application/json',
            "Accept": 'application/json',
            ...header
        }
        const options = {
            method: 'get',
            baseUrl: baseUrl,
            url: baseUrl + url,
            headers: headers,
            params: params,
        }
        axios(options).then(response => {
            if (response.status === 200) {
                
                resolve(response.data)  
                return response.data;
            } else {
                resolve(response)
                return response;
            }
        }).catch(err => {
            reject(err)
        })
    })
}