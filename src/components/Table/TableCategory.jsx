import React, { useState } from "react";
import { message, Pagination, Popconfirm, Table, Tooltip } from "antd";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import ModalCategoryAction from "../Modal/ModalCategoryAction";
import { useDispatch } from "react-redux";
import {
    deleteCategory,
    getCategoryList,
} from "../../redux/category/category.thunk";

const TableCategory = ({
    categories = [],
    isLoading = false,
    page,
    pageSize,
    totalItems,
    setPaginate,
}) => {
    const [open, setOpen] = useState(false);
    const [categoryItem, setCategoryItem] = useState(null);
    const dispatch = useDispatch();

    const removeCategory = (id) => {
        dispatch(deleteCategory(id)).then((res) => {
            if (res.payload.success) {
                message.success(res.payload.message);
                dispatch(dispatch(getCategoryList({ page, pageSize })));
            }
        });
    };

    const columns = [
        {
            title: "STT",
            key: "stt",
            render: (text, record, index) => {
                const displayIndex = (page - 1) * pageSize + index + 1;
                return <p>{displayIndex}</p>;
            },
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
        },
        {
            title: "Thao Tác",
            key: "action",
            width: 120,
            fixed: "right",
            render: (_, record) => (
                <div className="flex gap-2 items-center text-[#00246a]">
                    <Tooltip title="Sửa">
                        <button
                            onClick={() => {
                                setCategoryItem(record);
                                setOpen(true);
                            }}
                            className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
                        >
                            <GrEdit />
                        </button>
                    </Tooltip>

                    <Popconfirm
                        className="max-w-40"
                        placement="topLeft"
                        title={"Xác nhận xóa thông tin danh mục"}
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => removeCategory(record._id)}
                        destroyTooltipOnHide={true}
                    >
                        <Tooltip title="Xóa">
                            <button className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors">
                                <MdOutlineDeleteOutline />
                            </button>
                        </Tooltip>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const handleChangePage = (key, value) => {
        setPaginate((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div className="py-2">
            <ModalCategoryAction
                {...{
                    open,
                    setOpen,
                    setCategory: setCategoryItem,
                    category: categoryItem,
                    page,
                    pageSize,
                }}
            />
            <Table
                scroll={{ x: true }}
                loading={isLoading}
                columns={columns}
                dataSource={categories}
                pagination={false}
                rowKey={(record) => record._id}
            />
            {categories?.length > 0 && (
                <div className="mt-4 flex justify-end">
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={totalItems}
                        onChange={(page) => handleChangePage("page", page)}
                        onShowSizeChange={(_, size) => handleChangePage("pageSize", size)}
                        showSizeChanger
                    />
                </div>
            )}
        </div>
    );
};

export default TableCategory;