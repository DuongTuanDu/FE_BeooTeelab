import React, { useEffect, useState } from "react";
import { Image, message, Pagination, Spin, Table, Tooltip } from "antd";
import { FaEye } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import { MdOutlineDeleteOutline } from "react-icons/md";
import ModalConfirm from "../Modal/ModalConfirm";
import ModalUpdateProduct from "../Modal/ModalUpdateProduct";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteProduct,
    getProductAdmin,
} from "../../redux/product/product.thunk";
import { deleteFile } from "../../helpers/uploadCloudinary";

const TableProduct = ({ productList, data, loading, handleChangeData }) => {
    const dispatch = useDispatch();
    const [productItem, setProductItem] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const { error } = useSelector((state) => state.category);

    const handleDeleteProduct = async (productId) => {
        try {
            const result = await dispatch(deleteProduct(productId)).unwrap();
            if (result.success) {
                message.success(result.message);
                const deleteImagePromises = [];
                if (productItem.mainImage.publicId) {
                    deleteImagePromises.push(deleteFile(productItem.mainImage.publicId));
                }
                for (const variant of productItem.variants) {
                    if (variant.image.publicId) {
                        deleteImagePromises.push(deleteFile(variant.image.publicId));
                    }
                }
                await Promise.all(deleteImagePromises);
                dispatch(
                    getProductAdmin({
                        page: productList?.length > 5 ? data?.page : 1,
                        pageSize: data?.pageSize,
                        search: "",
                    })
                );
                setProductItem(null);
            }
        } catch (error) {
            console.error("Error", error);
            message.error("Lỗi khi xóa sản phẩm vui lòng thử lại");
        }
    };

    useEffect(() => {
        if (error && error?.messages) {
            message.error(error.message);
        }
    }, [error]);

    const columns = [
        {
            title: "STT",
            key: "stt",
            width: 60,
            render: (_, __, index) => (data.page - 1) * data.pageSize + index + 1,
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
            width: 200,
            render: (text) => (
                <Tooltip title={text}>
                    <div className="max-w-56 truncate">{text}</div>
                </Tooltip>
            ),
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
            width: 150,
            render: (text) => (
                <Tooltip title={text}>
                    <div className="max-w-56 truncate">{text}</div>
                </Tooltip>
            ),
        },
        {
            title: "Ảnh",
            dataIndex: "mainImage",
            key: "mainImage",
            width: 100,
            render: (text) => (
                <Image
                    src={text.url}
                    alt="Product"
                    width={80}
                    height={80}
                    style={{ objectFit: "cover" }}
                    placeholder={<Spin />}
                />
            ),
        },
        {
            title: "Phân loại",
            dataIndex: "variants",
            key: "variants",
            render: (variants) => (
                <div className="flex flex-wrap gap-2 max-w-[200px]">
                    {variants.map((item) => (
                        <Tooltip key={item._id} title={item.color}>
                            <Image
                                className="rounded-full"
                                src={item?.image?.url}
                                alt={item.color}
                                width={45}
                                height={45}
                                style={{ objectFit: "cover" }}
                                placeholder={<Spin />}
                            />
                        </Tooltip>
                    ))}
                </div>
            ),
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            width: 120,
            render: (text) => (
                <p className="font-medium text-[#820813]">
                    {new Intl.NumberFormat("vi-VN", {
                        currency: "VND",
                    }).format(text)}{" "}
                    đ
                </p>
            ),
        },
        {
            title: "Danh Mục",
            dataIndex: ["category"],
            key: "category",
            width: 150,
            render: (text) => <div className="font-medium">{text?.name}</div>,
        },
        {
            title: "Thao Tác",
            key: "action",
            width: 120,
            fixed: "right",
            render: (_, record) => (
                <div className="flex gap-2 items-center text-[#00246a]">
                    <Tooltip title="Xem">
                        <button className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors">
                            <FaEye />
                        </button>
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <button
                            onClick={() => {
                                setProductItem(record);
                                setOpenEdit(true);
                            }}
                            className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
                        >
                            <GrEdit />
                        </button>
                    </Tooltip>

                    <ModalConfirm
                        title="Xác nhận xóa sản phẩm"
                        description={record.name}
                        handleOk={handleDeleteProduct}
                        open={productItem?._id === record._id && !openEdit}
                        setOpen={(open) => !open && setProductItem(null)}
                        data={record}
                    >
                        <Tooltip title="Xóa">
                            <button
                                onClick={() => setProductItem(record)}
                                className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
                            >
                                <MdOutlineDeleteOutline />
                            </button>
                        </Tooltip>
                    </ModalConfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="py-2">
            <ModalUpdateProduct
                {...{
                    open: openEdit,
                    data: productItem,
                    setData: setProductItem,
                    setOpen: setOpenEdit,
                }}
            />
            <Table
                columns={columns}
                dataSource={productList}
                rowKey={(record) => record._id}
                pagination={false}
                loading={loading}
            />
            {productList?.length > 0 && (
                <div className="mt-4 flex justify-end">
                    <Pagination
                        current={data.page}
                        pageSize={data.pageSize}
                        total={data.totalItems}
                        onChange={(page) => handleChangeData("page", page)}
                        onShowSizeChange={(_, size) => handleChangeData("pageSize", size)}
                        showSizeChanger
                    />
                </div>
            )}
        </div>
    );
};

export default TableProduct;