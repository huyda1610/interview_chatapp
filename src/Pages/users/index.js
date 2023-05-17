import React, { useState, useEffect } from "react";
import { UserAddOutlined, CloseOutlined } from "@ant-design/icons";
import {
  Divider,
  Row,
  Col,
  Button,
  Table,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Typography,
  Tooltip,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";

import userAPI from "../../Services/userAPI";
import { getAllUsers } from "../../Slices/userSlice";

export const validateEmail = (_, value) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (value.match(emailRegex)) {
    return Promise.resolve();
  }
  return Promise.reject("Please enter a valid email address");
};

const Users = () => {
  const { users } = useSelector((state) => state.user);
  const { loginAccount } = useSelector((state) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationHolder] = notification.useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const _addUser = async (account) => {
    try {
      if (account.password !== account.confirmPassword) {
        messageApi.open({
          type: "error",
          content: "Password is not match !!!",
        });
        return;
      }
      const res = await userAPI.registerUser(account);
      if (res.status === 201) {
        form.resetFields();
        toggleModal();
        messageApi.open({
          type: "success",
          content: "Add user success",
        });
        dispatch(getAllUsers());
      } else {
        messageApi.open({
          type: "error",
          content: Object.values(res.data.errors),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _deleteUser = async (email) => {
    try {
      const res = await userAPI.deleteUser(email);
      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: "Delete success !!!",
        });
        dispatch(getAllUsers());
      } else {
        messageApi.open({
          type: "error",
          content: "Delete error !!!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  useEffect(() => {
    if (users?.statusCode === 500) {
      notificationApi.error({
        message: `Internal Server Error`,
        description:
          "Cannot get the users data due to server error !!! Try to reload the page again.",
      });
    }
  }, [users]);

  // useEffect(() => {
  //   if (users.length === 0) {
  //     dispatch(getAllUsers());
  //   }
  // }, [users]);

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      width: "5%",
      align: "center",
    },
    {
      title: "Avatar",
      dataIndex: "image",
      render: (_, record) => (
        <img
          src={
            record.image === ""
              ? "https://gravatar.com/avatar/ae946a33f890f711577b9738a671c0c1?s=400&d=robohash&r=x"
              : record.image
          }
          style={{ width: 90, height: 90 }}
          alt={record.username}
        />
      ),
      align: "center",
      width: "5%",
    },
    {
      title: "User Name",
      dataIndex: "username",
      width: "20%",
      render: (_, record) => (
        <>
          {record.email === loginAccount.email ? (
            <Tooltip title="Login Account">
              <Typography.Text strong style={{ color: "red" }}>
                {record.username}
              </Typography.Text>
            </Tooltip>
          ) : (
            <Typography.Text strong>{record.username}</Typography.Text>
          )}
        </>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
    },
    {
      title: "Description",
      dataIndex: "bio",
      width: "20%",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Popconfirm
          title="Delete user"
          description="Are you sure to delete this user?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => _deleteUser(record.email)}
        >
          <Button
            type="text"
            icon={<CloseOutlined />}
            danger
            disabled={record.email === loginAccount.email}
          >
            Remove
          </Button>
        </Popconfirm>
      ),
      align: "center",
      width: "5%",
    },
  ];
  return (
    <>
      {contextHolder}
      {notificationHolder}
      <Modal
        title="Add New User"
        open={isModalOpen}
        okText="Add"
        onCancel={toggleModal}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              _addUser(values);
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
          <Form.Item
            label="Password"
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
            label="Confirm Password"
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
        </Form>
      </Modal>
      <Row justify="space-between">
        <Col>
          <h2>Users</h2>
        </Col>
        <Col>
          <Button
            size="large"
            type="primary"
            icon={<UserAddOutlined />}
            onClick={toggleModal}
          >
            Add new user
          </Button>
        </Col>
      </Row>
      <Divider />
      <Table
        size="large"
        columns={columns}
        bordered
        dataSource={
          users.length > 0 &&
          users.map((item, index) => ({ ...item, index: index + 1 }))
        }
        pagination={{
          pageSize: 4,
          total: users.length,
        }}
      />
    </>
  );
};

export default Users;
