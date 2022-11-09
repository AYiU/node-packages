import {RestSignature} from "./rest-signature.js";


let p = {
  social: "github",
  user: "ayiu",
  date: "2022-01-02T13:41:15.944Z",
  _sign: "d11ddcfa7a124a1491b282f0e4c6f52017ad64f8",
  _key: ["social", "user", "date"],
};

let rs = new RestSignature("dwt9JHV2pyt-vym0acxdwt9JHV2pyt-vym0acx");
let r = rs.verifyObject(p);

console.log({r});
