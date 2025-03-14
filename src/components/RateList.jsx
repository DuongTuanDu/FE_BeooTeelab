import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Rate,
  Spin,
  Empty,
  Pagination,
  Row,
  Col,
  Button,
  Tag,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getReviewProduct } from "../redux/review/review.thunk";
import { formatDateReview } from "../helpers/formatDate";
import {
  CameraOutlined,
  CommentOutlined,
  HeartOutlined,
} from "@ant-design/icons";

const RateList = ({ slug }) => {
  const dispatch = useDispatch();
  const { reviews, pagination, isLoading, averageRating, rateDistribution } =
    useSelector((state) => state.review);
  const [reviewFilter, setReviewFilter] = useState({
    rate: "",
    hasImage: "",
    hasComment: "",
  });
  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 9,
    totalPage: 0,
    totalItems: 0,
  });
  const [hasNoReviews, setHasNoReviews] = useState(false);
  const apiCallCount = useRef(0);

  const fetchReviews = useCallback(() => {
    if (slug && !hasNoReviews) {
      apiCallCount.current += 1;
      dispatch(
        getReviewProduct({
          slug,
          page: paginate.page,
          pageSize: paginate.pageSize,
          ...reviewFilter,
        })
      )
        .unwrap()
        .then((result) => {
          if (
            result.reviews.length === 0 &&
            result.pagination.totalItems === 0
          ) {
            setHasNoReviews(true);
          } else {
            setHasNoReviews(false);
          }
        });
    }
  }, [
    slug,
    paginate.page,
    paginate.pageSize,
    reviewFilter,
    dispatch,
    hasNoReviews,
  ]);

  useEffect(() => {
    if (apiCallCount.current < 2) {
      fetchReviews();
    }
  }, [fetchReviews]);

  useEffect(() => {
    if (pagination) {
      setPaginate((prev) => ({
        ...prev,
        page: pagination?.page,
        pageSize: pagination?.pageSize,
        totalPage: pagination?.totalPage,
        totalItems: pagination?.totalItems,
      }));
    }
  }, [pagination]);

  const createIcon = (index, rate) => {
    const fillColor = rate >= index ? "#cd3f34" : "#597e6a";

    return (
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        key={index}
      >
        <path
          d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
          fill={fillColor}
        ></path>
      </svg>
    );
  };

  const createAverageRate = (index, rate) => {
    const fullFill = rate >= index;
    const partialFill = rate > index - 1 && rate < index;
    const fillPercentage = partialFill ? (rate % 1) * 100 : 0;

    return (
      <svg
        width="30px"
        height="30px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        key={index}
      >
        <defs>
          <linearGradient
            id={`grad-${index}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset={`${fillPercentage}%`} stopColor="#cd3f34" />
            <stop offset={`${fillPercentage}%`} stopColor="#597e6a" />
          </linearGradient>
        </defs>

        <path
          d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
          fill={
            fullFill
              ? "#cd3f34"
              : partialFill
              ? `url(#grad-${index})`
              : "#597e6a"
          }
        ></path>
      </svg>
    );
  };

  const handleFilterChange = (key, value) => {
    setReviewFilter((prev) => ({ ...prev, [key]: value }));
    setPaginate((prev) => ({ ...prev, page: 1 }));
    setHasNoReviews(false);
    apiCallCount.current = 0;
  };

  const renderOverview = () => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        Đánh giá sản phẩm
      </h2>

      <div className="flex items-center justify-between flex-wrap sm:gap-2">
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold text-red-600">
            {parseFloat(averageRating || 0).toFixed(1)}
          </div>
          <div>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((_, index) =>
                createAverageRate(index + 1, parseFloat(averageRating || 0))
              )}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {pagination?.totalItems || 0} đánh giá
            </div>
          </div>
        </div>
        <div className="flex gap-2 lg:gap-4 mt-4 sm:mt-0 flex-wrap">
          <Button
            type={reviewFilter.rate === "" ? "primary" : "default"}
            onClick={() => handleFilterChange("rate", "")}
          >
            Tất cả ({pagination?.totalItems || 0})
          </Button>
          {[5, 4, 3, 2, 1].map((star) => (
            <Button
              key={star}
              type={
                reviewFilter.rate === star.toString() ? "primary" : "default"
              }
              onClick={() => handleFilterChange("rate", star.toString())}
            >
              {star} <HeartOutlined />({rateDistribution[star] || 0})
            </Button>
          ))}
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button
            type={reviewFilter.hasImage === "true" ? "primary" : "default"}
            onClick={() =>
              handleFilterChange(
                "hasImage",
                reviewFilter.hasImage === "true" ? "" : "true"
              )
            }
          >
            <CameraOutlined /> Có hình
          </Button>
          <Button
            type={reviewFilter.hasComment === "true" ? "primary" : "default"}
            onClick={() =>
              handleFilterChange(
                "hasComment",
                reviewFilter.hasComment === "true" ? "" : "true"
              )
            }
          >
            <CommentOutlined /> Có bình luận
          </Button>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      );
    }

    if (!reviews || reviews.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Empty description="Không có đánh giá nào phù hợp với bộ lọc" />
        </div>
      );
    }

    return (
      <>
        <Row gutter={[24, 24]}>
          {reviews?.map((review) => (
            <Col key={review._id} xs={24} sm={24} md={12} lg={8}>
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    src={review.user.avatar.url}
                    alt={review.user.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {review.user.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {formatDateReview(review.createdAt)}
                    </p>
                  </div>
                </div>

                <Rate
                  disabled
                  defaultValue={review.rate}
                  character={({ index }) =>
                    createIcon(index + 1, parseInt(review.rate))
                  }
                />

                {review.comment && (
                  <p className="mt-3 text-gray-700 italic">
                    "{review.comment}"
                  </p>
                )}

                {review.images.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {review.images.map((image) => (
                      <Image
                        key={image.publicId}
                        src={image.url}
                        alt="Review"
                        width={80}
                        height={80}
                        className="object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  {review.images.length > 0 && (
                    <Tag icon={<CameraOutlined />} color="blue">
                      Có hình ảnh
                    </Tag>
                  )}
                  {review.comment && (
                    <Tag icon={<CommentOutlined />} color="green">
                      Có bình luận
                    </Tag>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {reviews.length > 0 && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={paginate.page}
              pageSize={paginate.pageSize}
              total={paginate.totalItems}
              onChange={(page, pageSize) =>
                setPaginate((prev) => ({ ...prev, page, pageSize }))
              }
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} của ${total} đánh giá`
              }
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
      {renderOverview()}
      <div className="min-h-[300px]">{renderReviews()}</div>
    </div>
  );
};

export default RateList;