import { Store } from "../store/dataStore";

export type ServiceResult =
  | { success: true; message: string }
  | { success: false; error: string };

  export class LockerService {
    constructor(private store: Store) {
        
    }
  }
