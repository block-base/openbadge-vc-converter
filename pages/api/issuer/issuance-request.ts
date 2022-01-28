// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
const msal = require("@azure/msal-node");
var pngitxt = require("png-itxt");
var Through = require("stream").PassThrough;

// MSAL config
const msalConfig = {
  auth: {
    clientId: "2e168c3e-fda4-4e1e-8f4b-2c8d07436d35",
    authority: `https://login.microsoftonline.com/f88bec5c-c13f-4f27-972f-72540d188693`,
    clientSecret: "ksb7Q~JZh_ZgvEXSXYIDVV8hkguLDkdvsEilJ",
  },
  // system: {
  //   loggerOptions: {
  //     loggerCallback(loglevel, message, containsPii) {
  //       console.log(message);
  //     },
  //     piiLoggingEnabled: false,
  //     logLevel: msal.LogLevel.Verbose,
  //   },
  // },
};
const msalCca = new msal.ConfidentialClientApplication(msalConfig);
const msalClientCredentialRequest = {
  scopes: ["bbb94529-53a3-4be5-a069-7eaf2712b826/.default"],
  skipCache: false,
};

// templates
var issuanceConfig = require("../../../templates/issuance_request_config.json");

type Data = {
  pin: number;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const openBadgeMetadata = await extractOpenBadgeMetadataFromImage(
    req.body.file.split(",")[1]
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
  const manifestId =
    "https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiableCredential/contracts/test3";
  return manifestId;
};
const issueRequest = async (manifestId: string) => {
  // TODO:
  // manifestとアクセストークンを元にazureにリクエストを投げる
  // access_tokenを取得する
  var accessToken = "";
  try {
    const result = await msalCca.acquireTokenByClientCredential(
      msalClientCredentialRequest
    );
    if (result) {
      accessToken = result.accessToken;
    }
  } catch {
    console.log("failed to get access token");
    // res.status(401).json({
    //     'error': 'Could not acquire credentials to access your Azure Key Vault'
    //     });
    //   return;
  }
  console.log(`accessToken: ${accessToken}`);

  // issuance requestを構成する（もろもろスタティックにしている部分は後で）
  issuanceConfig.registration.clientName =
    "OpenBadge to Verifiable Credentials Gateway";
  issuanceConfig.authority =
    "did:ion:EiDJmcV2T9rx7-yK9AfBwRxwRrzr666aXnnzRIvV-xqh9w:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfNDUzOGRhNjMiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4Ijoia1VHTm01RXRFRFNrVVYxWU5mRjNpOXFscXdrSGZRdXE3anJETl96aFdtOCIsInkiOiJ5bnJQUTZtZEN4THpITGFTQ3N0S3dGNnNkSXAwTWJhNFRCQzM5Q0lNa0lJIn0sInB1cnBvc2VzIjpbImF1dGhlbnRpY2F0aW9uIiwiYXNzZXJ0aW9uTWV0aG9kIl0sInR5cGUiOiJFY2RzYVNlY3AyNTZrMVZlcmlmaWNhdGlvbktleTIwMTkifV0sInNlcnZpY2VzIjpbeyJpZCI6ImxpbmtlZGRvbWFpbnMiLCJzZXJ2aWNlRW5kcG9pbnQiOnsib3JpZ2lucyI6WyJodHRwczovL2d3LnZjaGFjay5zaXRlLyJdfSwidHlwZSI6IkxpbmtlZERvbWFpbnMifSx7ImlkIjoiaHViIiwic2VydmljZUVuZHBvaW50Ijp7Imluc3RhbmNlcyI6WyJodHRwczovL2JldGEuaHViLm1zaWRlbnRpdHkuY29tL3YxLjAvZjg4YmVjNWMtYzEzZi00ZjI3LTk3MmYtNzI1NDBkMTg4NjkzIl19LCJ0eXBlIjoiSWRlbnRpdHlIdWIifV19fV0sInVwZGF0ZUNvbW1pdG1lbnQiOiJFaUN3aE5qai1HVUJsRXlqYm9qenEzeWlBa3E4TmNvNS0tWnBKeDFHOUREbjlnIn0sInN1ZmZpeERhdGEiOnsiZGVsdGFIYXNoIjoiRWlEUG5UWHpJaVFQSnROaUtGUWc4Ynk5OVlBLWtSc01iM2EyOW5KVlBBSWpkQSIsInJlY292ZXJ5Q29tbWl0bWVudCI6IkVpQ09fdHczZl90a2Q3Vy1wTXQ2Y0ZOUXRmbk1YVjFLZWdiQW5oc3AwZ1ZhLVEifX0";
  issuanceConfig.callback.url = `https://www.google.com/api/issuer/issuance-request-callback`;
  // セッションidを入れてコールバック側へ引き継ぐ
  issuanceConfig.callback.state = "123";
  issuanceConfig.issuance.manifest = manifestId;
  issuanceConfig.issuance.type =
    '["https://www.credly.com/org/idpro/badge/cidpro-certified-foundation-level","https://w3id.org/openbadges/v2"]';

  console.log(issuanceConfig);

  var payload = JSON.stringify(issuanceConfig);
  const fetchOptions = {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": payload.length.toString(),
      Authorization: `Bearer ${accessToken}`,
    },
  };
  console.log(`payload : ${payload}`);

  var client_api_request_endpoint = `https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiablecredentials/request`;
  const response = await fetch(client_api_request_endpoint, fetchOptions);
  var resp = await response.json();
  // このレスポンスのurlをqrコードにする
  console.log(resp);

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
      })
    );
    start.write(file);
  });
};
