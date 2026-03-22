// Type shim for socket.io-client v2.x (compatible with netty-socketio BE)
declare module "socket.io-client" {
  interface SocketOptions {
    path?: string;
    transports?: string[];
    query?: Record<string, string>;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    timeout?: number;
    autoConnect?: boolean;
    [key: string]: any;
  }

  interface SocketInstance {
    id: string;
    connected: boolean;
    disconnected: boolean;
    on(event: string, listener: (...args: any[]) => void): this;
    off(event: string, listener?: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): this;
    disconnect(): this;
    connect(): this;
  }

  function io(url: string, opts?: SocketOptions): SocketInstance;
  export default io;
}
