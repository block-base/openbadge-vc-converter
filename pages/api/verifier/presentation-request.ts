import type { NextApiRequest, NextApiResponse } from "next";
import { presentationRequest } from "../../../lib/vc";

type Data = {
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url } = await presentationRequest();
  res.status(200).json({
    url,
  });
}
