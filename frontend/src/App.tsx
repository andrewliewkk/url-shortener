import "./App.css";
import { Layout, Input, Row, Col, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Header, Footer, Sider, Content } = Layout;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function App() {
  const [urlInput, setUrlInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shortenURL = async () => {
    setIsLoading(true);
    const endpoint = process.env.REACT_APP_BACKEND_ENDPOINT || "";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: urlInput }),
    };
    fetch(endpoint, requestOptions)
      .then((response) => {
        response.json();
      })
      .then((data) => {
        setSuccess(`URL shortened to`);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Failed to shorten URL");
        setIsLoading(false);
      });
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Content>
        <div className="container">
          <Row>
            <Col span={24}>
              <h1>FASTAPI URL Shortener</h1>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Input
                addonBefore="http://"
                placeholder="mysite"
                style={{ width: 250 }}
                defaultValue={urlInput}
                onChange={(event) => {
                  setUrlInput(event.target.value);
                }}
              />
              <Button type="primary" loading={isLoading} onClick={shortenURL}>
                Submit
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>{error && <span>{error}</span>}</Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
