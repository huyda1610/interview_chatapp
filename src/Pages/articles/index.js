import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, StarOutlined, MessageOutlined } from "@ant-design/icons";
import {
  Divider,
  Row,
  Col,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Typography,
  Tooltip,
  List,
  Avatar,
  Tag,
  Select,
} from "antd";

import styles from "./articles.module.scss";

import dayjs from "dayjs";
import articleAPI from "../../Services/articleAPI";
import commentAPI from "../../Services/commentAPI";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [comment, setComment] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [slug, setSlug] = useState("");
  const [commentModal, setCommentModal] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleCommentModal = () => setCommentModal(!commentModal);
  const _getAllArticles = async () => {
    try {
      const res = await articleAPI.getAllArticles();
      if (res.status === 200) {
        setArticles(res.data.articles);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _getArticle = async (slug) => {
    try {
      const res = await articleAPI.getArticle(slug);
      if (res.status === 200) {
        form.setFieldsValue(res.data.article);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _addAndUpdateArticle = async (data) => {
    try {
      let res;
      if (slug === "") {
        res = await articleAPI.createArticle(data);
      } else {
        res = await articleAPI.updateArticle(slug, data);
      }
      if (
        (slug === "" && res.status === 201) ||
        (slug !== "" && res.status === 200)
      ) {
        messageApi.open({
          type: "success",
          content:
            slug === ""
              ? "Add Article success !!!"
              : "Update Article success !!!",
        });
        form.resetFields();
        toggleModal();
        _getAllArticles();
      } else {
        messageApi.open({
          type: "error",
          content:
            slug === "" ? "Add Article error !!!" : "Update Article error !!!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _deleteArticle = async (slug) => {
    try {
      const res = await articleAPI.deleteArticle(slug);
      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: "Delete Article success !!!",
        });
        _getAllArticles();
      } else {
        messageApi.open({
          type: "error",
          content: "Delete Article error !!!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _getComment = async (slug) => {
    try {
      const res = await commentAPI.getComment(slug);
      if (res.status === 200) {
        setComment(res.data.comments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _addComment = async (slug, body) => {
    try {
      const res = await commentAPI.createComment(slug, body);
      if (res.status === 201) {
        messageApi.open({
          type: "success",
          content: "Add Comment success !!!",
        });
        _getComment(slug);
      } else {
        messageApi.open({
          type: "error",
          content: "Add Comment error !!!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _deleteComment = async (slug, id) => {
    try {
      const res = await commentAPI.deleteComment(slug, id);
      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: "Delete Comment success !!!",
        });
        _getComment(slug);
      } else {
        messageApi.open({
          type: "error",
          content: "Delete Comment error !!!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateArticle = (slug) => {
    toggleModal();
    _getArticle(slug);
    setSlug(slug);
  };

  useEffect(() => {
    _getAllArticles();
  }, []);

  return (
    <>
      {contextHolder}
      <Modal
        title="Comment Info"
        open={commentModal}
        onCancel={toggleCommentModal}
        footer={null}
      >
        <List
          size="small"
          bordered
          locale={{ emptyText: "No Comment" }}
          dataSource={comment}
          pagination={{
            pageSize: 4,
          }}
          itemLayout="vertical"
          renderItem={(item) => (
            <List.Item
              key={item.title}
              extra={
                <Space>
                  <Popconfirm
                    title="Delete comment"
                    description="Are you sure to delete this comment?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => _deleteComment(slug, item.id)}
                  >
                    <Button type="primary" danger>
                      Remove
                    </Button>
                  </Popconfirm>
                </Space>
              }
            >
              <List.Item.Meta
                title={item.author.username}
                description={item.author.email}
              />
              <h2>{item.body}</h2>
            </List.Item>
          )}
        />
        <Input
          placeholder="Add comment by type here and press enter"
          style={{ marginTop: 30 }}
          size="large"
          onPressEnter={(e) => _addComment(slug, e.target.value)}
        />
      </Modal>
      <Modal
        title={slug === "" ? "Add New Article" : "Update Article"}
        open={isModalOpen}
        okText={slug === "" ? "Add" : "Update"}
        onCancel={toggleModal}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              _addAndUpdateArticle(values);
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
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Please fill out this field !!!" },
            ]}
          >
            <Input size="large" placeholder="Title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please fill this field !!!" }]}
          >
            <Input.TextArea autoSize size="large" placeholder="Description" />
          </Form.Item>
          <Form.Item
            label="Body"
            name="body"
            rules={[{ required: true, message: "Please fill this field !!!" }]}
          >
            <Input size="large" placeholder="Body" />
          </Form.Item>
          <Form.Item label="Tag list" name="tagList">
            <Select
              mode="tags"
              size="large"
              style={{ width: "100%" }}
              placeholder="Enter tags"
              tokenSeparators={[","]}
            >
              <Select.Option key="test">test</Select.Option>
              <Select.Option key="tag2">tag2</Select.Option>
              <Select.Option key="tag3">tag3</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Row justify="space-between">
        <Col>
          <h2>Articles</h2>
        </Col>
        <Col>
          <Button
            size="large"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              toggleModal();
              setSlug("");
              form.resetFields();
            }}
          >
            Add new articles
          </Button>
        </Col>
      </Row>
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 2,
        }}
        dataSource={articles}
        renderItem={(item) => (
          <List.Item
            key={item.title}
            extra={
              <Space>
                <Button
                  size="large"
                  onClick={() => handleUpdateArticle(item.slug)}
                >
                  Update
                </Button>
                <Popconfirm
                  title="Delete article"
                  description="Are you sure to delete this article?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => _deleteArticle(item.slug)}
                >
                  <Button size="large" danger>
                    Remove
                  </Button>
                </Popconfirm>
              </Space>
            }
          >
            <List.Item.Meta
              avatar={
                <img
                  src={
                    item.author.image === ""
                      ? "https://gravatar.com/avatar/ae946a33f890f711577b9738a671c0c1?s=400&d=robohash&r=x"
                      : item.author.image
                  }
                  style={{ width: 60, height: 60 }}
                  alt={item.username}
                />
              }
              title={item.author.username}
              description={item.author.email}
            />
            <Space direction="vertical">
              <h2 style={{ color: "#4096ff" }}>{item.title}</h2>
              <Typography.Text>
                <span style={{ fontWeight: 600 }}>Created</span>:{" "}
                {dayjs(item.created).format("HH:MM DD/MM/YYYY")}
              </Typography.Text>
              <Typography.Text>
                <span style={{ fontWeight: 600 }}>Updated</span>:{" "}
                {dayjs(item.updated).format("HH:MM DD/MM/YYYY")}
              </Typography.Text>
              <Typography.Text>
                <span style={{ fontWeight: 600 }}>
                  Rating <StarOutlined />
                </span>
                : {item.favoriteCount}
              </Typography.Text>
              <Typography.Text>
                <span style={{ fontWeight: 600 }}>Description</span>:{" "}
                {item.description}
              </Typography.Text>
              <Typography.Text>
                <span style={{ fontWeight: 600 }}>Body</span>:{" "}
                {item.description}
              </Typography.Text>
              {item.tagList.length > 0 && (
                <Typography.Text>
                  <span style={{ fontWeight: 600 }}>Tag list</span>: :{" "}
                  {item.tagList.map((tag) => {
                    return (
                      <Tag index={tag} color="#f50">
                        #{tag}
                      </Tag>
                    );
                  })}
                </Typography.Text>
              )}
              <Button
                type="primary"
                icon={<MessageOutlined />}
                onClick={() => {
                  toggleCommentModal();
                  _getComment(item.slug);
                  setSlug(item.slug);
                }}
              >
                Show Comment
              </Button>
            </Space>
          </List.Item>
        )}
      />
    </>
  );
};

export default Articles;
