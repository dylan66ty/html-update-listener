declare class HtmlUpdateListener {
    private oldScripts;
    private newScripts;
    private timer;
    private event;
    constructor(timer?: number);
    private init;
    private parserScript;
    private getHTML;
    private getScripts;
    private run;
    private compare;
    on(eventName: string | 'update', callback: () => void): void;
    off(eventName: string, callback: () => void): void;
    once(eventName: string, callback: (...args: any[]) => void): void;
    emit(eventName: string, ...args: any[]): void;
    offAll(eventName: string): void;
}
export { HtmlUpdateListener };
export default HtmlUpdateListener;
