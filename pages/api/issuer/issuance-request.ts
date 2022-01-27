// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  pin: number;
  url: string;
};

//TODO:ファイルの投げ方は後で決める
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({
    pin: 1234,
    url: "https://nextjs.org/docs/api-routes/introduction",
  });
}
