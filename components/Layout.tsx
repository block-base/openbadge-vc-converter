import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

import { Flex, Box } from "@chakra-ui/react";

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.VFC<LayoutProps> = ({ children }) => {
  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      <Header />
      <Box flex={1}>{children}</Box>
      <Footer />
    </Flex>
  );
};
