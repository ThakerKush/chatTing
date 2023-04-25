import { DB, RDB } from "./db/models/index";

(async function () {
  while (true) {
    const result = await RDB.xread("BLOCK", 0, "STREAMS", "mystream", "$");
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
