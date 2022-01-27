// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  pin: number;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body.file);
  res.status(200).json({
    pin: 1234,
    url: "https://nextjs.org/docs/api-routes/introduction",
  });
}
