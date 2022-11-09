import m3o from "@m3o/m3o-node";

interface DeleteRequest {
  key: string;
}

interface DeleteResponse {
  status: "ok";
}

interface NumberRequest {
  key: string;
  value: number;
}

interface NumberResponse {
  key: string;
  value: number;
}

interface GetRequest {
  key: string;
}

interface GetResponse {
  key: string;
  value: any;
  ttl: number;
}

interface SetRequest {
  key: string;
  value: any;
  ttl?: number;
}

interface SetResponse {
  status: "ok";
}

interface ListKeyRequest {}

interface ListKeyResponse {
  key: string[];
}

export class M3oCache {
  private service = "cache";

  constructor(private client: m3o.Client) {}

  async remember(key: string, func: CallableFunction, ttl = 60) {
    let value = await this.Get(key);

    if (value) {
      return JSON.parse(value);
    } else {
      value = await func();
      await this.Set(key, JSON.stringify(value), ttl);

      return value;
    }
  }

  async Delete(key: string) {
    let response = await this.client.call<DeleteRequest, DeleteResponse>(
      this.service,
      "Delete",
      {
        key,
      }
    );

    return "ok" === response.status;
  }

  async Increment(key: string, value: number) {
    let response = await this.client.call<NumberRequest, NumberResponse>(
      this.service,
      "Increment",
      {
        key,
        value,
      }
    );

    return response.value;
  }

  async Decrement(key: string, value: number) {
    let response = await this.client.call<NumberRequest, NumberResponse>(
      this.service,
      "Decrement",
      {
        key,
        value,
      }
    );

    return response.value;
  }

  async Get(key: string) {
    let response = await this.client.call<GetRequest, GetResponse>(
      this.service,
      "Get",
      {
        key,
      }
    );

    return response.value;
  }

  async Set<T = string>(
    key: string,
    value: T,
    ttl: number | undefined = undefined
  ) {
    let response = await this.client.call<SetRequest, SetResponse>(
      this.service,
      "Set",
      {
        key,
        value,
        ttl,
      }
    );

    return "ok" === response.status;
  }

  async ListKey() {
    let response = await this.client.call<ListKeyRequest, ListKeyResponse>(
      this.service,
      "ListKey",
      {}
    );

    return response.key;
  }
}
