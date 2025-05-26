import {RestSignature} from "./rest-signature.js";


const p = {
  social: "github",
  user: "ayiu",
  date: "2022-01-02T13:41:15.944Z",
  _sign: "d11ddcfa7a124a1491b282f0e4c6f52017ad64f8",
  _key: ["social", "user", "date"],
};

const rs = new RestSignature("dwt9JHV2pyt-vym0acxdwt9JHV2pyt-vym0acx");
const r = rs.verifyObject(p);

console.log({r});
