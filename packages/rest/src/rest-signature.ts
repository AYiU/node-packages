import { sha1 } from "@yiuayiu/functions";

export class RestSignature {
  constructor(private salt = "") {
    if ("string" !== typeof salt || salt.length === 0) {
      throw new Error("Salt is empty");
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  getSignature(obj: any, keyToSign: string[] | null) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const payload: any[] = [];

    let inKeyToSign = keyToSign;
    if (inKeyToSign === null) {
      inKeyToSign = Object.keys(obj);
    }

    for (let i = 0; i < inKeyToSign.length; i++) {
      payload.push(obj[inKeyToSign[i]]);
    }

    return sha1(this.salt + JSON.stringify(payload));
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async signObject(
    obj: any,
    keyToSign: string[] | null = null,
  ) {
    let inKeyToSign = keyToSign;
    if (inKeyToSign === null) {
      inKeyToSign = Object.keys(obj);
    }

    const sign = await this.getSignature(obj, inKeyToSign);
    return {
      ...obj,
      _sign: sign,
      _key: inKeyToSign,
    };
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async verifyObject(obj: any) {
    const { _sign, _key, ...rest } = obj;

    const sign = await this.getSignature(rest, _key);

    return _sign === sign;
  }
}
