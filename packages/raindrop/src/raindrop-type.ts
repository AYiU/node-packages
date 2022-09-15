export interface IGetRefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires: number;
  expires_in: number;
  token_type: "Bearer";
}

export interface IGetRootCollectionsResponse {
  result: boolean;
  items: Collection[];
}

export interface IGetCollectionResponse {
  result: boolean;
  items: Collection;
}

export interface IGetSystemCollectionsCount {
  result: boolean;
  items: SytemCollectionItem[];
  meta: Meta;
}

export interface SytemCollectionItem {
  _id: number;
  count: number;
}

export interface Meta {
  pro: boolean;
  _id: number;
  changedBookmarksDate: Date;
}

export interface IGetRaindropsResponse {
  result: boolean;
  items: IRaindrop[];
  count: number;
  collectionId: number;
}

export interface IGetRaindropResponse {
  result: boolean;
  item: IRaindrop;
  author: boolean;
}

export interface IRaindrop {
  excerpt: string;
  note: string;
  type: string;
  cover: string;
  tags: string[];
  removed: boolean;
  _id: number;
  title: string;
  media: IMedia[];
  link: string;
  collection: ICollectionRef;
  user: ICollectionRef;
  created: Date;
  lastUpdate: Date;
  domain: string;
  creatorRef: ICreatorRef;
  sort: number;
  highlights: any[];
  collectionId: number;
}

interface ICollectionRef {
  $ref: string;
  $id: number;
  $db: string;
}

interface ICreatorRef {
  avatar: string;
  _id: number;
  name: string;
  email: string;
}

interface IMedia {
  type: string;
  link: string;
}

export interface Collection {
  title: string;
  description: string;
  public: boolean;
  view: View;
  count: number;
  cover: string[];
  expanded: boolean;
  _id: number;
  user: User;
  creatorRef: ICreatorRef;
  lastAction: Date;
  created: Date;
  lastUpdate: Date;
  sort: number;
  slug: string;
  access: Access;
  author: boolean;
  color?: string;
}

interface Access {
  for: number;
  level: number;
  root: boolean;
  draggable: boolean;
}

interface User {
  $ref: Ref;
  $id: number;
  $db: string;
}

enum Ref {
  Users = "users",
}

enum View {
  List = "list",
}
