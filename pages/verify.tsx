import React from "react";
import type { NextPage } from "next";

import {
  Button,
  Text,
  Box,
  Heading,
  Flex,
  ListItem,
  ListIcon,
  List,
} from "@chakra-ui/react";
import { WarningIcon, CheckCircleIcon } from "@chakra-ui/icons";
import QRCode from "react-qr-code";
import axios from "axios";
import { QRCodeStatus, RequestStatus } from "../types/status";
import { Layout } from "../components/Layout";
import { SERVICE_DESCRITION, SERVICE_NAME } from "../configs";
import { Metatag } from "../components/Metatag";
import { Loading } from "../components/Loading";

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
      } else if (status === "presentation_verified") {
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
      <Heading
        textAlign={"center"}
        fontWeight={600}
        fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
        lineHeight={"110%"}
      >
        {pageTitle}
      </Heading>
      {requestStatus == "waiting" && (
        <Flex w="full" align={"center"} direction={"column"}>
          <Button
            w="full"
            my="4"
            colorScheme="green"
            onClick={() => requestPresentation()}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
          >
            Get a Verify QR Code
          </Button>
        </Flex>
      )}
      {requestStatus == "loading" && (
        <Flex w="full" align={"center"} direction={"column"}>
          <Loading />
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
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
          >
            Try again
          </Button>
        </Flex>
      )}
      {requestStatus == "requested" && (
        <Flex w="full" align={"center"} direction={"column"}>
          {qrCodeStatus === "waiting" && (
            <Box p={"4px"}>
              <Text
                textAlign={"center"}
                fontSize="lg"
                mb="2"
                fontWeight={"bold"}
              >
                MS Authenticator QR
              </Text>
              <QRCode value={url} />
            </Box>
          )}
          {qrCodeStatus === "scanned" && (
            <Text fontSize="lg" mt="8">
              QR code scanned...
            </Text>
          )}
          {qrCodeStatus === "success" && (
            <Flex w="full" align={"center"} direction={"column"}>
              <CheckCircleIcon
                textAlign={"center"}
                mt="8"
                w={8}
                h={8}
                color="green.500"
              />
              <Text mb="4" align="center" fontSize="sm" mt="2">
                OpenBadge verified
              </Text>
              <List>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  OpenBadge is validated by IMS Global OpanBadge Validator
                </ListItem>
              </List>
            </Flex>
          )}
        </Flex>
      )}
    </Layout>
  );
};

export default Home;
