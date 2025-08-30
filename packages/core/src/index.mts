export function createConnection(connectionString: string) {
  return {
    connectionString,
    isConnected: false,
    connect: () => Promise.resolve(true)
  };
}

export const version = "0.1.0";