// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class ScriptService {
  api: ApiServiceInterface;
  endpoint: string = "/script";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  isUniqueScript(query: Object) {
    return this.api.get(`${this.endpoint}/uniqueness`, query);
  }

  saveScript(payload: Object) {
    return this.api.post(`${this.endpoint}/save`, payload);
  }

  getAllScripts() {
    return this.api.get(`${this.endpoint}/multiple`);
  }
}
