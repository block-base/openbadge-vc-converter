// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: number;
  message: string;
  openBadgeMetadata: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({
    status: 0,
    message: "ok",
    openBadgeMetadata: {},
  });
}
