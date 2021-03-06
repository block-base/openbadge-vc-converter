import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../lib/redis";
import { Session, withSession } from "../../../lib/session";
import { PresentationStatus } from "../../../types/status";

type Data = {
  status: PresentationStatus;
};
export default async function handler(
  req: NextApiRequest & Session,
  res: NextApiResponse<Data>
) {
  await withSession(req, res);
  const response = await redis.get(req.session.id as string);
  res.status(200).json({
    status: response as PresentationStatus,
  });
}
