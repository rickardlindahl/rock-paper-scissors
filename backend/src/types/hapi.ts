import type { Request } from "@hapi/hapi";

export interface HapiRequest<T extends Request["payload"], P extends {} = Request["params"]> extends Request {
  readonly payload: T;
  readonly params: P;
}
