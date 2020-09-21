// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class SceneService {
  api: ApiServiceInterface;
  endpoint: string = "/scene";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  getAllScenes(scriptId: string) {
    return this.api.get(`${this.endpoint}/multiple/${scriptId}`);
  }

  saveScene(payload: Object) {
    return this.api.post(`${this.endpoint}/save`, payload);
  }

  // getAllScripts() {
  //   return this.api.get(`${this.endpoint}/multiple`);
  // }
}
