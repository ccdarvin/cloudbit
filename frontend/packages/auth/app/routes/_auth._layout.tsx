import { Outlet } from "@remix-run/react";
import { Col, Row, Layout, theme } from "antd";

const { useToken } = theme;

export default function AuthLayout() {
  const { token } = useToken();
  return (
    <Layout>
      <Row>
        <Col
          xs={{
            span: 24,
          }}
          md={{
            span: 12,
          }}
          lg={{
            span: 10,
          }}
        >
          <Outlet />
        </Col>
        <Col
          style={{
            backgroundColor: token.colorPrimary,
          }}
          xs={{
            span: 0,
          }}
          md={{
            span: 12,
          }}
          lg={{
            span: 14,
          }}
        ></Col>
      </Row>
    </Layout>
  );
}
