import React, { useState } from "react";
import styles from "./login.module.scss";
import { Button, Form, Input, Row, Col, Tabs, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import userAPI from "../../Services/userAPI";
import loginAPI from "../../Services/loginAPI";
import { login } from "../../Slices/authSlice";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const _login = async (account) => {
    try {
      setLoading(true);
      const res = await loginAPI.login(account);
      if (res.status === 201) {
        form.resetFields();
        dispatch(login(res.data.user));
        navigate("/users");
      } else {
        messageApi.open({
          type: "error",
          content: "Email or Password is not correct !!! Please try again.",
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const _registerUser = async (account) => {
    try {
      if (account.password !== account.confirmPassword) {
        messageApi.open({
          type: "error",
          content: "Password is not match !!!",
        });
        return;
      }
      setLoading(true);
      const res = await userAPI.registerUser(account);
      if (res.status === 201) {
        form.resetFields();
        dispatch(login(res.data.user));
        navigate("/users");
      } else {
        messageApi.open({
          type: "error",
          content: Object.values(res.data.errors),
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "login",
      label: (
        <div style={{ fontSize: 23, fontWeight: 700, color: "white" }}>
          Login
        </div>
      ),
      children: (
        <Row justify="center" align="middle" style={{ padding: "0px 80px" }}>
          <Form layout="vertical" style={{ width: "100%" }} onFinish={_login}>
            <Form.Item
              label={<div style={{ color: "white" }}>Email</div>}
              name="email"
              rules={[{ required: true, message: "Please fill out Email !!!" }]}
            >
              <Input size="large" placeholder="Email" />
            </Form.Item>
            <Form.Item
              label={<div style={{ color: "white" }}>Password</div>}
              name="password"
              rules={[
                { required: true, message: "Please fill out Password !!!" },
              ]}
            >
              <Input.Password
                size="large"
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Row justify="space-between">
              <p style={{ margin: "20px 0px", color: "white" }}>
                Don't have an account? Change to Register Tab
              </p>
            </Row>
            <Row justify="center">
              <Form.Item style={{ width: "100%" }}>
                <Button
                  size="large"
                  type="primary"
                  style={{
                    width: "100%",
                  }}
                  htmlType="submit"
                  loading={loading}
                >
                  Login
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Row>
      ),
    },
    {
      key: "register",
      label: (
        <div style={{ fontSize: 23, fontWeight: 700, color: "white" }}>
          Register
        </div>
      ),
      children: (
        <Row justify="center" align="middle" style={{ padding: "0px 80px" }}>
          <Form
            layout="vertical"
            style={{ width: "100%" }}
            onFinish={_registerUser}
          >
            <Form.Item
              label={<div style={{ color: "white" }}>Username</div>}
              name="username"
              rules={[
                { required: true, message: "Please fill out Username !!!" },
              ]}
            >
              <Input size="large" placeholder="Username" />
            </Form.Item>
            <Form.Item
              label={<div style={{ color: "white" }}>Email</div>}
              name="email"
              rules={[{ required: true, message: "Please fill out Email !!!" }]}
            >
              <Input size="large" placeholder="Email" />
            </Form.Item>
            <Form.Item
              label={<div style={{ color: "white" }}>Password</div>}
              name="password"
              rules={[
                { required: true, message: "Please fill out Password !!!" },
              ]}
            >
              <Input.Password
                size="large"
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              label={<div style={{ color: "white" }}>Confirm Password</div>}
              name="confirmPassword"
              rules={[
                { required: true, message: "Please fill out this field !!!" },
              ]}
            >
              <Input.Password
                size="large"
                type="password"
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Row justify="center">
              <Form.Item style={{ width: "100%" }}>
                <Button
                  size="large"
                  type="primary"
                  style={{
                    width: "100%",
                    margin: "20px 0px",
                  }}
                  htmlType="submit"
                  loading={loading}
                >
                  Register
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Row>
      ),
    },
  ];

  return (
    <Row className={styles["login-container"]}>
      {contextHolder}
      <Col
        xs={24}
        sm={24}
        md={14}
        lg={16}
        xl={10}
        className={styles["login-content"]}
      >
        <Tabs
          className="tabs-login"
          size="large"
          defaultActiveKey="login"
          items={tabItems}
          centered
        ></Tabs>
      </Col>
    </Row>
  );
};

export default Login;
