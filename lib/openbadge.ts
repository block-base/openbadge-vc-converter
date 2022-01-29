var pngitxt = require("png-itxt");
var Through = require("stream").PassThrough;

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
  // TODO:
  // OpenBadgeのvalidateをする

  return true;
};
