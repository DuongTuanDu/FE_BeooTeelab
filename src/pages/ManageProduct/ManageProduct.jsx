import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPlusCircle } from "react-icons/fa";
import TableProduct from "../../components/Table/TableProduct";
import { getProductAdmin } from "../../redux/product/product.thunk";
import { debounce } from "lodash";
import { Button, Input } from "antd";

const ManageProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, products, pagination } = useSelector(
        (state) => state.product
    );
    const [data, setData] = useState({
        page: 1,
        totalPage: 0,
        pageSize: 5,
        search: "",
        totalItems: 0,
    });

    const fetchProducts = () => {
        const { page = 1, pageSize, search } = data;
        dispatch(getProductAdmin({ page, pageSize, search }));
    };

    useEffect(() => {
        fetchProducts();
    }, [data.page, data.pageSize, data.search]);

    useEffect(() => {
        if (pagination) {
            setData((prev) => ({
                ...prev,
                page: pagination.page,
                totalPage: pagination.totalPage,
                totalItems: pagination.totalItems,
            }));
        }
    }, [pagination]);

    const handleChangeData = (key, value) => {
        setData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const debouncedSearch = debounce((value) => {
        handleChangeData("search", value);
        handleChangeData("page", 1);
    }, 2000);

    return (
        <div className="mt-4 mx-auto">
            <div className="flex gap-4 mb-6">
                <Input
                    className="flex-1"
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    onChange={(e) => debouncedSearch(e.target.value)}
                />
                <Button
                    color="blue"
                    onClick={() => navigate("/admin/products/create")}
                    className="flex items-center gap-2"
                >
                    <div className="flex gap-2 items-center">
                        <FaPlusCircle /> <span>Thêm sản phẩm</span>
                    </div>
                </Button>
            </div>
            <TableProduct
                productList={products}
                data={data}
                loading={isLoading}
                handleChangeData={handleChangeData}
            />
        </div>
    );
};

export default ManageProduct;