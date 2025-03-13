import React, { useState, useEffect } from "react";
import { HomeOutlined, TagOutlined } from "@ant-design/icons";
import { Breadcrumb, Card, Skeleton, Empty, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetProductsByPromotionQuery } from "../../redux/product/product.query";
import ProductList from "../../components/ProductList";
import FilterOption from "./FilterOption";

const PromotionBanner = ({ sale = null }) => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="relative h-[400px] mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50">
            {/* Dynamic background */}
            <div
                className="absolute inset-0"
                style={{
                    transform: `translateY(${scrollPosition * 0.2}px)`,
                }}
            >
                {/* Animated shapes */}
                <div className="absolute top-[10%] left-[10%] w-32 h-32 bg-blue-200/70 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
                <div className="absolute top-[20%] right-[20%] w-32 h-32 bg-purple-200/70 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-[20%] left-[20%] w-32 h-32 bg-indigo-200/70 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center px-4">
                <div className="text-center space-y-8 max-w-3xl">
                    <div
                        className="space-y-4"
                        style={{
                            transform: `translateY(${-scrollPosition * 0.1}px)`,
                        }}
                    >
                        {/* Main heading with animated border */}
                        <div className="inline-block relative">
                            <h1 className="text-2xl uppercase md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 drop-shadow-lg animate-pulse">
                                Teelab đem đến khuyến mãi siêu hot
                            </h1>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 animate-bounce">
                            🔥 Hãy đặt hàng ngay!
                        </h2>
                    </div>

                    <div
                        className="flex flex-col items-center space-y-6"
                        style={{
                            transform: `translateY(${-scrollPosition * 0.15}px)`,
                        }}
                    >
                        <p className="text-2xl text-gray-700 font-medium tracking-wide">
                            Thời trang cho Gen Z
                        </p>
                        {sale && (
                            <div className="group transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center space-x-3 text-xl bg-white/90 px-8 py-4 rounded-full shadow-xl backdrop-blur-sm border border-violet-100">
                                    <TagOutlined className="text-violet-500 text-2xl animate-spin-slow" />
                                    <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                                        Giảm đến {sale}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-violet-200/30 to-transparent rounded-full transform -translate-y-1/2 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-indigo-200/30 to-transparent rounded-full transform translate-y-1/2 animate-pulse" />
            </div>
        </div>
    );
};

const Promotion = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        priceRange: [],
        categories: [],
        rating: "",
        colors: [],
        page: 1,
        pageSize: 12,
    });

    const { data, isLoading, error } = useGetProductsByPromotionQuery({
        ...filters,
    });

    if (error)
        return (
            <Empty
                className="py-8"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không tìm thấy sản phẩm phù hợp"
            />
        );

    if (isLoading) return <Skeleton active className="mt-10" />;

    const { products = [], pagination = {} } = data || {};

    const sale =
        products.find(
            (item) =>
                item.promotion && item.promotion.promotionInfo.type === "PERCENTAGE"
        )?.promotion?.promotionInfo?.value || null;

    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: 1,
        }));
    };

    const handlePageChange = (page, pageSize) => {
        setFilters((prev) => ({
            ...prev,
            page,
            pageSize,
        }));
    };

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb
                className="mb-6"
                items={[
                    {
                        title: (
                            <span
                                onClick={() => navigate("/")}
                                className="cursor-pointer hover:text-violet-600 flex items-center"
                            >
                                <HomeOutlined className="mr-1" /> Trang chủ
                            </span>
                        ),
                    },
                    {
                        title: "Khuyến mãi",
                    },
                ]}
            />

            <PromotionBanner {...{ sale }} />

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/4">
                    <Card className="shadow-sm sticky top-4" bordered={false}>
                        <FilterOption
                            currentFilters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </Card>
                </div>

                <div className="flex-1">
                    <Card bordered={false} className="shadow-sm min-h-screen">
                        <h3 className="text-lg font-medium flex items-center text-gray-800">
                            <TagOutlined className="mr-2 text-violet-500" />
                            Sản phẩm khuyến mãi
                        </h3>
                        {products.length > 0 ? (
                            <>
                                <ProductList
                                    products={products}
                                    loading={isLoading}
                                    isPagination={false}
                                />
                                {pagination && (
                                    <div className="mt-6 flex justify-center">
                                        <Pagination
                                            current={filters.page}
                                            pageSize={filters.pageSize}
                                            total={data.pagination.totalItems}
                                            onChange={handlePageChange}
                                            showSizeChanger={false}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <Empty
                                description="Không tìm thấy sản phẩm khuyến mãi"
                                className="py-12"
                            />
                        )}

                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Promotion;