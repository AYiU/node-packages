import { GetPocket } from "./get-pocket";

/**
 * create batch action
 * - add
 * - archive
 * - readd
 * - favorite
 * - unfavorite
 * - delete
 * - addTags
 * - removeTags
 *
 * - fetchRequestToken
 * - fetchAccessToken
 * - getRedirectUrl
 *
 * - add
 * - get
 * -
 */
test("create item", async () => {
  const pocket = new GetPocket(
    process.env.POCKET_CONSUMER_KEY!,
    process.env.POCKET_REDIRECT_URL!
  );
  pocket.setAccessToken(process.env.POCKET_ACCESS_TOKEN!);

  const addResponse = await pocket.add(
    "https://ayiu.net/article/2e4440c6ba991e496d72992315d4f8e5",
    "生死教育｜妻患癌入院 寫314天日記紀錄最後時光 夫憶相處點滴：冇一件事唔開心",
    "Testing"
  );

  console.log(addResponse);

  expect(addResponse.status).toBe(1);
  expect(addResponse.item).toBeDefined();

  const getResponse = await pocket.get({
    tag: "Testing",
  });

  expect(getResponse.status).toBe(1);
  expect(Object.keys(getResponse.list)).toHaveLength(1);

  const batchAction = pocket.createBatchAction();
  batchAction.delete(parseInt(addResponse.item.item_id));

  const deleteResponse = await pocket.processBatchAction(batchAction);

  console.log(deleteResponse);
  expect(deleteResponse.status).toBe(1);
});
