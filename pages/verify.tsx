import React from "react";
import type { NextPage } from "next";

import { Button, Text, Box, Heading, Flex, Spinner } from "@chakra-ui/react";
import { WarningIcon, CheckCircleIcon } from "@chakra-ui/icons";
import QRCode from "react-qr-code";
import axios from "axios";
import { QRCodeStatus, RequestStatus } from "../types/status";
import { Layout } from "../components/Layout";
import { SERVICE_DESCRITION, SERVICE_NAME } from "../configs";
import { Metatag } from "../components/Metatag";

const Home: NextPage = () => {
  const pageTitle = `${SERVICE_NAME} - Verifier`;

  const [requestStatus, setRequestStatus] =
    React.useState<RequestStatus>("waiting");

  const [qrCodeStatus, setQrCodeStatus] =
    React.useState<QRCodeStatus>("waiting");

  const [url, setUrl] = React.useState("");
  const [metadata, setMetadata] = React.useState<any>();

  const getPresentationResponse = () => {
    axios.get("/api/verifier/presentation-response").then(function ({ data }) {
      const { status } = data;
      console.log(status);
      if (status === "request_retrieved") {
        setQrCodeStatus("scanned");
      } else if (status === "presentation_successful") {
        setQrCodeStatus("success");
      }
    });
  };

  const requestPresentation = async () => {
    setRequestStatus("loading");
    axios
      .get("/api/verifier/presentation-request")
      .then(function ({ data }) {
        const { url } = data;
        setUrl(url);
        setRequestStatus("requested");
        const intervalMs = 5000;
        setInterval(() => {
          getPresentationResponse();
        }, intervalMs);
      })
      .catch(function (err) {
        setRequestStatus("failed");
      });
  };

  return (
    <Layout>
      <Metatag title={pageTitle} description={SERVICE_DESCRITION} />

      <Heading>{pageTitle}</Heading>

      {requestStatus == "waiting" && (
        <>
          <Flex w="full" align={"center"} direction={"column"}>
            <Text>Get a Verify QR Code and present your VC</Text>
            <Button
              w="full"
              my="4"
              colorScheme="teal"
              onClick={() => requestPresentation()}
            >
              Get a Verify QR Code
            </Button>
          </Flex>
        </>
      )}
      {requestStatus == "loading" && (
        <Flex w="full" align={"center"} direction={"column"}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Text mt="4">Loading...</Text>
        </Flex>
      )}
      {requestStatus == "failed" && (
        <Flex w="full" align={"center"} direction={"column"}>
          <WarningIcon w={24} h={24} color="red.500" />
          <Text my="4">Verification failed. Reason: </Text>
          <Button
            w="full"
            colorScheme="teal"
            my="4"
            onClick={() => setRequestStatus("waiting")}
          >
            Try again
          </Button>
        </Flex>
      )}
      {requestStatus == "requested" && (
        <>
          {qrCodeStatus === "waiting" && (
            <>
              <Box mt="4">
                <QRCode value={url} />
              </Box>
            </>
          )}
          {qrCodeStatus === "scanned" && (
            <Text fontSize="lg" mt="8">
              Scanned
            </Text>
          )}
          {qrCodeStatus === "success" && (
            <Flex w="full" align={"center"} direction={"column"}>
              {/* {metadata.image.id ? (
                  <Image
                    src={metadata.image.id}
                    width="2xs"
                    height="auto"
                    alt=""
                  ></Image>
                ) : (
                  <></>
                )} */}
              <CheckCircleIcon mt="8" w={24} h={24} color="green.500" />
              <Text align="center" fontSize="lg" mt="2">
                Credential Verified
              </Text>
            </Flex>
          )}
        </>
      )}
    </Layout>
  );
};

export default Home;
