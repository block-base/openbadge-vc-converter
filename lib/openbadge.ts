import axios from "axios";
const pngitxt = require("png-itxt");
const Through = require("stream").PassThrough;

const openBadgeVerifierURL =
  "https://openbadgesvalidator.imsglobal.org/results";

export const extractOpenBadgeMetadataFromImage = (imageString: string) => {
  const file = Buffer.from(imageString, "base64");
  return new Promise(function (resolve, reject) {
    const start = new Through();
    start.pipe(
      pngitxt.get("openbadges", function (err: any, data: any) {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(data.value));
      })
    );
    start.write(file);
  });
};

export const validateOpenBadge = async (openBadgeMetadata: any) => {
  const { data } = await axios.post(
    openBadgeVerifierURL,
    {
      data: JSON.stringify(openBadgeMetadata),
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return data.report.valid;
};
