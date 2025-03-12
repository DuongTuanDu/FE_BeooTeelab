import React, { useState } from "react";
import { useGetAllProductsQuery } from "../../redux/product/product.query";
import { useGetAllCategoryQuery } from "../../redux/category/category.query";
import {
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Button,
    Card,
    message,
    Upload,
    Skeleton,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/vi_VN";
import { uploadFile } from "../../helpers/uploadCloudinary";
import { useDispatch } from "react-redux";
import { createPromotionAction } from "../../redux/promotion/promotion.thunk";
import TabSelect from "./TabSelect";
import moment from "moment";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CreatePromotion = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [promotionType, setPromotionType] = useState("PERCENTAGE");
    const [uploadedImage, setUploadedImage] = useState(null);
    const [activeTab, setActiveTab] = useState("products");
    const [loading, setLoading] = useState(false);

    const { data: dataProduct, isLoading: isLoadingProduct } =
        useGetAllProductsQuery({});

    const { data: dataCategory, isLoading: isLoadingCategory } =
        useGetAllCategoryQuery();

    if (isLoadingProduct || isLoadingCategory)
        return <Skeleton active className="mt-6" />;

    const products = dataProduct?.data || [];
    const categories = dataCategory?.data || [];

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

            const res = await dispatch(createPromotionAction(payload)).unwrap();
            if (res.success) {
                message.success(res.message);
                form.resetFields();
                setSelectedProducts([]);
                setSelectedCategories([]);
                setUploadedImage(null);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-md mt-6">
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
                            { max: 250, message: "Tên khuyến mãi vượt quá 250 ký tự" },
                        ]}
                    >
                        <Input placeholder="Nhập tên khuyến mãi" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Loại khuyến mãi"
                        name="type"
                        initialValue="PERCENTAGE"
                        rules={[{ required: true }]}
                    >
                        <Select
                            size="large"
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
                            size="large"
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
                            size="large"
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
                            size="large"
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
                    >
                        <RangePicker
                            className="w-full"
                            size="large"
                            locale={locale}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => {
                                return current && current < moment().startOf("day");
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Banner khuyến mãi"
                        name="banner"
                        rules={[{ required: true, message: "Vui lòng tải lên banner" }]}
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

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                    >
                        <TextArea rows={4} placeholder="Nhập mô tả khuyến mãi" />
                    </Form.Item>
                </div>

                <div className="mt-6">
                    <TabSelect
                        {...{
                            setSelectedProducts,
                            setSelectedCategories,
                            products,
                            categories,
                            activeTab,
                            setActiveTab,
                        }}
                    />
                </div>

                <div className="flex justify-end mt-6 space-x-4">
                    <Button
                        type="default"
                        onClick={() => {
                            form.resetFields();
                            setSelectedProducts([]);
                            setSelectedCategories([]);
                            setUploadedImage(null);
                        }}
                    >
                        Đặt lại
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-blue-500"
                        loading={loading}
                    >
                        Tạo khuyến mãi
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default CreatePromotion;