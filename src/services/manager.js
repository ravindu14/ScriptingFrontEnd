import {
  registerGlobalServices,
  serviceManager,
} from "shared/services/manager";
import { AuthService } from "./authService";
import { StorageService } from "./storageService";
import { ScriptService } from "./scriptService";
import { SceneService } from "./sceneService";
import { InventoryService } from "./inventoryService";
import { ActorsService } from "./actorsService";
import { ScheduleService } from "./scheduleService";

export const registerServices = (options) => {
  registerGlobalServices(options);

  serviceManager.register("AuthService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new AuthService(api);
  });

  serviceManager.register("StorageService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new StorageService(api);
  });

  serviceManager.register("ScriptService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new ScriptService(api);
  });

  serviceManager.register("SceneService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new SceneService(api);
  });

  serviceManager.register("InventoryService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new InventoryService(api);
  });

  serviceManager.register("ActorsService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new ActorsService(api);
  });

  serviceManager.register("ScheduleService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new ScheduleService(api);
  });
};

export { serviceManager };
