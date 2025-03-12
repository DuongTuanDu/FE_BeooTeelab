import React from "react";
import { formatPrice } from "../../helpers/formatPrice";
import { Table, Tabs } from "antd";

const TabSelect = ({
    setSelectedProducts,
    setSelectedCategories,
    products,
    categories,
    activeTab,
    setActiveTab,
}) => {
    const productColumns = [
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Giá gốc",
            dataIndex: "price",
            key: "price",
            render: (price) => `${formatPrice(price)}đ`,
        },
        {
            title: "Danh mục",
            dataIndex: ["category", "name"],
            key: "category",
        },
    ];

    const categoryColumns = [
        {
            title: "Tên danh mục",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
        },
    ];

    const tabItems = [
        {
            key: "products",
            label: "Sản phẩm áp dụng",
            children: (
                <Table
                    rowSelection={{
                        type: "checkbox",
                        onChange: (_, selectedRows) => setSelectedProducts(selectedRows),
                        getCheckboxProps: (record) => ({
                            disabled: record.isPromotion,
                        }),
                    }}
                    columns={productColumns}
                    dataSource={products}
                    rowKey={(record) => record._id}
                    pagination={false}
                    className="h-[60vh] overflow-y-auto"
                />
            ),
        },
        {
            key: "categories",
            label: "Danh mục áp dụng",
            children: (
                <Table
                    className="h-[60vh] overflow-y-auto"
                    rowSelection={{
                        type: "checkbox",
                        onChange: (_, selectedRows) => setSelectedCategories(selectedRows),
                        getCheckboxProps: (record) => ({
                            disabled: record.isPromotion,
                        }),
                    }}
                    columns={categoryColumns}
                    dataSource={categories}
                    rowKey={(record) => record._id}
                    pagination={false}
                />
            ),
        },
    ];

    return (
        // <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
        <Table
            rowSelection={{
                type: "checkbox",
                onChange: (_, selectedRows) => setSelectedProducts(selectedRows),
                getCheckboxProps: (record) => ({
                    disabled: record.isPromotion,
                }),
            }}
            columns={productColumns}
            dataSource={products}
            rowKey={(record) => record._id}
            pagination={false}
            className="h-[60vh] overflow-y-auto"
        />
    );
};

export default TabSelect;