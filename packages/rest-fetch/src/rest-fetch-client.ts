import { RestSignature } from "./rest-signature.js";

export class RestFetchClient {
  private restSignature: RestSignature | null = null;
  constructor(
    private baseUrl = "",
    private token = "",
    salt = "",
  ) {
    if (this.baseUrl.endsWith("/")) {
      this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
    }

    if (salt) {
      this.restSignature = new RestSignature(salt);
    }
  }

  static factoryFromEnv() {
    const endpoint = process.env.API_ENDPOINT;

    if (!endpoint) {
      throw new Error("API_ENDPOINT not set in env");
    }

    let token = "";
    if (process.env.API_TOKEN) {
      token = process.env.API_TOKEN;
    }

    if (process.env.REST_SIGNATURE) {
      return new RestFetchClient(endpoint, token, process.env.REST_SIGNATURE);
    }
    return new RestFetchClient(endpoint, token);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async get<T = any>(
    path: string,
    urlSearchParam: URLSearchParams | null = null,
    requestConfig: NextFetchRequestConfig | undefined = undefined,
  ) {
    const rr = await fetch(this.getUrl(path, urlSearchParam), {
      method: "get",
      headers: [["authorization", `Bearer ${this.token}`]],
      next: requestConfig,
    });

    if (rr.status !== 200) {
      throw new Error(`Failed to fetch ${path}, status: ${rr.status}`);
    }

    return rr.json() as T;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async post<T = any>(path: string, json: any) {
    const rr = await fetch(this.getUrl(path), {
      method: "post",
      body: JSON.stringify(json),
      headers: [
        // biome-ignore lint/style/useTemplate: <explanation>
        ["authorization", "Bearer " + this.token],
        ["Content-Type", "application/json"],
      ],
    });

    if (rr.status !== 200) {
      throw new Error(`Failed to fetch ${path}, status: ${rr.status}`);
    }

    return rr.json() as T;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async signPost<T = any>(
    path: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    json: any,
    keyToSign: string[] | null = null,
  ) {
    if (null === this.restSignature) {
      throw new Error("`Salt` is not defined in constructor");
    }
    const postJson = await this.restSignature.signObject(json, keyToSign);
    return this.post<T>(path, postJson);
  }

  getUrl(inPath: string, urlSearchParam: URLSearchParams | null = null) {
    let path = inPath;
    if (!path.startsWith("/")) {
      path = `/${path}`;
    }

    let url = this.baseUrl + path;

    if (urlSearchParam) {
      url += `?${urlSearchParam}`;
    }

    return url;
  }
}
