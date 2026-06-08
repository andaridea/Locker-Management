export type LockerStatus = "TERSEDIA" | "DIPESAN";

export interface Locker {
    id: string;
    status: LockerStatus;
    reservedBy: string | null;
    waitingQueue: string[]
}