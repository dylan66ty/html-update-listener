interface IntervalId {
    flag: boolean;
    timer: number | undefined;
}
export declare const asyncInterval: (callback: (...args: any[]) => void, wait: number, ...args: any[]) => IntervalId;
export declare const composeAsync: (...fns: any[]) => any;
export {};
