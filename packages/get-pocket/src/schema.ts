import { z } from "zod";

export const GetResponseAuthor = z.object({
  item_id: z.string(),
  author_id: z.string(),
  name: z.string(),
  url: z.string(),
});

export type GetResponseAuthorType = z.infer<typeof GetResponseAuthor>;

export const ItemInfoImage = z.object({
  item_id: z.number(),
  image_id: z.string(),
  src: z.string(),
  width: z.string(),
  height: z.string(),
  credit: z.string(),
  caption: z.string(),
});

export type ItemInfoImageType = z.infer<typeof ItemInfoImage>;

export const ItemInfoVideo = z.object({
  item_id: z.string(),
  video_id: z.string(),
  src: z.string(),
  width: z.string(),
  height: z.string(),
  type: z.string(),
  vid: z.string(),
});

export type ItemInfoVideoType = z.infer<typeof ItemInfoVideo>;

export const GetParameters = z.object({
  state: z.enum(["unread", "archive", "all"]).optional(),
  favorite: z.number().optional(),
  tag: z.string().optional(),
  contentType: z.enum(["article", "video", "image"]).optional(),
  sort: z.enum(["newest", "oldest", "title", "site"]).optional(),
  detailType: z.enum(["simple", "complete"]).optional(),
  search: z.string().optional(),
  domain: z.string().optional(),
  since: z.number().optional(),
  count: z.number().optional(),
  offset: z.number().optional(),
});

export type GetParametersType = z.infer<typeof GetParameters>;

export const ItemInfo = z.object({
  item_id: z.string(),
  resolved_id: z.string(),
  given_url: z.string(),
  resolved_url: z.string(),
  given_title: z.string(),
  resolved_title: z.string(),
  favorite: z.enum(["0", "1"]),
  status: z.enum(["0", "1", "2"]),
  excerpt: z.string(),
  is_article: z.enum(["0", "1"]),
  has_image: z.enum(["0", "1", "2"]),
  has_video: z.enum(["0", "1", "2"]),
  word_count: z.string(),
  tags: z.array(z.string()).or(z.string()),
  authors: z.record(z.string(), GetResponseAuthor),
  images: z.record(z.string(), ItemInfoImage),
  videos: z.record(z.string(), ItemInfoVideo),
  time_added: z.string(),
  time_updated: z.string(),
  time_read: z.string(),
  time_favorited: z.string(),
  sort_id: z.number(),
  is_index: z.string(),
  lang: z.string(),
  amp_url: z.string().optional(),
  top_image_url: z.string(),
  listen_duration_estimate: z.number(),
  image: z
    .object({
      item: z.string(),
      src: z.string(),
      width: z.string(),
      height: z.string(),
    })
    .optional(),
  domain_metadata: z
    .object({
      name: z.string(),
      logo: z.string(),
      greyscale_logo: z.string(),
    })
    .optional(),
});

export type ItemInfoType = z.infer<typeof ItemInfo>;

export const GetResponse = z
  .object({
    status: z.coerce.number(),
  })
  .extend({ list: z.record(z.string(), ItemInfo) });

export type GetResponseType = z.infer<typeof GetResponse>;

export const AddResponse = z.object({
  item: ItemInfo,
  status: z.coerce.number(),
});

export type AddResponseType = z.infer<typeof AddResponse>;

export const BatchActionParameter = z.object({
  action: z.enum([
    "add",
    "archive",
    "readd",
    "favorite",
    "unfavorite",
    "delete",
    "tags_add",
    "tags_remove",
    "tags_replace",
    "tags_clear",
    "tags_rename",
    "tags_delete",
  ]),
  item_id: z.number().optional(),
  ref_id: z.number().optional(),
  tags: z.string().optional(),
  time: z.date().optional(),
  title: z.string().optional(),
  url: z.string().optional(),
});

export type BatchActionParameterType = z.infer<typeof BatchActionParameter>;

export const FetchRequestToken = z.object({
  code: z.string(),
  state: z.string().optional(),
});

export type FetchRequestTokenType = z.infer<typeof FetchRequestToken>;

export const AuthResponse = z.object({
  access_token: z.string(),
  username: z.string(),
});

export type AuthResponseType = z.infer<typeof AuthResponse>;

export const BatchActionResponse = z.object({
  action_results: z.array(z.boolean().nullable()),
  action_errors: z.array(z.boolean().nullable()),
  status: z.number(),
});

export type BatchActionResponseType = z.infer<typeof BatchActionResponse>;
