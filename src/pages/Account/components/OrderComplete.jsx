import React, { useEffect, useState } from "react";
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
import { CheckCircleOutlined, StarOutlined } from "@ant-design/icons";
import { formatPrice } from "../../../helpers/formatPrice";
import useScreen from "../../../hook/useScreen";
import ModalRate from "../../../components/Modal/ModalRate";

const { Title, Text } = Typography;

const OrderComplete = ({
  isLoading = false,
  orders = [],
  page = 1,
  pageSize = 10,
  totalPage = 0,
  totalItems = 0,
  handleChangePaginate,
}) => {
  const { isMobile } = useScreen();
  const [rate, setRate] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [product, setProduct] = useState({
    _id: "",
    name: "",
    image: "",
  });
  const [open, setOpen] = useState(false);

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

  const handleClickReview = ({ item, order }) => {
    setOrderId(order._id);
    setProduct((prev) => ({
      ...prev,
      _id: item.productId,
      name: item.name,
      image: item.image,
    }));
    setOpen(true);
  };

  return (
    <>
      <ModalRate
        {...{
          product,
          order: orderId,
          open,
          setOpen,
          rate,
          setRate,
          setHoverValue,
          hoverValue,
        }}
      />
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
                      <div className="flex justify-between items-center">
                        <Text className="text-red-600 font-semibold">
                          {formatPrice(item.price)}đ
                        </Text>
                        <Button
                          disabled={item.isReviewed}
                          onClick={() => handleClickReview({ item, order })}
                          icon={<StarOutlined />}
                          size="large"
                          className="bg-black text-white"
                        >
                          {item.isReviewed ? "Đã đánh giá" : "Đánh giá"}
                        </Button>
                      </div>
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
                color="success"
                icon={<CheckCircleOutlined />}
                className="self-start text-xs sm:text-sm"
              >
                Giao hàng thành công
              </Tag>
              <div className="flex justify-between items-center w-full">
                <Text strong className="text-sm sm:text-base">
                  Tổng tiền:{" "}
                  <span className="text-red-600">
                    {formatPrice(order.totalAmount)}đ
                  </span>
                </Text>
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

export default OrderComplete;
