import axios, { type AxiosInstance } from "axios";
import type {
  IGetCollectionResponse,
  IGetRaindropResponse,
  IGetRaindropsResponse,
  IGetRootCollectionsResponse,
  IGetSystemCollectionsCount,
} from "./raindrop-type.js";

export class RaindropApi {
  private baseUrl = "https://api.raindrop.io";
  private axios: AxiosInstance;

  constructor(accessToken: string) {
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  public getRootCollections() {
    const path = "/rest/v1/collections";
    return this.getRequest<IGetRootCollectionsResponse>(
      path,
    );
  }

  public getChildCollections() {
    const path = "/rest/v1/collections/childrens";
    return this.getRequest(path);
  }

  public getCollection(id: number) {
    const path = `/rest/v1/collection/${id}`;
    return this.getRequest<IGetCollectionResponse>(path);
  }

  public getSystemCollectionsCount() {
    const path = "/rest/v1/user/stats";
    return this.getRequest<IGetSystemCollectionsCount>(
      path,
    );
  }

  public getRaindrops(collectionId: number) {
    const path = `/rest/v1/raindrops/${collectionId}`;
    return this.getRequest<IGetRaindropsResponse>(path);
  }

  public getRaindrop(id: number) {
    const path = `/rest/v1/raindrop/${id}`;
    return this.getRequest<IGetRaindropResponse>(path);
  }

  private async getRequest<R>(path: string) {
    const response = await this.axios.get<R>(path);

    return response.data;
  }
}
