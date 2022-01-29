import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../lib/redis";

type Data = {
  status: number;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // - request_retrieved
  // - issuance_successful
  const response = await redis.get(req.query.id as string);
  console.log(response);

  res.status(200).json({
    status: 0,
    message: "ok",
  });
}
