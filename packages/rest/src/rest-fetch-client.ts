import { RestSignature } from "./rest-signature.js";

export class FetchRestClient {
  private restSignature: RestSignature | null = null;
  constructor(
    private baseUrl: string = "",
    private token: string = "",
    salt: string = ""
  ) {
    if (this.baseUrl.endsWith("/")) {
      this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
    }

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

  async get<T = any>(
    path: string,
    urlSearchParam: URLSearchParams | null = null,
    revalidate = 300
  ) {
    const rr = await fetch(this.getUrl(path, urlSearchParam), {
      method: "get",
      headers: [["authorization", "Bearer " + this.token]],
      next: { revalidate },
    });

    if (rr.status !== 200) {
      throw new Error(`Failed to fetch ${path}, status: ${rr.status}`);
    }

    return rr.json() as T;
  }

  async post<T = any>(path: string, json: any) {
    const rr = await fetch(this.getUrl(path), {
      method: "post",
      body: json,
      headers: [["authorization", "Bearer " + this.token]],
    });

    if (rr.status !== 200) {
      throw new Error(`Failed to fetch ${path}, status: ${rr.status}`);
    }

    return rr.json() as T;
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

  getUrl(path: string, urlSearchParam: URLSearchParams|null = null) {
    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    let url = this.baseUrl + path;

    if (urlSearchParam) {
      url += "?" + urlSearchParam;
    }

    return url;
  }
}
