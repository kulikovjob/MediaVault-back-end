// sessionStorage.ts
class SessionStorage {
  private static instance: SessionStorage;
  private connectionString: string | null = null;

  private constructor() {}

  public static getInstance(): SessionStorage {
    if (!SessionStorage.instance) {
      SessionStorage.instance = new SessionStorage();
    }
    return SessionStorage.instance;
  }

  public setConnectionString(connectionString: string) {
    this.connectionString = connectionString;
  }

  public getConnectionString(): string | null {
    return this.connectionString;
  }

  public clearConnectionString() {
    this.connectionString = null;
  }
}

export default SessionStorage.getInstance();
