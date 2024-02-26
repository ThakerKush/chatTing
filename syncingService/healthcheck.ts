import "dotenv/config";
import { DB, RDB } from "./db/models/index";
async function test() {
  const test = await RDB.get("healthcheck", (err, res) => {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      if (Number(res) < Date.now() - 300000) {
        console.log("Healthcheck failed");
        process.exit(1);
      }

      console.log("Healthcheck passed");
      process.exit(0);
    }
  });
}
test();
