// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class InventoryService {
  api: ApiServiceInterface;
  endpoint: string = "/inventory";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  saveInventory(payload: Object) {
    return this.api.post(`${this.endpoint}/save`, payload);
  }

  getAllInventory(scriptId: string) {
    return this.api.get(`${this.endpoint}/multiple/${scriptId}`);
  }
}
