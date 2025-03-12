import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Button,
    Table,
    Upload,
    message,
    Skeleton,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/vi_VN";
import { useGetAllProductsQuery } from "../../redux/product/product.query";
import { useGetAllCategoryQuery } from "../../redux/category/category.query";
import dayjs from "dayjs";
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import { deleteFile } from "../../helpers/uploadCloudinary";
import { useDispatch } from "react-redux";
import { updatePromotionAction } from "../../redux/promotion/promotion.thunk";

dayjs.extend(weekday);
dayjs.extend(localeData);

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const UpdatePromotion = ({ promotion, open, onClose, refetch }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [promotionType, setPromotionType] = useState(
        promotion?.type || "PERCENTAGE"
    );
    const [uploadedImage, setUploadedImage] = useState(null);
    const [activeTab, setActiveTab] = useState("products");
    const [loading, setLoading] = useState(false);

    const { data: dataProduct, isLoading: isLoadingProduct } =
        useGetAllProductsQuery({});

    const { data: dataCategory, isLoading: isLoadingCategory } =
        useGetAllCategoryQuery();

    const products = dataProduct?.data || [];
    const categories = dataCategory?.data || [];

    useEffect(() => {
        if (promotion && open) {
            form.setFieldsValue({
                name: promotion.name,
                type: promotion.type,
                value: promotion.value,
                maxDiscountAmount: promotion.maxDiscountAmount,
                usageLimit: promotion.usageLimit,
                description: promotion.description,
                dateRange: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
            });
            if (promotion.banner) {
                setUploadedImage({
                    uid: "-1",
                    name: "banner.png",
                    status: "done",
                    url: promotion.banner.url,
                });
            }

            if (promotion.applicableProducts) {
                const applicableProIds = promotion.applicableProducts.map(
                    (item) => item._id
                );
                const selectedProducts = products.filter((product) =>
                    applicableProIds.includes(product._id)
                );
                setSelectedProducts(selectedProducts);
            }

            if (promotion.applicableCategories) {
                const applicableCasIds = promotion.applicableCategories.map(
                    (item) => item._id
                );
                const selectedCategories = categories.filter((category) =>
                    applicableCasIds.includes(category._id)
                );
                setSelectedCategories(selectedCategories);
            }
            setPromotionType(promotion.type);
        }
    }, [promotion, open, form]);

    if ((isLoadingProduct || isLoadingCategory) && open)
        return <Skeleton active className="mt-6" />;

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
            render: (price) => `${price.toLocaleString("vi-VN")}đ`,
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

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            let payload = {
                name: values.name,
                description: values.description,
                type: values.type,
                value: values.value,
                startDate: values.dateRange[0].toISOString(),
                endDate: values.dateRange[1].toISOString(),
            };

            if (values.maxDiscountAmount) {
                payload = {
                    ...payload,
                    maxDiscountAmount: values.maxDiscountAmount,
                };
            }

            if (values.usageLimit) {
                payload = {
                    ...payload,
                    usageLimit: values.usageLimit,
                };
            }

            if (uploadedImage?.originFileObj) {
                const resUpload = await uploadFile(uploadedImage.originFileObj);
                payload = {
                    ...payload,
                    banner: {
                        url: resUpload.secure_url,
                        publicId: resUpload.public_id,
                    },
                };
                await deleteFile(promotion?.banner?.publicId);
            }

            if (selectedProducts.length > 0) {
                payload = {
                    ...payload,
                    applicableProducts: selectedProducts.map((p) => p._id),
                };
            }

            if (selectedCategories.length > 0) {
                payload = {
                    ...payload,
                    applicableCategories: selectedCategories.map((c) => c._id),
                };
            }

            const res = await dispatch(
                updatePromotionAction({ id: promotion._id, data: payload })
            ).unwrap();

            if (res.success) {
                message.success(res.message);
                refetch();
                onClose();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: "products",
            label: "Sản phẩm áp dụng",
            children: (
                <Table
                    className="h-[60vh] overflow-y-auto"
                    rowSelection={{
                        type: "checkbox",
                        selectedRowKeys: selectedProducts.map((p) => p._id),
                        onChange: (_, selectedRows) => setSelectedProducts(selectedRows),
                    }}
                    columns={productColumns}
                    dataSource={products}
                    rowKey="_id"
                    pagination={false}
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
                        selectedRowKeys: selectedCategories.map((c) => c._id),
                        onChange: (_, selectedRows) => setSelectedCategories(selectedRows),
                    }}
                    columns={categoryColumns}
                    dataSource={categories}
                    rowKey="_id"
                    pagination={false}
                />
            ),
        },
    ];

    return (
        <Modal
            title="Cập nhật khuyến mãi"
            open={open}
            onCancel={onClose}
            width={1000}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        label="Tên khuyến mãi"
                        name="name"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên khuyến mãi" },
                        ]}
                    >
                        <Input placeholder="Nhập tên khuyến mãi" />
                    </Form.Item>

                    <Form.Item
                        label="Loại khuyến mãi"
                        name="type"
                        rules={[{ required: true }]}
                    >
                        <Select
                            onChange={setPromotionType}
                            options={[
                                { label: "Giảm theo phần trăm", value: "PERCENTAGE" },
                                { label: "Giảm theo số tiền", value: "FIXED_AMOUNT" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Giá trị giảm"
                        name="value"
                        rules={[{ required: true, message: "Vui lòng nhập giá trị giảm" }]}
                    >
                        <InputNumber
                            className="w-full"
                            min={0}
                            max={promotionType === "PERCENTAGE" ? 100 : undefined}
                            formatter={
                                promotionType === "PERCENTAGE"
                                    ? (value) => `${value}%`
                                    : (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/[%,]/g, "")}
                        />
                    </Form.Item>

                    <Form.Item label="Giới hạn giảm giá tối đa" name="maxDiscountAmount">
                        <InputNumber
                            className="w-full"
                            min={0}
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Giới hạn sử dụng"
                        name="usageLimit"
                        tooltip="Số lần khuyến mãi có thể được sử dụng"
                    >
                        <InputNumber
                            className="w-full"
                            min={0}
                            placeholder="Không giới hạn nếu để trống"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Thời gian áp dụng"
                        name="dateRange"
                        rules={[
                            { required: true, message: "Vui lòng chọn thời gian áp dụng" },
                        ]}
                        className="col-span-2"
                    >
                        <RangePicker
                            locale={locale}
                            className="w-full"
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => {
                                return current && current < dayjs().startOf('day');
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        className="col-span-2"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                    >
                        <TextArea rows={4} placeholder="Nhập mô tả khuyến mãi" />
                    </Form.Item>

                    <Form.Item
                        label="Banner khuyến mãi"
                        name="banner"
                        className="col-span-2"
                    >
                        <Upload
                            accept="image/*"
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={() => false}
                            fileList={uploadedImage ? [uploadedImage] : []}
                            onChange={({ fileList }) => setUploadedImage(fileList[0])}
                        >
                            <div>
                                <PlusOutlined />
                                <div className="mt-2">Tải lên</div>
                            </div>
                        </Upload>
                    </Form.Item>
                </div>

                <div className="mt-4">
                    {/* <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          /> */}

                    <Table
                        className="h-[60vh] overflow-y-auto"
                        rowSelection={{
                            type: "checkbox",
                            selectedRowKeys: selectedProducts.map((p) => p._id),
                            onChange: (_, selectedRows) => setSelectedProducts(selectedRows),
                        }}
                        columns={productColumns}
                        dataSource={products}
                        rowKey="_id"
                        pagination={false}
                    />
                </div>

                <div className="flex justify-end mt-6 space-x-4">
                    <Button onClick={onClose}>Hủy</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="bg-blue-500"
                    >
                        Cập nhật
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default UpdatePromotion;