import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Row, Col, Typography, Divider, Space } from "antd";
import {
    FacebookOutlined,
    InstagramOutlined,
    TwitterOutlined,
} from "@ant-design/icons";
import HeaderCustomer from "../Header/HeaderCustomer";
import logo from "../../resources/logo.png";

const { Content, Footer } = Layout;
const { Title, Link, Text } = Typography;

const FooterSection = ({ title, links }) => (
    <div className="mb-8">
        <Title level={5} className="mb-4 text-gray-900">
            {title}
        </Title>
        <Space direction="vertical" size="small">
            {links.map((link, index) => (
                <Link key={index} className="text-gray-600 hover:text-gray-900">
                    {link}
                </Link>
            ))}
        </Space>
    </div>
);

const LayoutUser = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const aboutLinks = [
        "Trang chủ",
        "Tất cả sản phẩm",
        "Kiểm tra đơn hàng",
        "Hệ Thống Cửa Hàng",
    ];

    const socialLinks = ["Facebook", "Instagram"];

    const policyLinks = [
        "Chính sách mua hàng",
        "Chính sách bảo mật",
        "Phương thức thanh toán",
        "Chính sách giao nhận",
        "Chính sách đổi trả",
    ];

    return (
        <Layout className="min-h-screen">
            <HeaderCustomer />

            <Content className="py-24 flex-grow px-4 md:px-16 min-h-screen bg-white">
                {children}
            </Content>

            <Footer className="bg-white px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <Row gutter={[32, 32]} className="mb-8">
                        <Col xs={24} md={8}>
                            <img src={logo} alt="TeeLab" className="h-16 mb-4" />
                        </Col>
                        <Col xs={24} md={16}>
                            <Row gutter={[32, 32]}>
                                <Col xs={24} sm={8}>
                                    <FooterSection title="About Us" links={aboutLinks} />
                                </Col>
                                <Col xs={24} sm={8}>
                                    <FooterSection title="Follow Us" links={socialLinks} />
                                </Col>
                                <Col xs={24} sm={8}>
                                    <FooterSection
                                        title="Chính sách cửa hàng"
                                        links={policyLinks}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Divider className="my-6" />

                    <Row justify="space-between" align="middle" className="flex-wrap">
                        <Col
                            xs={24}
                            sm={12}
                            className="text-center sm:text-left mb-4 sm:mb-0"
                        >
                            <Text className="text-gray-600">
                                © {new Date().getFullYear()} TeeLab. All rights reserved.
                            </Text>
                        </Col>
                        <Col xs={24} sm={12} className="text-center sm:text-right">
                            <Space size="large">
                                <Link
                                    href="#"
                                    className="text-xl text-gray-600 hover:text-gray-900"
                                >
                                    <FacebookOutlined />
                                </Link>
                                <Link
                                    href="#"
                                    className="text-xl text-gray-600 hover:text-gray-900"
                                >
                                    <InstagramOutlined />
                                </Link>
                                <Link
                                    href="#"
                                    className="text-xl text-gray-600 hover:text-gray-900"
                                >
                                    <TwitterOutlined />
                                </Link>
                            </Space>
                        </Col>
                    </Row>
                </div>
            </Footer>
        </Layout>
    );
};

export default LayoutUser;