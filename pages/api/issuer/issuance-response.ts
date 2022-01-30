import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../lib/redis";
import { Session, withSession } from "../../../lib/session";
import { IssuanceStatus } from "../../../types/status";

type Data = {
  status: IssuanceStatus;
};

export default async function handler(
  req: NextApiRequest & Session,
  res: NextApiResponse<Data>
) {
  await withSession(req, res);
  console.log(req.session.id);
  const response = await redis.get(req.session.id as string);
  res.status(200).json({
    status: response as IssuanceStatus,
  });
}
