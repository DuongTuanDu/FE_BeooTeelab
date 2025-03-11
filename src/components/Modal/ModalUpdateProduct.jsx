import React, { useEffect, useState } from "react";
import {
    Modal,
    Card,
    message,
    Form,
    Input,
    Select,
    InputNumber,
    Upload,
    Button,
    Row,
    Col,
} from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    UploadOutlined,
    MinusCircleOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { uploadFile, deleteFile } from "../../helpers/uploadCloudinary";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryAdmin } from "../../redux/category/category.thunk";
import {
    getProductAdmin,
    updateProduct,
} from "../../redux/product/product.thunk";

const ModalUpdateProduct = ({
    open = false,
    setOpen,
    width = 1000,
    data = {},
    setData,
}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const { pagination } = useSelector((state) => state.product);
    const [submitting, setSubmitting] = useState(false);
    const [deletedVariants, setDeletedVariants] = useState([]);

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

    useEffect(() => {
        if (data) {
            setTempFiles({ mainImage: null, variants: {} });
            setPreviews({ mainImage: null, variants: {} });

            form.setFieldsValue({
                name: data.name,
                category: data.category?._id,
                price: data.price,
                description: data.description,
                mainImage: data.mainImage,
                variants: data.variants || [],
            });
        } else {
            form.resetFields();
            setTempFiles({ mainImage: null, variants: {} });
            setPreviews({ mainImage: null, variants: {} });
        }
    }, [data, form]);

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
        return false;
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

            let mainImageData = values.mainImage;
            if (tempFiles.mainImage) {
                if (values.mainImage?.publicId) {
                    await deleteFile(values.mainImage.publicId);
                }
                const mainImageResult = await uploadFile(tempFiles.mainImage);
                mainImageData = {
                    url: mainImageResult.secure_url,
                    publicId: mainImageResult.public_id,
                };
            }

            const variantsData = await Promise.all(
                values.variants.map(async (variant, index) => {
                    if (tempFiles.variants[index]) {
                        if (variant.image?.publicId) {
                            await deleteFile(variant.image.publicId);
                        }
                        const variantImageResult = await uploadFile(
                            tempFiles.variants[index]
                        );
                        return {
                            ...variant,
                            image: {
                                url: variantImageResult.secure_url,
                                publicId: variantImageResult.public_id,
                            },
                        };
                    }
                    return variant;
                })
            );

            const updateData = {
                ...data,
                ...values,
                mainImage: mainImageData,
                variants: variantsData,
            };

            await Promise.all(
                deletedVariants?.map((publicId) => deleteFile(publicId))
            );

            const result = await dispatch(updateProduct(updateData)).unwrap();
            if (result.success) {
                message.success(result.message);
                setOpen(false);
                setData(null);
                form.resetFields();
                setTempFiles({ mainImage: null, variants: {} });
                setPreviews({ mainImage: null, variants: {} });
                dispatch(
                    getProductAdmin({
                        page: pagination?.page,
                        pageSize: pagination?.pageSize,
                        search: "",
                    })
                );
                setDeletedVariants([]);
            }
        } catch (error) {
            message.error("Vui lòng kiểm tra lại thông tin");
        } finally {
            setSubmitting(false);
        }
    };

    const renderImageUpload = (fieldName, variantIndex = null) => {
        const isVariant = variantIndex !== null;
        const currentImage = isVariant
            ? form.getFieldValue("variants")?.[variantIndex]?.image
            : form.getFieldValue("mainImage");
        const previewImage = isVariant
            ? previews.variants[variantIndex]
            : previews.mainImage;

        return (
            <div className="border p-4 rounded">
                {currentImage?.url || previewImage ? (
                    <div className="relative">
                        <img
                            src={previewImage || currentImage.url}
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
                                    if (currentImage?.publicId) {
                                        setDeletedVariants((prev) => [
                                            ...prev,
                                            currentImage.publicId,
                                        ]);
                                    }

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
                                    const variants = form.getFieldValue("variants");
                                    variants[variantIndex].image = {};
                                    form.setFieldsValue({ variants });

                                    form
                                        .validateFields([["variants", variantIndex, "image"]])
                                        .catch(() => { });
                                } else {
                                    if (currentImage?.publicId) {
                                        setDeletedVariants((prev) => [
                                            ...prev,
                                            currentImage.publicId,
                                        ]);
                                    }
                                    setPreviews((prev) => ({ ...prev, mainImage: null }));
                                    setTempFiles((prev) => ({ ...prev, mainImage: null }));
                                    form.setFieldValue("mainImage", {});
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
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                )}
            </div>
        );
    };

    return (
        <Modal
            title="Cập nhật sản phẩm"
            open={open}
            onCancel={() => {
                setOpen(false);
                setData(null);
                form.resetFields();
                setTempFiles({ mainImage: null, variants: {} });
                setPreviews({ mainImage: null, variants: {} });
            }}
            width={width}
            footer={[
                <Button
                    key="cancel"
                    onClick={() => {
                        setOpen(false);
                        setData(null);
                        form.resetFields();
                        setTempFiles({ mainImage: null, variants: {} });
                        setPreviews({ mainImage: null, variants: {} });
                    }}
                >
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={submitting}
                >
                    Cập nhật
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                initialValues={{
                    name: data?.name,
                    category: data?.category?._id,
                    price: data?.price,
                    description: data?.description,
                    mainImage: data?.mainImage,
                    variants: data?.variants || [],
                }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Tên sản phẩm"
                            rules={[
                                { required: true, message: "Vui lòng nhập tên sản phẩm" },
                            ]}
                        >
                            <Input placeholder="Nhập tên sản phẩm" />
                        </Form.Item>

                        <Form.Item
                            name="category"
                            label="Danh mục"
                            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
                        >
                            <Select placeholder="Chọn danh mục">
                                {categories?.map((cat) => (
                                    <Select.Option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                        >
                            <InputNumber
                                className="w-full"
                                formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                placeholder="Nhập giá"
                            />
                        </Form.Item>

                        <Form.Item
                            name="mainImage"
                            label="Ảnh chính"
                            rules={[
                                { required: true, message: "Vui lòng tải lên ảnh chính" },
                            ]}
                        >
                            {renderImageUpload("mainImage")}
                        </Form.Item>
                    </Col>

                    <Col span={12}>
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
                                                    onClick={() => {
                                                        const variants = form.getFieldValue("variants");
                                                        const variant = variants[field.name];

                                                        if (variant?.image?.publicId) {
                                                            setDeletedVariants((prev) => [
                                                                ...prev,
                                                                variant.image.publicId,
                                                            ]);
                                                        }

                                                        remove(field.name);
                                                    }}
                                                />
                                            }
                                        >
                                            <Form.Item
                                                name={[field.name, "color"]}
                                                label="Màu sắc"
                                                rules={[
                                                    { required: true, message: "Vui lòng nhập màu" },
                                                ]}
                                            >
                                                <Input placeholder="Nhập màu" />
                                            </Form.Item>

                                            <Form.Item
                                                name={[field.name, "image"]}
                                                label="Ảnh biến thể"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Vui lòng tải lên ảnh biến thể",
                                                        validator: (_, value) => {
                                                            if (
                                                                !value?.url &&
                                                                !previews.variants[field.name]
                                                            ) {
                                                                return Promise.reject(
                                                                    "Vui lòng tải lên ảnh biến thể"
                                                                );
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    },
                                                ]}
                                            >
                                                {renderImageUpload("variants", field.name)}
                                            </Form.Item>
                                        </Card>
                                    ))}
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Thêm biến thể
                                    </Button>
                                </div>
                            )}
                        </Form.List>
                    </Col>
                </Row>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                >
                    <ReactQuill
                        theme="snow"
                        style={{ height: 400, marginBottom: "50px" }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalUpdateProduct;