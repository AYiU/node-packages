import axios from "axios";
import debugFunction from "debug";
import type {
  AddResponseType,
  AuthResponseType,
  BatchActionParameterType,
  BatchActionResponseType,
  FetchRequestTokenType,
  GetParametersType,
  GetResponseType,
} from "./schema";
const debugRequest = debugFunction("GetPocket:request");
const debugReponse = debugFunction("GetPocket:response");

export class GetPocket {
  private REQUEST_URL = "https://getpocket.com/v3/oauth/request";
  private POCKET_REDIRECT_URL =
    "https://getpocket.com/auth/authorize?request_token={code}&redirect_uri={redirect}";
  private AUTH_URL = "https://getpocket.com/v3/oauth/authorize";

  private accessToken = "";

  private fullDebug = false;

  constructor(
    private consumerKey: string,
    private redirectUri: string,
  ) {}

  static factoryFromEnv() {
    const pocket = new GetPocket(
      process.env.POCKET_CONSUMER_KEY || "",
      process.env.POCKET_REDIRECT_URL || "",
    );

    pocket.setAccessToken(process.env.POCKET_ACCESS_TOKEN || "");
    return pocket;
  }

  createBatchAction() {
    return new BatchAction();
  }

  async get(param: GetParametersType = {}) {
    const payload = { ...param };

    return await this.makeAuthRequest<GetResponseType>(
      "https://getpocket.com/v3/get",
      payload,
    );
  }

  async add(url: string, title = "", tags: string | Array<string> = "") {
    const payload: Record<string, string> = {
      url,
    };

    if (title) {
      payload.title = title;
    }

    if (tags) {
      if (Array.isArray(tags)) {
        payload.tags = tags.join(", ");
      } else {
        payload.tags = tags;
      }
    }

    return this.makeAuthRequest<AddResponseType>(
      "https://getpocket.com/v3/add",
      payload,
    );
  }

  processBatchAction(batchAction: BatchAction) {
    const payload = {
      actions: batchAction.actions,
    };

    return this.makeAuthRequest<BatchActionResponseType>(
      "https://getpocket.com/v3/send",
      payload,
    );
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async fetchRequestToken(state: Record<string, any> | null = null) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const requestParam: Record<string, any> = {
      consumer_key: this.consumerKey,
      redirect_uri: this.redirectUri,
    };

    if (state) {
      requestParam.state = state;
    }

    return await this.makeRequest<FetchRequestTokenType>(
      this.REQUEST_URL,
      requestParam,
    );
  }

  getRedirectUrl(code: string) {
    return this.POCKET_REDIRECT_URL.replace("{code}", code).replace(
      "{redirect}",
      this.redirectUri,
    );
  }

  async fetchAccessToken(code: string) {
    return this.makeRequest<AuthResponseType>(this.AUTH_URL, {
      consumer_key: this.consumerKey,
      code: code,
    });
  }

  setAccessToken(value: string) {
    this.accessToken = value;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private makeAuthRequest<T = any>(url: string, payload: Record<string, any>) {
    const requestPayload = {
      consumer_key: this.consumerKey,
      access_token: this.accessToken,
      ...payload,
    };

    return this.makeRequest<T>(url, requestPayload);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async makeRequest<T = any>(url: string, payload: object) {
    debugRequest(url, payload);

    const response = await axios.post<T>(url, payload, {
      headers: {
        contentType: "application/json; charset=UTF-8",
        "X-Accept": "application/json",
      },
    });

    debugReponse(this.fullDebug ? response : response.data);

    return response.data;
  }
}

class BatchAction {
  public actions: BatchActionParameterType[] = [];

  public add(url: string, title = "", tags: string[] = []) {
    const payload: BatchActionParameterType = {
      action: "add",
      item_id: 0,
      url,
      title,
    };

    if (tags.length > 0) {
      payload.tags = tags.join(", ");
    }
    this.actions.push(payload);
  }

  public archive(inItemId: number | string) {
    let itemId = inItemId;
    if (typeof itemId === "string") {
      itemId = Number.parseInt(itemId);
    }
    this.actions.push({
      action: "archive",
      item_id: itemId,
    });
  }

  public readd(inItemId: number | string) {
    let itemId = inItemId;
    if (typeof itemId === "string") {
      itemId = Number.parseInt(itemId);
    }
    this.actions.push({
      action: "readd",
      item_id: itemId,
    });
  }

  public favorite(inItemId: number | string) {
    let itemId = inItemId;
    if (typeof itemId === "string") {
      itemId = Number.parseInt(itemId);
    }
    this.actions.push({
      action: "favorite",
      item_id: itemId,
    });
  }

  public unfavorite(inItemId: number | string) {
    let itemId = inItemId;
    if (typeof itemId === "string") {
      itemId = Number.parseInt(itemId);
    }
    this.actions.push({
      action: "unfavorite",
      item_id: itemId,
    });
  }

  public delete(itemId: number) {
    this.actions.push({
      action: "delete",
      item_id: itemId,
    });
  }

  public addTags(inItemId: number | string, tags: string[]) {
    let itemId = inItemId;
    if (typeof itemId === "string") {
      itemId = Number.parseInt(itemId);
    }
    this.actions.push({
      action: "tags_add",
      item_id: itemId,
      tags: tags.join(", "),
    });
  }

  public removeTags(inItemId: number | string, tags: string[]) {
    let itemId = inItemId;
    if (typeof itemId === "string") {
      itemId = Number.parseInt(itemId);
    }
    this.actions.push({
      action: "tags_remove",
      item_id: itemId,
      tags: tags.join(", "),
    });
  }

  /*
  public replaceTags(itemId: number, tags: string[]) {}

  public clearTags(itemId: number) {}

  public renameTags(oldTag: string, newTag: string) {}

  public deleteTags(tag: string) {}
  */

  public get length() {
    return this.actions.length;
  }
}
