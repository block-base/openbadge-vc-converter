import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

import { Flex, Container } from "@chakra-ui/react";

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.VFC<LayoutProps> = ({ children }) => {
  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      <Header />
      <Container flex={1}>{children}</Container>
      <Footer />
    </Flex>
  );
};
