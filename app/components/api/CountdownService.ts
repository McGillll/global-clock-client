import BaseAPIService from "./BaseApiService";

class CountdownService extends BaseAPIService {
    async listCountdowns(): Promise<any> {
        return await this.request("countdowns", "GET");
    }

    async getCountdown(countdownId: number): Promise<any> {
        return await this.request(`countdowns/${countdownId}`, "GET");
    }

    async createCountdown(params: object): Promise<any> {
        return await this.request("countdowns", "POST", params);
    }

    async updateCountdown(countdownId: number, params: object): Promise<any> {
        return await this.request(`countdowns/${countdownId}`, "PUT", params);
    }

    async deleteCountdown(countdownId: number): Promise<any> {
        return await this.request(`countdowns/${countdownId}`, "DELETE");
    }

    async listSequences(): Promise<any> {
        return await this.request("sequences", "GET");
    }

    async getSequence(sequenceId: number): Promise<any> {
        return await this.request(`sequences/${sequenceId}`, "GET");
    }

    async createSequence(params: object): Promise<any> {
        return await this.request("sequences", "POST", params);
    }

    async updateSequence(sequenceId: number, params: object): Promise<any> {
        return await this.request(`sequences/${sequenceId}`, "PUT", params);
    }

    async createShare(sequenceId: number): Promise<any> {
        return await this.request(`sequences/${sequenceId}/share`, "POST");
    }

    async getSharedSequence(token: string): Promise<any> {
        return await this.request(`shared/${token}`, "GET");
    }

    async startSequence(sequenceId: number): Promise<any> {
        return await this.request(`sequences/${sequenceId}/start`, "POST");
    }

    async pauseSequence(sequenceId: number): Promise<any> {
        return await this.request(`sequences/${sequenceId}/pause`, "POST");
    }

    async resumeSequence(sequenceId: number): Promise<any> {
        return await this.request(`sequences/${sequenceId}/resume`, "POST");
    }

    async stopSequence(sequenceId: number): Promise<any> {
        return await this.request(`sequences/${sequenceId}/stop`, "POST");
    }

    async deleteSequence(sequenceId: number): Promise<any> {
        return await this.request(`sequences/${sequenceId}`, "DELETE");
    }
}

export const countdownService = new CountdownService();