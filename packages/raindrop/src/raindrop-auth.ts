import axios, { AxiosInstance } from "axios";

export class RaindropAuth {
  private baseUrl = "https://raindrop.io";
  private redirectUri = "https://ayiu.net/";
  private axios: AxiosInstance;

  constructor(private clientId: string, private clientSecret: string) {
    this.axios = axios.create({ baseURL: this.baseUrl });
  }

  getAuthorizationRequestUrl() {
    let s = new URLSearchParams();
    s.set("client_id", this.clientId);
    s.set("redirect_uri", this.redirectUri);
    let url = "https://raindrop.io/oauth/authorize?" + s;
    return url;
  }

  async getRefreshToken(code: string) {
    let body = {
      grant_type: "authorization_code",
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
    };

    return this.postRequest("/oauth/access_token", body);
  }

  private async postRequest<R>(path: string, body: any) {
    let response = await this.axios.post<R>(path, body);
    return response.data;
  }
}
