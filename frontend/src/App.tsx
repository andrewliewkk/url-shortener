import "./App.css";
import { Layout, Input, Row, Col, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import $ from "jquery";

const { Header, Footer, Sider, Content } = Layout;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const App: React.FC = () => {
  const [urlInput, setUrlInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shortenURL = async (): Promise<void> => {
    setIsLoading(true);
    const endpoint = process.env.REACT_APP_BACKEND_ENDPOINT || "";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: urlInput }),
    };
    fetch(endpoint, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        console.log(response.shortened);
        setSuccess(`URL shortened to`);
        setLink(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/${response.shortened}`
        );
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Failed to shorten URL");
        setIsLoading(false);
      });
  };

  const notifyCopy = (): void => {
    $(".noti").slideToggle();
    setTimeout(() => {
      $(".noti").slideToggle();
    }, 3000);
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
            <Col span={24}>
              {error && <span>{error}</span>}
              {success && (
                <div>
                  <span>
                    {success}
                    <br></br>
                    <a
                      onClick={() => {
                        navigator.clipboard.writeText(link || "");
                        notifyCopy();
                      }}
                    >
                      {link}
                    </a>
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </div>
        <div className="noti" style={{ display: "none" }}>
          <span>Link Copied!</span>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
