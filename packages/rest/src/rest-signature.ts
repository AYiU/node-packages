import { sha1 } from "@yiuayiu/functions";

class RestSignature {
  constructor(private salt: string = "") {
    if ("string" !== typeof salt || salt.length === 0) {
      throw new Error("Salt is empty");
    }
  }

  getSignature(obj: any, keyToSign: string[] | null) {
    let payload: any[] = [];

    if (keyToSign === null) {
      keyToSign = Object.keys(obj);
    }

    for (let i = 0; i < keyToSign.length; i++) {
      payload.push(obj[keyToSign[i]]);
    }

    return sha1(this.salt + JSON.stringify(payload));
  }

  signObject(obj: any, keyToSign: string[] | null = null) {
    if (keyToSign === null) {
      keyToSign = Object.keys(obj);
    }

    let sign = this.getSignature(obj, keyToSign);
    return {
      ...obj,
      _sign: sign,
      _key: keyToSign,
    };
  }

  verifyObject(obj: any) {
    let { _sign, _key, ...rest } = obj;

    let sign = this.getSignature(rest, _key);

    return _sign === sign;
  }
}

export { RestSignature };
