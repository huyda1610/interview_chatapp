import {
  MenuFoldOutlined,
  WechatOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  RobotOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Row,
  Col,
  Avatar,
  Typography,
  Dropdown,
  Modal,
  Input,
  Form,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import userAPI from "../../Services/userAPI";

import { logout } from "../../Slices/authSlice";
import { useNavigate, Outlet } from "react-router-dom";
import { getAllUsers } from "../../Slices/userSlice";
const { Header, Sider, Content } = Layout;

const validateEmail = (_, value) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (value.match(emailRegex)) {
    return Promise.resolve();
  }
  return Promise.reject("Please enter a valid email address");
};

const HomeTemplate = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loginAccount } = useSelector((state) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedKeys, setSelectedKeys] = useState(
    localStorage.getItem("selectedMenuItem") || "1"
  );

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [form] = Form.useForm();

  const handleMenuSelect = ({ key }) => {
    if (key !== "3") {
      setSelectedKeys(key);
      localStorage.setItem("selectedMenuItem", key);
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const _getUser = async () => {
    try {
      const res = await userAPI.getUserInfo();
      if (res.status === 200) {
        setUser(res.data.user);
        dispatch(getAllUsers());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _editUser = async (account) => {
    try {
      const res = await userAPI.editUser(account);
      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: "Edit success !!!",
        });
        toggleModal();
        _getUser();
      } else {
        messageApi.open({
          type: "error",
          content: "Edit error !!!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    navigate("/login");
    dispatch(logout());
  };

  const handleOpenModal = () => {
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      bio: user.bio,
      image: user.image,
    });
    toggleModal();
  };

  useEffect(() => {
    _getUser();
  }, []);

  const items = [
    {
      key: "1",
      label: "Personal info",
      icon: <UserOutlined />,
      onClick: () => {
        handleOpenModal();
      },
    },
    {
      key: "2",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        handleLogout();
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <Modal
        title="User Info"
        open={isModalOpen}
        okText="Edit"
        onCancel={toggleModal}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              _editUser(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ width: "100%", marginTop: 20 }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please fill out Username !!!" },
            ]}
          >
            <Input size="large" placeholder="Username" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please fill out Email !!!" },
              { validator: validateEmail },
            ]}
          >
            <Input size="large" placeholder="Email" />
          </Form.Item>
          <Form.Item label="Description" name="bio">
            <Input size="large" type="bio" placeholder="Description" />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Input size="large" type="bio" placeholder="Image" />
          </Form.Item>
        </Form>
      </Modal>
      <Layout style={{ maxHeight: "100%", minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          {!collapsed && (
            <p
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 32,
                padding: 16,
                fontWeight: 600,
              }}
            >
              MyApp
            </p>
          )}
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            onSelect={handleMenuSelect}
            selectedKeys={selectedKeys}
            items={[
              {
                key: "1",
                icon: <UsergroupAddOutlined />,
                label: "Users",
                onClick: () => {
                  navigate("/users");
                },
              },
              {
                key: "2",
                icon: <WechatOutlined />,
                label: "Articles",
                onClick: () => {
                  navigate("/articles");
                },
              },
              {
                key: "3",
                icon: <LogoutOutlined />,
                label: "Logout",
                onClick: () => {
                  handleLogout();
                },
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              paddingLeft: 6,
              paddingRight: 32,
              background: colorBgContainer,
            }}
          >
            <Row justify="space-between">
              <Col>
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "16px",
                    width: 64,
                    height: 64,
                  }}
                />
              </Col>
              <Col>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 32,
                    fontWeight: 600,
                  }}
                >
                  MyApp
                </p>
              </Col>
              <Col>
                <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottomLeft"
                >
                  <Row justify="left" align="middle" gutter={12}>
                    <Col>
                      <Avatar
                        size={40}
                        style={{ backgroundColor: "#4BA7F3" }}
                        icon={<RobotOutlined />}
                      />
                    </Col>
                    <Col>
                      <Typography.Text strong>
                        {user.username || loginAccount.username}
                      </Typography.Text>
                    </Col>
                  </Row>
                </Dropdown>
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
export default HomeTemplate;
