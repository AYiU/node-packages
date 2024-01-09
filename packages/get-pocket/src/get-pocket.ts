import axios from "axios";
import debugFunction from "debug";
const debugRequest = debugFunction("GetPocket:request");
const debugReponse = debugFunction("GetPocket:response");

export interface GetParameters {
  state?: "all" | "unread" | "archive";
  favorite?: number;
  tag?: string;
  contentType?: "article" | "video" | "image";
  sort?: "newest" | "oldest" | "title" | "site";
  detailType?: "simple" | "complete";
  search?: string;
  domain?: string;
  since?: number;
  count?: number;
  offset?: number;
}

interface IItemInfoImage {
  item_id: number;
  image_id: string;
  src: string;
  width: string;
  height: string;
  credit: string;
  caption: string;
}

interface IItemInfoVideo {
  item_id: string;
  video_id: string;
  src: string;
  width: string;
  height: string;
  type: string;
  vid: string;
}

interface GetResponseAuthor {
  item_id: string;
  author_id: string;
  name: string;
  url: string;
}

export interface IItemInfo {
  item_id: string;
  resolved_id: string;
  given_url: string;
  given_title: string;
  favorite: string;
  status: string;
  resolved_title: string;
  resolved_url: string;
  excerpt: string;
  is_article: string;
  has_video: string;
  has_image: string;
  word_count: string;
  tags: Array<string> | string;
  images: Record<string, IItemInfoImage>;
  videos: Record<string, IItemInfoVideo>;
  /* undoc */
  time_added: string;
  time_updated: string;
  time_read: string;
  time_favorited: string;
  sort_id: number;
  is_index: string;
  lang: string;
  amp_url?: string;
  top_image_url: string;
  listen_duration_estimate: number;
  image?: {
    item: string;
    src: string;
    width: string;
    height: string;
  };
  authors?: Record<string, GetResponseAuthor>;
  domain_metadata?: {
    name: string;
    logo: string;
    greyscale_logo: string;
  };
}

export interface GetResponse {
  status: number;
  list: Record<string, IItemInfo>;
}

export interface BatchActionParameter {
  action:
    | "add"
    | "archive"
    | "readd"
    | "favorite"
    | "unfavorite"
    | "delete"
    | "tags_add"
    | "tags_remove"
    | "tags_replace"
    | "tags_clear"
    | "tags_rename"
    | "tags_delete";
  item_id?: number;
  ref_id?: number;
  tags?: string;
  time?: Date;
  title?: string;
  url?: string;
}

interface FetchRequestToken {
  code: string;
  state?: string;
}

interface AuthResponse {
  access_token: string;
  username: string;
}

interface IAddResponse {
  item: IItemInfo;
  status: number;
}

export interface IBatchResponse {
  action_results: Array<boolean | null>;
  action_errors: Array<boolean | null>;
  status: number;
}

export class GetPocket {
  private REQUEST_URL: string = "https://getpocket.com/v3/oauth/request";
  private POCKET_REDIRECT_URL =
    "https://getpocket.com/auth/authorize?request_token={code}&redirect_uri={redirect}";
  private AUTH_URL = "https://getpocket.com/v3/oauth/authorize";

  private accessToken: string = "";

  private fullDebug = false;

  constructor(private consumerKey: string, private redirectUri: string) {}

  static factoryFromEnv() {
    const pocket = new GetPocket(
      process.env.POCKET_CONSUMER_KEY!,
      process.env.POCKET_REDIRECT_URL!
    );

    pocket.setAccessToken(process.env.POCKET_ACCESS_TOKEN!);
    return pocket;
  }

  createBatchAction() {
    return new BatchAction();
  }

  async get(param: GetParameters = {}) {
    var payload = { ...param };

    return await this.makeAuthRequest<GetResponse>(
      "https://getpocket.com/v3/get",
      payload
    );
  }

  async add(
    url: string,
    title: string = "",
    tags: string | Array<string> = ""
  ) {
    const payload = {
      url,
      title: "",
      tags: "",
    };

    if (title) {
      payload["title"] = title;
    }

    if (tags) {
      if (Array.isArray(tags)) {
        payload["tags"] = tags.join(", ");
      } else {
        payload["tags"] = tags;
      }
    }

    return this.makeAuthRequest<IAddResponse>(
      "https://getpocket.com/v3/add",
      payload
    );
  }

  processBatchAction(batchAction: BatchAction) {
    const payload = {
      actions: batchAction.actions,
    };

    return this.makeAuthRequest<IBatchResponse>(
      "https://getpocket.com/v3/send",
      payload
    );
  }

  async fetchRequestToken(state: Record<string, any> | null = null) {
    let requestParam: { [key: string]: any } = {
      consumer_key: this.consumerKey,
      redirect_uri: this.redirectUri,
    };

    if (state) {
      requestParam["state"] = state;
    }

    return await this.makeRequest<FetchRequestToken>(
      this.REQUEST_URL,
      requestParam
    );
  }

  getRedirectUrl(code: string) {
    return this.POCKET_REDIRECT_URL.replace("{code}", code).replace(
      "{redirect}",
      this.redirectUri
    );
  }

  async fetchAccessToken(code: string) {
    return this.makeRequest<AuthResponse>(this.AUTH_URL, {
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

  private makeAuthRequest<T = any>(url: string, payload: Record<string, any>) {
    if (!payload["consumer_key"]) {
      payload["consumer_key"] = this.consumerKey;
    }

    if (!payload["access_token"]) {
      payload["access_token"] = this.accessToken;
    }

    return this.makeRequest<T>(url, payload);
  }

  private async makeRequest<T = any>(url: string, payload: object) {
    debugRequest(url, payload);

    let response = await axios.post<T>(url, payload, {
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
  public actions: BatchActionParameter[] = [];

  public add(url: string, title: string = "", tags: string[] = []) {
    this.actions.push({
      action: "add",
      item_id: 0,
      url,
      title,
      tags: tags.join(","),
    });
  }

  public archive(itemId: number | string) {
    if (typeof itemId === "string") {
      itemId = parseInt(itemId);
    }
    this.actions.push({
      action: "archive",
      item_id: itemId,
    });
  }

  public readd(itemId: number | string) {
    if (typeof itemId === "string") {
      itemId = parseInt(itemId);
    }
    this.actions.push({
      action: "readd",
      item_id: itemId,
    });
  }

  public favorite(itemId: number | string) {
    if (typeof itemId === "string") {
      itemId = parseInt(itemId);
    }
    this.actions.push({
      action: "favorite",
      item_id: itemId,
    });
  }

  public unfavorite(itemId: number | string) {
    if (typeof itemId === "string") {
      itemId = parseInt(itemId);
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

  public addTags(itemId: number | string, tags: string[]) {
    if (typeof itemId === "string") {
      itemId = parseInt(itemId);
    }
    this.actions.push({
      action: "tags_add",
      item_id: itemId,
      tags: tags.join(", "),
    });
  }

  public removeTags(itemId: number | string, tags: string[]) {
    if (typeof itemId === "string") {
      itemId = parseInt(itemId);
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
