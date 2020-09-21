// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class ActorsService {
  api: ApiServiceInterface;
  endpoint: string = "/actors";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  saveActors(payload: Object) {
    return this.api.post(`${this.endpoint}/save`, payload);
  }

  getAllActors() {
    return this.api.get(`${this.endpoint}/multiple`);
  }
}
