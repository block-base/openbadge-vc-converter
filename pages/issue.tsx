import React from "react";
import type { NextPage } from "next";

import {
  Button,
  Text,
  Box,
  Heading,
  Flex,
  Image,
  Input,
  FormControl,
  FormHelperText,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";
import { WarningIcon, CheckCircleIcon } from "@chakra-ui/icons";
import QRCode from "react-qr-code";
import axios from "axios";
import { QRCodeStatus, RequestStatus } from "../types/status";
import { Layout } from "../components/Layout";
import { SERVICE_DESCRITION, SERVICE_NAME } from "../configs";
import { Metatag } from "../components/Metatag";
import { Loading } from "../components/Loading";

const Issue: NextPage = () => {
  const pageTitle = `${SERVICE_NAME} - Issuer`;

  const [requestStatus, setRequestStatus] =
    React.useState<RequestStatus>("waiting");

  const [qrCodeStatus, setQrCodeStatus] =
    React.useState<QRCodeStatus>("waiting");

  const [email, setEmail] = React.useState("");
  const [image, setImage] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [pin, setPin] = React.useState("");

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const requestIssuance = async () => {
    setRequestStatus("loading");
    axios
      .post("/api/issuer/issuance-request", {
        email,
        file: image,
      })
      .then(function ({ data }) {
        const { url, pin } = data;
        setUrl(url);
        setPin(pin);
        setRequestStatus("requested");
        const intervalMs = 5000;
        setInterval(() => {
          getIssuanceResponse();
        }, intervalMs);
      })
      .catch(function (err) {
        console.error(err);
        setRequestStatus("failed");
      });
  };

  const getIssuanceResponse = () => {
    axios.get("/api/issuer/issuance-response").then(function ({ data }) {
      const { status } = data;
      if (status === "request_retrieved") {
        setQrCodeStatus("scanned");
      } else if (status === "issuance_successful") {
        setQrCodeStatus("success");
      }
    });
  };

  const uploadPicture = (e: any) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage("");
    }
  };

  return (
    <Layout>
      <Metatag title={pageTitle} description={SERVICE_DESCRITION} />
      <Heading
        fontWeight={600}
        fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
        lineHeight={"110%"}
      >
        {pageTitle}
      </Heading>
      {requestStatus == "waiting" && (
        <FormControl>
          <Box mb="8px">
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input
              value={email}
              name="email"
              placeholder="email"
              onChange={handleEmailChange}
            />
            <FormHelperText>
              Email is validated with openbadge recipients
            </FormHelperText>
          </Box>
          <Box mb="8px">
            <FormLabel htmlFor="image">OpenBadge</FormLabel>
            <input
              type="file"
              name="image"
              onChange={(e) => {
                uploadPicture(e);
              }}
            />
            <FormHelperText>PNG and SVG are supported.</FormHelperText>
          </Box>
          {image && <Image src={image} w="sm" alt="openbadge_preview"></Image>}
          <Button
            my="4"
            w="full"
            colorScheme="green"
            type="submit"
            name="upload"
            onClick={requestIssuance}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
          >
            Upload
          </Button>
        </FormControl>
      )}
      {requestStatus == "loading" && <Loading />}
      {requestStatus == "failed" && (
        <Flex w="full" align={"center"} direction={"column"}>
          <WarningIcon w={24} h={24} color="red.500" />
          <Text my="4">Verification failed. Reason: </Text>
          <Button
            w="full"
            colorScheme="blue"
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
          <Image src={image} width="2xs" height="auto" alt=""></Image>
          <CheckCircleIcon mt="8" w={24} h={24} color="green.500" />
          <Text align="center" fontSize="lg" mt="2">
            OpenBadge verified
          </Text>
          <Text fontSize="lg" mt="8">
            Read this QR with MS Authenticator
          </Text>
          {qrCodeStatus === "waiting" && (
            <>
              <Box mt="4">
                <QRCode value={url} />
              </Box>
              <Box mt="4">
                <Text>PIN: {pin}</Text>
              </Box>
            </>
          )}
          {qrCodeStatus === "scanned" && (
            <Text fontSize="lg" mt="8">
              Scanned
            </Text>
          )}
          {qrCodeStatus === "success" && (
            <Text fontSize="lg" mt="8">
              Issued!!
            </Text>
          )}
        </Flex>
      )}
    </Layout>
  );
};

export default Issue;
