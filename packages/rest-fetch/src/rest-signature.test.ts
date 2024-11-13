import { RestSignature } from "./rest-signature.js";

test("RestSignature", () => {
  let input = {
    social: "github",
    user: "ayiu",
    date: "2022-01-02T13:41:15.944Z",
  };

  let rs = new RestSignature("dwt9JHV2pyt-vym0acxdwt9JHV2pyt-vym0acx");
  const output = rs.signObject(input);
  expect(output._sign).toEqual("d4d542c43c43aa495b103a173625b9a1e770b4b3");

  const v = rs.verifyObject(output);
  expect(v).toEqual(true);
});
