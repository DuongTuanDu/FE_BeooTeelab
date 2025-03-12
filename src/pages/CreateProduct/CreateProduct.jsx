import React, { useEffect, useState } from "react";
import {
    Card,
    Form,
    Input,
    InputNumber,
    Select,
    Upload,
    Button,
    Row,
    Col,
    message,
} from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    UploadOutlined,
    MinusCircleOutlined,
} from "@ant-design/icons";
import CustomReactQuill from './CustomReactQuill'; // Import the new wrapper
import { uploadFile } from "../../helpers/uploadCloudinary";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryAdmin } from "../../redux/category/category.thunk";
import { createProduct } from "../../redux/product/product.thunk";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories } = useSelector((state) => state.category);
    const [submitting, setSubmitting] = useState(false);

    // State to store temporary files and previews
    const [tempFiles, setTempFiles] = useState({
        mainImage: null,
        variants: {},
    });
    const [previews, setPreviews] = useState({
        mainImage: null,
        variants: {},
    });

    useEffect(() => {
        dispatch(getCategoryAdmin());
    }, [dispatch]);

    const handleMainImageChange = (file) => {
        const previewUrl = URL.createObjectURL(file);
        setPreviews((prev) => ({
            ...prev,
            mainImage: previewUrl,
        }));
        setTempFiles((prev) => ({
            ...prev,
            mainImage: file,
        }));
        return false; // Prevent default upload
    };

    const handleVariantImageChange = (file, fieldName) => {
        const previewUrl = URL.createObjectURL(file);
        setPreviews((prev) => ({
            ...prev,
            variants: {
                ...prev.variants,
                [fieldName]: previewUrl,
            },
        }));
        setTempFiles((prev) => ({
            ...prev,
            variants: {
                ...prev.variants,
                [fieldName]: file,
            },
        }));
        return false;
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const values = await form.validateFields();

            // Upload mainImage
            let mainImageData = { url: "", publicId: "" };
            if (tempFiles.mainImage) {
                const mainImageResult = await uploadFile(tempFiles.mainImage);
                mainImageData = {
                    url: mainImageResult.secure_url,
                    publicId: mainImageResult.public_id,
                };
            }

            // Upload variant images
            const variantsData = await Promise.all(
                (values.variants || []).map(async (variant, index) => {
                    if (tempFiles.variants[index]) {
                        const variantImageResult = await uploadFile(
                            tempFiles.variants[index]
                        );
                        return {
                            color: variant.color,
                            image: {
                                url: variantImageResult.secure_url,
                                publicId: variantImageResult.public_id,
                            },
                        };
                    }
                    return variant;
                })
            );

            const productData = {
                ...values,
                mainImage: mainImageData,
                variants: variantsData,
            };

            const result = await dispatch(createProduct(productData)).unwrap();
            if (result.success) {
                message.success(result.message);
                navigate("/admin/products");
            }
        } catch (error) {
            message.error("Please check the information again");
        } finally {
            setSubmitting(false);
        }
    };

    const renderImageUpload = (fieldName, variantIndex = null) => {
        const isVariant = variantIndex !== null;
        const previewImage = isVariant
            ? previews.variants[variantIndex]
            : previews.mainImage;

        return (
            <div className="border p-4 rounded">
                {previewImage ? (
                    <div className="relative">
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-36 object-contain"
                        />
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            className="absolute top-2 right-2"
                            onClick={() => {
                                if (isVariant) {
                                    setPreviews((prev) => ({
                                        ...prev,
                                        variants: {
                                            ...prev.variants,
                                            [variantIndex]: null,
                                        },
                                    }));
                                    setTempFiles((prev) => ({
                                        ...prev,
                                        variants: {
                                            ...prev.variants,
                                            [variantIndex]: null,
                                        },
                                    }));
                                } else {
                                    setPreviews((prev) => ({ ...prev, mainImage: null }));
                                    setTempFiles((prev) => ({ ...prev, mainImage: null }));
                                }
                            }}
                        />
                    </div>
                ) : (
                    <Upload
                        maxCount={1}
                        showUploadList={false}
                        beforeUpload={(file) =>
                            isVariant
                                ? handleVariantImageChange(file, variantIndex)
                                : handleMainImageChange(file)
                        }
                    >
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                )}
            </div>
        );
    };

    return (
        <div className="mt-4 mx-auto">
            <Card bordered={false} className="shadow-lg">
                <Form form={form} layout="vertical" requiredMark={false}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Product Name"
                                rules={[
                                    { required: true, message: "Please enter product name" },
                                ]}
                            >
                                <Input placeholder="Enter product name" />
                            </Form.Item>

                            <Form.Item
                                name="category"
                                label="Category"
                                rules={[{ required: true, message: "Please select a category" }]}
                            >
                                <Select placeholder="Select category">
                                    {categories?.map((cat) => (
                                        <Select.Option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[{ required: true, message: "Please enter price" }]}
                            >
                                <InputNumber
                                    className="w-full"
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                    placeholder="Enter price"
                                />
                            </Form.Item>

                            <Form.Item
                                name="mainImage"
                                label="Main Image"
                                rules={[
                                    { required: true, message: "Please upload main image" },
                                ]}
                            >
                                {renderImageUpload("mainImage")}
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <div className="py-2">Product Variant Information</div>
                            <Form.List name="variants">
                                {(fields, { add, remove }) => (
                                    <div className="space-y-4">
                                        {fields.map((field, index) => (
                                            <Card
                                                key={field.key}
                                                size="small"
                                                className="bg-gray-50"
                                                extra={
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<MinusCircleOutlined />}
                                                        onClick={() => remove(field.name)}
                                                    />
                                                }
                                            >
                                                <Form.Item
                                                    name={[field.name, "color"]}
                                                    label="Color"
                                                    rules={[
                                                        { required: true, message: "Please enter color" },
                                                    ]}
                                                >
                                                    <Input placeholder="Enter color" />
                                                </Form.Item>

                                                <Form.Item
                                                    name={[field.name, "image"]}
                                                    label="Variant Image"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please upload variant image",
                                                        },
                                                    ]}
                                                >
                                                    {renderImageUpload("variants", field.name)}
                                                </Form.Item>
                                            </Card>
                                        ))}
                                        <Button
                                            size="middle"
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Add Variant
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: "Please enter description" }]}
                    >
                        <CustomReactQuill
                            style={{ height: 400, marginBottom: "50px" }}
                        />
                    </Form.Item>

                    <Form.Item className="mt-8">
                        <Row gutter={8}>
                            <Col>
                                <Button onClick={() => navigate("/admin/products")}>Cancel</Button>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={handleSubmit}
                                    loading={submitting}
                                >
                                    Add Product
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateProduct;