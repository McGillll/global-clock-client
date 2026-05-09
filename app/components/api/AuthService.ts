import BaseAPIService from "./BaseApiService";

class AuthService extends BaseAPIService {
    async login(params: { email: string; password: string }): Promise<any> {
        return await this.request("auth/login", "POST", params);
    }

    async register(params: { name: string; email: string; password: string }): Promise<any> {
        return await this.request("auth/register", "POST", params);
    }

    async forgotPassword(params: FormData | { email: string }): Promise<any> {
        return await this.request("auth/forgot-password", "POST", params);
    }
}

export const authService = new AuthService();
