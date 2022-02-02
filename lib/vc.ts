import axios from "axios";
import manifestTemlate from "../templates/manifest.json";
import issuanceConfig from "../templates/issuance_request_config.json";
import presentationConfig from "../templates/presentation_request_config.json";

const authority =
  "did:ion:EiDJ1gcjpBDiQGqiDoPZWC9V-szF9x_1wOMj04hUMNY_Eg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfYmRhNjJiN2QiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4IjoicmVzNm4za1FMVFUyYXZFZWdrRE5kQmJKOUVIVmZ0em1XMnVoY1RKaUx5USIsInkiOiJ4WjZGWGE1S25ZbVo4MFYxSkQzZDdsZFlYQUxMNGhtUlg3U3JtU2d0UElFIn0sInB1cnBvc2VzIjpbImF1dGhlbnRpY2F0aW9uIiwiYXNzZXJ0aW9uTWV0aG9kIl0sInR5cGUiOiJFY2RzYVNlY3AyNTZrMVZlcmlmaWNhdGlvbktleTIwMTkifV0sInNlcnZpY2VzIjpbeyJpZCI6ImxpbmtlZGRvbWFpbnMiLCJzZXJ2aWNlRW5kcG9pbnQiOnsib3JpZ2lucyI6WyJodHRwczovL29wZW5iYWRnZS12Yy1jb252ZXJ0ZXIudmVyY2VsLmFwcC8iXX0sInR5cGUiOiJMaW5rZWREb21haW5zIn0seyJpZCI6Imh1YiIsInNlcnZpY2VFbmRwb2ludCI6eyJpbnN0YW5jZXMiOlsiaHR0cHM6Ly9iZXRhLmh1Yi5tc2lkZW50aXR5LmNvbS92MS4wL2Y4OGJlYzVjLWMxM2YtNGYyNy05NzJmLTcyNTQwZDE4ODY5MyJdfSwidHlwZSI6IklkZW50aXR5SHViIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlBOVNNS2xCazdUbm9yUDJ2cEkzaVg1eUx2M2FIM0trbWR2WEpFRmxWU3ZVUSJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpQXR1QnhLWXlnclA4NDk0ZEJ0WXRpY3QzcVJQYWF5a0tTSjNIWi15dWZiOWciLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaUNZUGlaUEVvZVhxYTBLaXNZREpOekl3VUpZRUFrXzQxbERkdDFOSlI2NFFRIn19";

const host = "https://openbadge-vc-converter.vercel.app/";

const clientName = "OpenBadge to Verifiable Credentials Gateway";

const msal = require("@azure/msal-node");

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

//TODO:
// OpenBadgeから取得したIssuer、CredentialType、イメージ画像の情報を元にrulesおよびdisplayファイルを動的に生成、Azure Storage APIを使ってストレージへアップロード
export const createManifest = async () => {
  const { data } = await axios.post(
    "https://beta.did.msidentity.com/f88bec5c-c13f-4f27-972f-72540d188693/api/portable/v1.0/admin/contracts",
    manifestTemlate
  );
};

export const prepareIssueRequest = async (
  openBadgeMetadata: any
): Promise<string> => {
  const { data } = await axios.get(openBadgeMetadata.badge);
  const { issuer, image, criteria } = data;

  // TODO:
  // contractエンドポイントへ必要な情報を投げ込んで動的にManifestを作成
  // createManifest()

  switch (criteria.id) {
    case "https://www.credly.com/org/project-management-institute/badge/project-management-professional-pmp":
      return "https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiableCredential/contracts/PMP";
    case "https://www.credly.com/org/idpro/badge/idpro-member":
      return "https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiableCredential/contracts/IDProMember";
    case "https://www.credly.com/org/idpro/badge/cidpro-exam-writer":
      return "https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiableCredential/contracts/CIDProItemWriter";
    case "https://www.credly.com/org/idpro/badge/cidpro-certified-foundation-level":
    default:
      return "https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiableCredential/contracts/CIDPROCertifiedFoundationLevel";
  }
};

export const issueRequest = async (
  manifestId: string,
  openBadgeMetadata: any,
  email: string,
  sessionId: string
) => {
  // TODO:
  // manifestとアクセストークンを元にazureにリクエストを投げる
  // access_tokenを取得する
  let accessToken = "";
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

  const pin = Math.floor(1000 + Math.random() * 9000);

  // issuance requestを構成する（もろもろスタティックにしている部分は後で）
  // claims
  // openbadge
  const { data } = await axios.get(openBadgeMetadata.badge);

  console.log(sessionId);

  issuanceConfig.issuance.pin.value = pin.toString();
  issuanceConfig.issuance.claims.email = email;
  issuanceConfig.issuance.claims.openbadge = JSON.stringify(data);

  issuanceConfig.registration.clientName = clientName;
  issuanceConfig.authority = authority;
  issuanceConfig.callback.url = `${host}api/issuer/issuance-request-callback`;
  // セッションidを入れてコールバック側へ引き継ぐ
  issuanceConfig.callback.state = sessionId;
  issuanceConfig.issuance.manifest = manifestId;

  const payload = JSON.stringify(issuanceConfig);

  const fetchOptions = {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": payload.length.toString(),
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const client_api_request_endpoint = `https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiablecredentials/request`;
  const response = await fetch(client_api_request_endpoint, fetchOptions);
  const { url } = await response.json();
  return { pin, url };
};

export const presentationRequest = async (sessionId: string) => {
  let accessToken = "";
  try {
    const result = await msalCca.acquireTokenByClientCredential(
      msalClientCredentialRequest
    );
    if (result) {
      accessToken = result.accessToken;
    }
  } catch {
    console.log("failed to get access token");
  }
  presentationConfig.registration.clientName = clientName;
  presentationConfig.authority = authority;
  presentationConfig.callback.url = `${host}api/verifier/presentation-request-callback`;
  // セッションidを入れてコールバック側へ引き継ぐ
  presentationConfig.callback.state = sessionId;
  presentationConfig.presentation.requestedCredentials[0].type = "OpenBadgeV2";
  presentationConfig.presentation.requestedCredentials[0].acceptedIssuers = [
    authority,
  ];
  const payload = JSON.stringify(presentationConfig);

  const fetchOptions = {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": payload.length.toString(),
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const client_api_request_endpoint = `https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiablecredentials/request`;
  const response = await fetch(client_api_request_endpoint, fetchOptions);
  const resp = await response.json();
  return { url: resp.url };
};
