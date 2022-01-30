import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Button, Text, Container, Heading, Stack } from "@chakra-ui/react";

import { Layout } from "../components/Layout";
import { SERVICE_NAME, SERVICE_DESCRITION } from "../configs";
import NextLink from "next/link";

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>{SERVICE_NAME}</title>
        <meta name="description" content={SERVICE_DESCRITION} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW={"5xl"}>
        <Stack
          textAlign={"center"}
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Verifiable Credential meets{" "}
            <Text as={"span"} color={"green.400"}>
              OpenBadge
            </Text>
          </Heading>
          <Text color={"gray.500"} maxW={"3xl"}>
            {SERVICE_DESCRITION}
          </Text>
          <Stack spacing={8} direction={"row"}>
            <NextLink href="/issue" passHref>
              <Button
                as={"a"}
                rounded={"full"}
                px={6}
                colorScheme={"green"}
                bg={"green.400"}
                _hover={{ bg: "green.500" }}
              >
                Issue
              </Button>
            </NextLink>
            <NextLink href="/verify" passHref>
              <Button
                as={"a"}
                rounded={"full"}
                px={6}
                colorScheme={"green"}
                bg={"green.400"}
                _hover={{ bg: "green.500" }}
              >
                Verify
              </Button>
            </NextLink>
          </Stack>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Home;
