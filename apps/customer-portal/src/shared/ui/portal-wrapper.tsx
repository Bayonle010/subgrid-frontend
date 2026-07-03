import { Col, Row } from "antd";
import React, { ReactNode } from "react";

export const PortalWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Row justify="center" className={className}>
      <Col lg={20} className={className}>{children}</Col>
    </Row>
  );
};
