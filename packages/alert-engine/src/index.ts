import { ConnectionManager, PostgreSQLConnection, version } from "@clariq/core";

export function createAlertEngine(connectionString: string) {
  const connection = new PostgreSQLConnection({
    name: "alert-engine",
    url: connectionString
  });
  
  return {
    connection,
    version,
    start: () => console.log("Alert engine started"),
    stop: () => console.log("Alert engine stopped")
  };
}