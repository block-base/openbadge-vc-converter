import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import {
  Button,
  Text,
  Container,
  Box,
  Heading,
  Flex,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { WarningIcon, CheckCircleIcon } from "@chakra-ui/icons";
import QRCode from "react-qr-code";

const Home: NextPage = () => {
  const [status, setStatus] = React.useState<
    "initial" | "loading" | "verified" | "failed"
  >("initial");

  const [image, setImage] = React.useState<any>();
  const [url, setUrl] = React.useState("");

  const setImageAction = async (event: any) => {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData();
    formData.append("file", image.imageAsFile);
    const data = await fetch(
      "http://localhost:3000/api/issuer/issuance-request",
      {
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      }
    );
    const result = await data.json();
    if (result.url) {
      setUrl(result.url);
      setStatus("verified");
    } else {
      setStatus("failed");
    }
  };

  const uploadPicture = (e: any) => {
    setImage({
      imagePreview: URL.createObjectURL(e.target.files[0]),
      imageAsFile: e.target.files[0],
    });
  };

  return (
    <>
      <Head>
        <title>OpenBadge to ION VC Converter</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Heading my="8">OpenBadge to ION VC Converter</Heading>
        {status == "initial" && (
          <>
            <Text>Input your OpenBadge png/svg</Text>
            <Box my="8">
              <form onSubmit={setImageAction}>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => {
                    uploadPicture(e);
                  }}
                />
                {image?.imagePreview ? (
                  <Image src={image.imagePreview} w="sm" alt=""></Image>
                ) : (
                  <></>
                )}
                <br />
                <Button
                  my="4"
                  w="full"
                  colorScheme="blue"
                  type="submit"
                  name="upload"
                >
                  Upload
                </Button>
              </form>
            </Box>
          </>
        )}
        {status == "verified" && (
          <>
            <Flex w="full" align={"center"} direction={"column"}>
              <Image
                src={image.imagePreview}
                width="2xs"
                height="auto"
                alt=""
              ></Image>
              <CheckCircleIcon mt="8" w={24} h={24} color="green.500" />
              <Text align="center" fontSize="lg" mt="2">
                OpenBadge verified
              </Text>
              <Text fontSize="lg" mt="8">
                Read this QR with MS Authenticator
              </Text>
              <Box mt="4">
                <QRCode value={url} />
              </Box>
              <Button
                w="full"
                colorScheme="blue"
                my="4"
                onClick={() => setStatus("initial")}
              >
                Try again
              </Button>
            </Flex>
          </>
        )}
        {status == "failed" && (
          <Flex w="full" align={"center"} direction={"column"}>
            <WarningIcon w={24} h={24} color="red.500" />
            <Text my="4">Verification failed. Reason: </Text>
            <Button
              w="full"
              colorScheme="blue"
              my="4"
              onClick={() => setStatus("initial")}
            >
              Try again
            </Button>
          </Flex>
        )}
        {status == "loading" && (
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
      </Container>
    </>
  );
};

export default Home;
