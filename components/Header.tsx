import React from "react";

import { Box, Flex, Link } from "@chakra-ui/react";

export const Header: React.VFC = () => {
  return (
    <Box>
      <Flex
        minH={"64px"}
        alignItems={"center"}
        justifyContent={"space-between"}
        p={{ base: 8 }}
      >
        <Link href="/" fontSize={"xl"} fontWeight={"bold"}>
          OpenBadge & VC Converter
        </Link>
        <Flex gap={"16px"}>
          <Link href="/issue" fontSize={"lg"} fontWeight={"bold"}>
            Issue
          </Link>
          <Link href="/verify" fontSize={"lg"} fontWeight={"bold"}>
            Verify
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};
