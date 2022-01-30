import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../lib/redis";

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("******** presentation callback *********");
  console.log(req.body);
  redis.set(req.body.state, req.body.code);
  res.send(200);
}
