import type { NextApiRequest, NextApiResponse } from "next";

import {
  extractOpenBadgeMetadataFromImage,
  validateOpenBadge,
} from "../../../lib/openbadge";

import { prepareIssueRequest, issueRequest } from "../../../lib/vc";

type Data = {
  pin: number;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const base64ImageWithoutPrefix = req.body.file.split(",")[1];
  const openBadgeMetadata = await extractOpenBadgeMetadataFromImage(
    base64ImageWithoutPrefix
  );
  const result = await validateOpenBadge(openBadgeMetadata);
  if (!result) {
    throw new Error("OpenBadge invalid");
  }
  const manifestURL = await prepareIssueRequest(openBadgeMetadata);
  const { pin, url } = await issueRequest(manifestURL, openBadgeMetadata);
  res.status(200).json({
    pin,
    url,
  });
}
