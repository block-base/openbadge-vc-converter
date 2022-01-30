import React from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";
export const Loading: React.VFC = () => {
  return (
    <Flex w="full" align={"center"} direction={"column"}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="green.400"
        size="xl"
      />
      <Text mt="4">Loading...</Text>
    </Flex>
  );
};
