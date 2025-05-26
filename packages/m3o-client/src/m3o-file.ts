import type m3o from "@m3o/m3o-node";
import Debug from "debug";

const debugLog = Debug("m3o:file");

interface FileObject {
  path: string;
  project: string;
  name: string;
}

interface DefaultRequest {
  path: string;
  project: string;
}

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface DefaultResponse {}

interface ListResponse {
  files: FileObject[];
}

interface ReadResponse {
  file: FileObject;
}

interface SaveRequest {
  file: {
    path: string;
    project: string;
    content: string;
  };
}

interface SaveReponse {
  url: string;
}

export class M3oFile {
  private service = "file";

  constructor(private client: m3o.Client) {}

  async Delete(path: string, project = "default") {
    const response = await this.client.call<DefaultRequest, DefaultResponse>(
      this.service,
      "Delete",
      {
        path,
        project,
      },
    );

    debugLog("Delete response", response);

    return true;
  }

  async List(path = "/", project = "default") {
    const response = await this.client.call<DefaultRequest, ListResponse>(
      this.service,
      "List",
      { path, project },
    );

    debugLog("List response", response);

    return response.files;
  }

  async Read(path: string, project = "default") {
    const response = await this.client.call<DefaultRequest, ReadResponse>(
      this.service,
      "Read",
      { path, project },
    );

    debugLog("Read response", response);

    return response.file;
  }

  async Save(path: string, content: string, project = "default") {
    const response = await this.client.call<SaveRequest, SaveReponse>(
      this.service,
      "Save",
      { file: { path, project, content } },
    );

    debugLog("Save response", response);

    return true;
  }
}
