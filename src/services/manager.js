import {
  registerGlobalServices,
  serviceManager
} from "shared/services/manager";
import { AuthService } from "./authService";
import { StorageService } from "./storageService";

export const registerServices = options => {
  registerGlobalServices(options);

  serviceManager.register("AuthService", serviceManager => {
    let api = serviceManager.get("ApiService");
    return new AuthService(api);
  });

  serviceManager.register("StorageService", serviceManager => {
    let api = serviceManager.get("ApiService");
    return new StorageService(api);
  });
};

export { serviceManager };
