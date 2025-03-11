import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderList } from "../../redux/order/order.thunk";
import { Input, Select, DatePicker, Space, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/vi_VN";
import TableOrder from "../../components/Table/TableOrder";
import debounce from "lodash/debounce";

const { RangePicker } = DatePicker;

const ManageOrder = () => {
    const dispatch = useDispatch();
    const { orders, pagination, isLoading } = useSelector((state) => state.order);

    const [paginate, setPaginate] = useState({
        page: 1,
        pageSize: 10,
        totalPage: 0,
        totalItems: 0,
    });

    const [filters, setFilters] = useState({
        customerName: "",
        status: "",
        fromDate: "",
        toDate: "",
        paymentMethod: "",
    });

    useEffect(() => {
        dispatch(getOrderList({ ...paginate, ...filters }));
    }, [dispatch, paginate.page, paginate.pageSize, filters]);

    useEffect(() => {
        if (pagination) {
            setPaginate((prev) => ({
                ...prev,
                page: pagination.page,
                pageSize: pagination.pageSize,
                totalPage: pagination.totalPage,
                totalItems: pagination.totalUsers,
            }));
        }
    }, [pagination]);

    const debouncedFilter = useCallback(
        debounce((name, value) => {
            setFilters((prev) => ({ ...prev, [name]: value }));
            setPaginate((prev) => ({ ...prev, page: 1 }));
        }, 1000),
        []
    );

    const handleFilterChange = (name, value) => {
        debouncedFilter(name, value);
    };

    const handleDateRangeChange = (dates, dateStrings) => {
        setFilters((prev) => ({
            ...prev,
            fromDate: dateStrings[0],
            toDate: dateStrings[1],
        }));
        setPaginate((prev) => ({ ...prev, page: 1 }));
    };

    const handleReset = () => {
        setFilters({
            customerName: "",
            status: "",
            fromDate: "",
            toDate: "",
            paymentMethod: "",
        });
        setPaginate((prev) => ({ ...prev, page: 1 }));
    };

    return (
        <div className="mt-4 mx-auto">
            <Space direction="vertical" size="middle" style={{ display: "flex" }}>
                <Space wrap>
                    <Input
                        placeholder="Tên khách hàng"
                        allowClear
                        onChange={(e) => handleFilterChange("customerName", e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Select
                        placeholder="Trạng thái"
                        style={{ width: 150 }}
                        onChange={(value) => handleFilterChange("status", value)}
                        allowClear
                    >
                        <Select.Option value="pending">Chờ xử lý</Select.Option>
                        <Select.Option value="processing">Đang xử lý</Select.Option>
                        <Select.Option value="shipping">Đang giao hàng</Select.Option>
                        <Select.Option value="delivered">Đã giao hàng</Select.Option>
                        <Select.Option value="cancelled">Đã hủy</Select.Option>
                    </Select>
                    <RangePicker locale={locale} onChange={handleDateRangeChange} />
                    <Select
                        placeholder="Phương thức thanh toán"
                        style={{ width: 200 }}
                        onChange={(value) => handleFilterChange("paymentMethod", value)}
                        allowClear
                    >
                        <Select.Option value="COD">COD</Select.Option>
                        <Select.Option value="STRIPE">STRIPE</Select.Option>
                        <Select.Option value="VNPAY">VNPAY</Select.Option>
                    </Select>
                    <Button
                        icon={<SearchOutlined />}
                        onClick={() => dispatch(getOrderList({ ...paginate, ...filters }))}
                    >
                        Tìm kiếm
                    </Button>
                    <Button onClick={handleReset}>Đặt lại</Button>
                </Space>
                <TableOrder
                    orders={orders}
                    isLoading={isLoading}
                    page={paginate.page}
                    pageSize={paginate.pageSize}
                    totalItems={paginate.totalItems}
                    setPaginate={setPaginate}
                    customerName={filters.customerName}
                    status={filters.status}
                    fromDate={filters.fromDate}
                    toDate={filters.toDate}
                    paymentMethod={filters.paymentMethod}
                />
            </Space>
        </div>
    );
};

export default ManageOrder;