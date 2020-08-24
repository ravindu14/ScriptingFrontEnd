// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class AuthService {
  api: ApiServiceInterface;

  endpoint: string = "/auth";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  signUp(payload: Object = {}) {
    return this.api.post(`${this.endpoint}/tenant/signUp`, payload);
  }

  signIn(payload: Object = {}) {
    return this.api.post(`${this.endpoint}/signIn`, payload);
  }

  getCurrentUser() {
    return this.api.get(`${this.endpoint}/user`);
  }
}
