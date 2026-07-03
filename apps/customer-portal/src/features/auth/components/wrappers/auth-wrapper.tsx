import { Col, Row } from "antd";
import { ReactNode } from "react";
import { AuthImage } from "../auth-image";
import { Container, Text } from "@subgrid/ui";
import Image from "next/image";

export const AuthWrapper = ({
  children,
  authLabel,
  subAuthLabel,
}: {
  children: ReactNode;
  authLabel: string;
  subAuthLabel?: string;
}) => {
  return (
    <Row>
      <Col xs={0} md={12} lg={14}>
        <AuthImage />
      </Col>
      <Col
        xs={24}
        md={12}
        lg={10}
        className="h-screen overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden pt-12"
      >
        <Row justify="center">
          <Col xs={22} md={18} lg={14}>
            <Container className="pb-6">
              <Image
                width={74}
                height={56}
                src="/assets/svgs/logo.svg"
                alt="logo"
              />
            </Container>
            <Container className="mb-8">
              <Text className="text-primary" variant="h3">
                {authLabel}
              </Text>
              {subAuthLabel && (
                <Text className="text-secondary mt-2" variant="bodySmall">
                  {subAuthLabel}
                </Text>
              )}
            </Container>

            <Container>{children}</Container>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
