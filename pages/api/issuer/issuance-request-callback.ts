import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../lib/redis";

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("******** issuance callback *********");
  console.log(req.body);
  // req.body.stateに入っているsession idを持つsession objectにcode（Authenticatorでのスキャン状態）を入れる
  // [code]
  // - request_retrieved
  // - issuance_successful
  redis.set(req.body.state, req.body.code);
  res.send(200);
}
