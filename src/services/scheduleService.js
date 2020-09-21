// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class ScheduleService {
  api: ApiServiceInterface;
  endpoint: string = "/schedule";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  getSchedule(scriptId: string) {
    return this.api.get(`${this.endpoint}/${scriptId}`);
  }

  saveSchedule(payload: Object) {
    return this.api.post(`${this.endpoint}/save`, payload);
  }
}
