// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
var pngitxt = require("png-itxt");
var Through = require("stream").PassThrough;
const { BlobServiceClient } = require("@azure/storage-blob");

type Data = {
  pin: number;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const openBadgeMetadata = await extractOpenBadgeMetadataFromImage(
    req.body.file.split(",")[1],
  );
  const result = await validateOpenBadge(openBadgeMetadata);
  if (!result) {
    throw new Error("OpenBadge invalid");
  }
  const manifestId = await prepareIssueRequest(openBadgeMetadata);
  const { pin, url } = await issueRequest(manifestId);
  res.status(200).json({
    pin,
    url,
  });
}

const prepareIssueRequest = async (openBadgeMetadata: any): Promise<string> => {
  // ・Issuer名："issuer": { "name": "xxx"および"descrption": "xxx" } の値
  const { data } = await axios.get(openBadgeMetadata.badge);
  const { issuer, image, criteria } = data;
  console.log("issuer name :" + issuer.name);
  console.log("issuer description :" + issuer.description);
  // ・画像URL : "image": { "id": "https://xxxx.png" }の値
  console.log("image id :" + image.id);
  // ・CredentialType相当の値:: "criteria": { "id": "https://xxx" } の値
  console.log("criteria id :" + criteria.id);
  // TODO:
  // OpenBadgeから取得したIssuer、CredentialType、イメージ画像の情報を元にrulesおよびdisplayファイルを動的に生成、Azure Storage APIを使ってストレージへアップロード
  // contractエンドポイントへ必要な情報を投げ込んで動的にManifestを作成

  // 環境変数 .env
  const AZURE_STORAGE_CONNECTION_STRING =
    process.env.AZURE_STORAGE_CONNECTION_STRING;
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING,
  );

  // コンテナ名
  const containerName = "vcstg";
  // コンテナクライアントの生成
  const containerClient = blobServiceClient.getContainerClient(containerName);
  // TODO: OpneBadgeの識別子をユニークな形として使用
  const file_id = "";
  // Rulesファイル名の作成
  const rulesFileName = "rules_" + file_id + ".json";
  // Rulesファイル名の作成（重複回避のためuuidを付与）
  const displayFileName = "display_" + file_id + ".json";
  // rulesテンプレートの読み込み
  var rulesConfig = require("../../../templates/rules.json");
  // TODO: 置き換え（この辺はマッピングを決めたらブラッシュアップ）
  rulesConfig.vc.type = [
    "https://www.credly.com/org/idpro/badge/cidpro-certified-foundation-level”,“https://w3id.org/openbadges/v2",
  ];
  // displayテンプレートの読み込み
  var displayConfig = require("./templates/display.json");
  // TODO: 置き換え（この辺はマッピングを決めたらブラッシュアップ）
  displayConfig.default.card.title = "CIDPRO™ Certified - Foundation Level";
  displayConfig.default.card.issuedBy = "IDPro";
  // Get a block blob client
  // Upload data to the blob
  const rulesBlockBlobClient =
    containerClient.getBlockBlobClient(rulesFileName);
  const rulesData = JSON.stringify(rulesConfig);
  const uploadRulesBlobResponse = await rulesBlockBlobClient.upload(
    rulesData,
    rulesData.length,
  );
  // Upload data to the blob
  const displayBlockBlobClient =
    containerClient.getBlockBlobClient(displayFileName);
  const displayData = JSON.stringify(displayConfig);
  const uploadDisplayBlobResponse = await displayBlockBlobClient.upload(
    displayData,
    displayData.length,
  );
  console.log(
    "rules was uploaded successfully. requestId: ",
    uploadRulesBlobResponse.requestId,
  );
  console.log(
    "display was uploaded successfully. requestId: ",
    uploadDisplayBlobResponse.requestId,
  );

  const manifestId = "";
  return manifestId;
};
const issueRequest = async (manifestId: string) => {
  // TODO:
  // manifestとアクセストークンを元にazureにリクエストを投げる
  return { pin: 1234, url: "https://nextjs.org/docs/api-routes/introduction" };
};

const validateOpenBadge = async (openBadgeMetadata: any) => {
  // TODO:
  // OpenBadgeのvalidateをする
  return true;
};

const extractOpenBadgeMetadataFromImage = (imageString: string) => {
  const file = Buffer.from(imageString, "base64");
  return new Promise(function (resolve, reject) {
    const start = new Through();
    start.pipe(
      pngitxt.get("openbadges", function (err: any, data: any) {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(data.value));
      }),
    );
    start.write(file);
  });
};
