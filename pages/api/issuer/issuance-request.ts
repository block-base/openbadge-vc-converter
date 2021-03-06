import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withSession } from "../../../lib/session";

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
  req: NextApiRequest & Session,
  res: NextApiResponse<Data>
) {
  const { email, file } = req.body;
  const base64ImageWithoutPrefix = file.split(",")[1];
  const openBadgeMetadata = await extractOpenBadgeMetadataFromImage(
    base64ImageWithoutPrefix
  );
  const result = await validateOpenBadge(email, openBadgeMetadata);
  if (!result) {
    throw new Error("OpenBadge invalid");
  }
  await withSession(req, res);
  console.log(req.session.id);
  const manifestURL = await prepareIssueRequest(openBadgeMetadata);

  const { pin, url } = await issueRequest(
    manifestURL,
    openBadgeMetadata,
    email,
    req.session.id
  );
  res.status(200).json({
    pin,
    url,
  });
}
