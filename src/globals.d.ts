// FiveM Global Functions
declare function RegisterNuiCallbackType(callbackType: string): void;
declare function on(eventName: string, callback: (...args: any[]) => void): void;
declare function onNet(eventName: string, callback: (...args: any[]) => void): void;
declare function emit(eventName: string, ...args: any[]): void;
declare function emitNet(eventName: string, ...args: any[]): void;
declare function SendNuiMessage(message: string): void;
declare function GetCurrentResourceName(): string;
declare function GetCurrentServerEndpoint(): string;

// Global namespace
declare namespace NodeJS {
  interface Global {
    exports: any;
  }
}

declare var global: NodeJS.Global;
