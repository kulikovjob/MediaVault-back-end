// connectionManager.ts
class ConnectionManager {
  private static instance: ConnectionManager;
  private connectionString: string | null = null;

  private constructor() {}

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  public setConnectionString(connectionString: string) {
    this.connectionString = connectionString;
  }

  public getConnectionString(): string | null {
    return this.connectionString;
  }
}

export default ConnectionManager.getInstance();
