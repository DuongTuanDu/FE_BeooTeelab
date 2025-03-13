import React from "react";
import {
  Card,
  Typography,
  Tag,
  Button,
  Image,
  Divider,
  Spin,
  Empty,
  Pagination,
} from "antd";
import { CloseCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { formatPrice } from "../../../helpers/formatPrice";
import useScreen from "../../../hook/useScreen";

const { Title, Text } = Typography;

const OrderCancel = ({
  isLoading = false,
  orders = [],
  page = 1,
  pageSize = 10,
  totalPage = 0,
  totalItems = 0,
  handleChangePaginate,
}) => {
  const { isMobile } = useScreen();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Empty description="Không có đơn hàng nào" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {orders?.map((order, idx) => (
          <Card key={`order-${idx}`} className="shadow-md p-2 sm:p-4">
            {order?.products?.map((item, index) => (
              <div key={`item-order-${index}`} className="mb-4">
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <Image
                    width={isMobile ? 180 : 100}
                    height={isMobile ? 120 : 100}
                    src={item.image}
                    alt={item.name}
                    className="object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <Title
                      level={5}
                      className="text-sm sm:text-base mb-1 line-clamp-2"
                    >
                      {item.name}
                    </Title>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <div>
                        <Tag color="blue" className="mr-1">
                          {item.size}
                        </Tag>
                        <Tag color="purple">{item.color}</Tag>
                      </div>
                      <Text className="block">Số lượng: {item.quantity}</Text>
                      <Text className="block text-red-600 font-semibold">
                        {formatPrice(item.price)}đ
                      </Text>
                    </div>
                  </div>
                </div>
                {index < order?.products?.length - 1 && (
                  <Divider className="my-2" />
                )}
              </div>
            ))}

            <Divider className="my-2" />

            <div className="flex flex-col space-y-2">
              <Tag
                color="red"
                icon={<CloseCircleOutlined />}
                className="self-start text-xs sm:text-sm"
              >
                Đơn hàng đã hủy
              </Tag>
              <div className="flex justify-between items-center w-full">
                <Text strong className="text-sm sm:text-base">
                  Tổng tiền:{" "}
                  <span className="text-red-600">
                    {formatPrice(order.totalAmount)}đ
                  </span>
                </Text>
                <Button
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Thêm giỏ hàng
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {orders.length > 0 && totalItems > pageSize && (
        <div className="flex justify-end mt-4">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={handleChangePaginate}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn hàng`
            }
          />
        </div>
      )}
    </>
  );
};

export default OrderCancel;
