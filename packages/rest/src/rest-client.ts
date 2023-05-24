import axios, { AxiosRequestConfig } from "axios";
import { RestSignature } from "./rest-signature.js";

export class RestClient {
  private instance;
  private restSignature: RestSignature | null = null;
  constructor(
    private baseUrl: string = "",
    token: string = "",
    salt: string= ""
  ) {
    if (this.baseUrl.endsWith("/")) {
      this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
    }


    let config: AxiosRequestConfig = {
      baseURL: this.baseUrl,
    };

    if (token) {
      config.headers = {};
      config.headers["authorization"] = "Bearer " + token;
    }
    this.instance = axios.create(config);

    if (salt) {
      this.restSignature = new RestSignature(salt);
    }
  }

  static factoryFromEnv() {
    let endpoint = process.env.API_ENDPOINT;

    if (!endpoint) {
      throw new Error("API_ENDPOINT not set in env");
    }

    let token = "";
    if (process.env.API_TOKEN) {
      token = process.env.API_TOKEN;
    }

    if (process.env.REST_SIGNATURE) {
      return new this(endpoint, token, process.env.REST_SIGNATURE);
    } else {
      return new this(endpoint, token);
    }
  }

  async get<T = any>(path: string) {
    let r = await this.instance.get<T>(path);
    return r.data;
  }

  async post<T = any>(path: string, json: any) {
    let r = await this.instance.post<T>(path, json);
    return r.data;
  }

  async signPost<T = any>(
    path: string,
    json: any,
    keyToSign: string[] | null = null
  ) {
    if (null === this.restSignature) {
      throw new Error("`Salt` is not defined in constructor");
    }
    let postJson = this.restSignature.signObject(json, keyToSign);
    return this.post<T>(path, postJson);
  }

  /*
  private static async processResponse<T = BaseResponse>(
    response: Response
  ): Promise<T> {
    let body = await response.json();

    if (1 === body.result) {
      return body;
    } else {
      throw new Error(body.message);
    }
  }
  */
}
