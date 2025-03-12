import React, { useCallback, useEffect, useState } from "react";
import TableCategory from "../../components/Table/TableCategory";
import { FaPlusCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { getCategoryList } from "../../redux/category/category.thunk";
import ModalCategoryAction from "../../components/Modal/ModalCategoryAction";
import { Input } from "antd";
import CustomButton from "../../components/CustomButton";

const ManageCategory = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [paginate, setPaginate] = useState({
        page: 1,
        pageSize: 10,
        totalPage: 0,
        totalItems: 0,
    });

    const [filters, setFilters] = useState({
        name: "",
    });

    const { categories, pagination, isLoading } = useSelector(
        (state) => state.category
    );

    useEffect(() => {
        dispatch(getCategoryList({ ...paginate, ...filters }));
    }, [dispatch, paginate.page, paginate.pageSize, filters]);

    useEffect(() => {
        if (pagination) {
            setPaginate((prev) => ({
                ...prev,
                page: pagination.page,
                pageSize: pagination.pageSize,
                totalPage: pagination.totalPage,
                totalItems: pagination.totalItems,
            }));
        }
    }, [pagination]);

    const debouncedFilter = useCallback(
        debounce((name, value) => {
            setFilters((prev) => ({ ...prev, [name]: value }));
            setPaginate((prev) => ({ ...prev, page: 1 }));
        }, 300),
        []
    );

    const handleFilterChange = (name, value) => {
        debouncedFilter(name, value);
    };

    return (
        <div className="mt-4 mx-auto">
            <ModalCategoryAction
                {...{
                    open,
                    setOpen,
                    page: paginate.page,
                    pageSize: paginate.pageSize,
                }}
            />
            <div className="flex gap-2">
                <Input
                    className="flex-1"
                    type="text"
                    placeholder="Nhập tên danh mục..."
                    onChange={(e) => handleFilterChange("name", e.target.value)}
                />
                <CustomButton
                    variant="primary"
                    icon={<FaPlusCircle />}
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    Thêm danh mục
                </CustomButton>
            </div>
            <TableCategory
                categories={categories}
                isLoading={isLoading}
                page={paginate.page}
                pageSize={paginate.pageSize}
                totalItems={paginate.totalItems}
                setPaginate={setPaginate}
            />
        </div>
    );
};

export default ManageCategory;