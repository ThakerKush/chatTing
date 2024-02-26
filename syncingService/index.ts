import "dotenv/config";
import { DB, RDB } from "./db/models/index";

(async function () {
  while (true) {
    const result = await RDB.xread("BLOCK", 5000, "STREAMS", "mystream", "$");
    if (result) {
      const [[streamName, messages]] = result;
      for (const messageArr of messages) {
        const [ones, fieldArr] = messageArr;

        const fields = fieldArr.reduce((acc: any, curr: any, idx: number) => {
          const tarIdx = Math.floor(idx / 2);

          if (!acc[tarIdx]) {
            acc[tarIdx] = [];
          }

          acc[tarIdx].push(curr);

          return acc;
        }, []);
        const message: any = new Map(fields);
        DB.messages.create({
          user_id: message.get("user"),
          server_id: message.get("server"),
          value: message.get("value"),
        });
      }
    }
  }
})();

async function sendHealthCheck() {
  try {
    await DB.sequelize.authenticate();
    await RDB.set("healthcheck", Date.now().toString());
  } catch (error) {
    console.error("error in syncingService:", error);
  } finally {
    // Schedule the next health check in 10000 ms
    setTimeout(sendHealthCheck, 300000);
  }
}
sendHealthCheck();
