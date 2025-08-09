import { version } from "@clariq/core";
import { createAlertEngine } from "@clariq/alert-engine";

export function main() {
  console.log(`Clariq CLI v${version}`);
  
  const engine = createAlertEngine("postgresql://localhost:5432/test");
  engine.start();
}