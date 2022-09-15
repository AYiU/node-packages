import { RaindropAuth } from "./raindrop-auth.js";
import { RaindropApi } from "./raindrop-api.js";

// let accessToken = "cb7c020e-a664-48e3-8494-994777a0a22f";
let rd = new RaindropAuth(
  "5fe976f9d204c960831f99a8",
  "b4caffa5-449e-4edb-a160-16e6f021271b"
);
// console.log(rd.getAuthorizationRequestUrl());
// let r = await rd.getRefreshToken("00b08f4d-ceaa-4fab-8f5b-0e9481653ea6");
// console.log(r);

let rdapi = new RaindropApi("6b39a4f2-ca34-4b3a-be97-4818a59c7f35")

//  refresh_token: '92f13426-6513-42c2-8f50-d2a42da0e49e',

let r = await rdapi.getSystemCollectionsCount();
console.log(r);
console.log(JSON.stringify(r));
