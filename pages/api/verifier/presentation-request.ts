import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withSession } from "../../../lib/session";
import { presentationRequest } from "../../../lib/vc";

type Data = {
  url: string;
};

export default async function handler(
  req: NextApiRequest & Session,
  res: NextApiResponse<Data>
) {
  await withSession(req, res);
  console.log(req.session.id);
  const { url } = await presentationRequest();
  res.status(200).json({
    url,
  });
}
