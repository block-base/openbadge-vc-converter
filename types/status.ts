export type RequestStatus = "waiting" | "loading" | "failed" | "requested";
export type QRCodeStatus = "waiting" | "scanned" | "success";

export type IssuanceStatus = null | "request_retrieved" | "issuance_successful";
export type PresentationStatus =
  | null
  | "request_retrieved"
  | "presentation_successful";
