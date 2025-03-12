import { message, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    createCategory,
    getCategoryList,
    updateCategory,
} from "../../redux/category/category.thunk";

const ModalCategoryAction = ({ open, setOpen, category, page, pageSize }) => {
    const [name, setName] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if (category) {
            setName(category.name);
        } else {
            setName("");
        }
    }, [category]);

    const handleSubmit = () => {
        if (category) {
            dispatch(
                updateCategory({
                    id: category._id,
                    data: { name },
                })
            ).then((res) => {
                if (res.payload.success) {
                    message.success(res.payload.message);
                    dispatch(getCategoryList({ page, pageSize }));
                    setOpen(false);
                }
            });
        } else {
            if (!name) {
                message.warning("Vui lòng nhập tên danh mục");
                return;
            }
            dispatch(
                createCategory({
                    name,
                })
            ).then((res) => {
                if (res.payload.success) {
                    message.success(res.payload.message);
                    dispatch(getCategoryList({ page, pageSize }));
                    setName("");
                    setOpen(false);
                }
            });
        }
    };

    return (
        <Modal
            open={open}
            title={
                <div className="text-lg md:text-2xl font-bold text-center">
                    {!category ? "Thêm mới danh mục" : "Cập nhật danh mục"}
                </div>
            }
            onOk={handleSubmit}
            onCancel={() => {
                setOpen(false);
                if (!category) {
                    setName("");
                }
            }}
            footer={[
                <button
                    key="cancel"
                    onClick={() => {
                        setOpen(false);
                        if (!category) {
                            setName("");
                        }
                    }}
                    className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 border px-6 py-2 rounded-full transition duration-300 ease-in-out"
                >
                    Hủy
                </button>,
                <button
                    key="create"
                    onClick={handleSubmit}
                    className="bg-slate-800 hover:bg-slate-500 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out mx-2"
                >
                    {!category ? "Thêm" : "Cập nhật"}
                </button>,
            ]}
            width={600}
        >
            <div className="mb-2">
                <div className="font-medium mb-2 text-base">Tên danh mục</div>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:border-transparent transition duration-300 ease-in-out`}
                />
            </div>
        </Modal>
    );
};

export default ModalCategoryAction;