import React, { useEffect, useState } from "react";
import { useGetAllPromotionQuery } from "../../redux/promotion/promotion.query";
import {
    Table,
    Tag,
    Space,
    Button,
    Tooltip,
    Card,
    Popconfirm,
    Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { GrEdit } from "react-icons/gr";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import UpdatePromotion from "./UpdatePromotion";
import { useDispatch } from "react-redux";
import { updatePromotionAction } from "../../redux/promotion/promotion.thunk";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale("vi");

const ManagePromotion = () => {
    const dispatch = useDispatch();
    const [promotions, setPromotions] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
    });
    const [open, setOpen] = useState(false);
    const [promotion, setPromotion] = useState(null);

    const { data, isLoading, refetch } = useGetAllPromotionQuery({
        page: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
    });

    useEffect(() => {
        if (data) {
            setPromotions(data.promotions);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: data.pagination.totalItems,
                },
            });
        }
    }, [data]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    const formatValue = (type, value) => {
        if (type === "PERCENTAGE") {
            return `${value}%`;
        }
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    const getStatusTag = (status) => {
        let color = "";
        let text = "";
        switch (status) {
            case "ACTIVE":
                color = "success";
                text = "Đang hoạt động";
                break;
            case "INACTIVE":
                color = "default";
                text = "Chưa kích hoạt";
                break;
            case "EXPIRED":
                color = "error";
                text = "Đã hết hạn";
                break;
            default:
                color = "default";
                text = status;
        }
        return <Tag color={color}>{text}</Tag>;
    };

    const handleChangeStatus = async (value, promotion) => {
        await dispatch(
            updatePromotionAction({ id: promotion?._id, data: { status: value } })
        ).unwrap();
        refetch();
    };

    const columns = [
        {
            title: "Tên khuyến mãi",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div>
                    <div className="font-medium">{text}</div>
                    <div className="text-gray-500 text-sm">{record.description}</div>
                </div>
            ),
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            render: (type) =>
                type === "PERCENTAGE" ? "Phần trăm" : "Số tiền cố định",
        },
        {
            title: "Giá trị",
            dataIndex: "value",
            key: "value",
            render: (value, record) => formatValue(record.type, value),
        },
        {
            title: "Thời gian",
            key: "time",
            render: (_, record) => (
                <div>
                    <div>
                        Bắt đầu: {dayjs(record.startDate).format("DD/MM/YYYY HH:mm")}
                    </div>
                    <div>
                        Kết thúc: {dayjs(record.endDate).format("DD/MM/YYYY HH:mm")}
                    </div>
                </div>
            ),
        },
        {
            title: "Trạng thái",
            key: "statusAction",
            render: (record) => (
                <Select
                    onChange={(value) => handleChangeStatus(value, record)}
                    value={record.status}
                    style={{ width: 180 }}
                    options={[
                        {
                            value: "ACTIVE",
                            label: "Kích hoạt",
                        },
                        {
                            value: "INACTIVE",
                            label: "Dừng hoạt động",
                        },
                        {
                            value: "EXPIRED",
                            label: "Hết hạn",
                            disabled: true,
                        },
                    ]}
                />
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => getStatusTag(status),
        },
        {
            title: "Số lần sử dụng",
            key: "usage",
            render: (_, record) => (
                <span>
                    {record.usedCount}/{record.usageLimit || "∞"}
                </span>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Sửa">
                        <button
                            onClick={() => {
                                setPromotion(record);
                                setOpen(true);
                            }}
                            className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
                        >
                            <GrEdit />
                        </button>
                    </Tooltip>
                    <Popconfirm
                        placement="topLeft"
                        title="Xác nhận xóa khuyến mãi"
                        onConfirm={() => { }}
                        okButtonProps={{
                            loading: isLoading,
                        }}
                        destroyTooltipOnHide={true}
                    >
                        <Tooltip title="Xóa">
                            <button
                                onClick={() => { }}
                                className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
                            >
                                <MdOutlineDeleteOutline />
                            </button>
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card className="mt-4">
            <UpdatePromotion
                {...{
                    open,
                    promotion,
                    onClose: () => {
                        setOpen(false);
                        setPromotion(null);
                    },
                    refetch,
                }}
            />
            <div className="mb-4 flex justify-between items-center">
                <Link to={"/admin/promotions/create"}>
                    <Button type="primary" icon={<PlusOutlined />}>
                        Thêm mới
                    </Button>
                </Link>
            </div>
            <Table
                columns={columns}
                dataSource={promotions}
                rowKey="_id"
                pagination={tableParams.pagination}
                loading={isLoading}
                onChange={handleTableChange}
                scroll={{ x: 1000 }}
            />
        </Card>
    );
};

export default ManagePromotion;