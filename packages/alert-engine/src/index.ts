import { createConnection, version } from "@clariq/core";

export function createAlertEngine(connectionString: string) {
  const connection = createConnection(connectionString);
  
  return {
    connection,
    version,
    start: () => console.log("Alert engine started"),
    stop: () => console.log("Alert engine stopped")
  };
}