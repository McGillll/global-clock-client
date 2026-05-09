import { navigateTo, useRuntimeConfig } from "nuxt/app";
import APIError from "./ApiError";

class BaseAPIService {
    async request(
        url: string,
        method: string,
        params: object = []
    ): Promise<any> {
        const baseUrl = 'https://global-clock-api-main-tf1yfc.laravel.cloud/api/';
        // const baseUrl = 'http://127.0.0.1:8000/api/';
        let config: any = null;
        if (method === "GET") {
            // GET
            config = {
                baseURL: baseUrl,
                method: method,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("_token"),
                    Accept: "application/json",
                },
                async onRequest({
                    request,
                    options,
                }: {
                    request: any;
                    options: any;
                }) {
                    options.params = params;
                },
            };
        } 
        else {
            // POST, PUT, DELETE
            config = {
                baseURL: baseUrl,
                method: method,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("_token"),
                    Accept: "application/json",
                },
                body: params,
            };
        }

        try {
            return await $fetch(url, config);
        } catch (error: any) {
            switch (error.response.status) {
                case 400:
                    throw new APIError(error.response._data);
                case 401:
                    this.revokeAccess();
                    throw new APIError(error.response._data);
                case 404:
                    throw new APIError(error.response._data);
                case 422:
                    throw new APIError(error.response._data);
                case 429:
                    throw new APIError(error.response._data);
                case 500:
                    throw new APIError({
                        message:
                            "Server error. Please try again. If the problem persists, contact your system administrator",
                    });
                default:
                    throw new APIError({
                        message:
                            "Something went wrong. Please try again. If the problem persists, contact your system administrator",
                    });
            }
        }
    }

    revokeAccess() {
        localStorage.removeItem("_token");
        navigateTo("/signin");
    }
}

export default BaseAPIService;