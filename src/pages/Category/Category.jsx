// Category.jsx
import React, { useEffect, useState } from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Card, Skeleton, Empty, Pagination } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductsByCategoryQuery } from "../../redux/product/product.query";
import ProductList from "../../components/ProductList";
import FilterOption from "./FilterOption";

const CategoryBanner = ({ category = {} }) => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="relative h-[300px] mb-8 overflow-hidden rounded-xl">
            {/* Dynamic pattern background */}
            <div
                className="absolute inset-0 bg-[#fafafa]"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)`,
                    backgroundSize: "24px 24px",
                    transform: `translateY(${scrollPosition * 0.1}px)`,
                }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white" />

            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
                <div className="text-center px-4 space-y-6">
                    <div
                        className="overflow-hidden"
                        style={{
                            transform: `translateY(${-scrollPosition * 0.15}px)`,
                        }}
                    >
                        <h1 className="text-3xl uppercase mb-2 md:text-5xl font-bold text-gray-800 tracking-tight">
                            {category.name || "Bộ sưu tập"}
                        </h1>
                    </div>

                    <div
                        className="flex flex-col items-center space-y-4 transition-all duration-300"
                        style={{
                            transform: `translateY(${-scrollPosition * 0.2}px)`,
                        }}
                    >
                        <div className="w-24 h-1 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 rounded-full" />
                        <p className="text-lg text-gray-600 max-w-xl">
                            Khám phá các thiết kế độc đáo và phong cách mới nhất
                        </p>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                        <div className="w-20 h-20 md:w-32 md:h-32 border-2 border-gray-100 rounded-full animate-spin-slow opacity-50" />
                    </div>
                    <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                        <div className="w-20 h-20 md:w-32 md:h-32 border-2 border-gray-100 rounded-full animate-spin-slow opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Category = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [filters, setFilters] = useState({
        priceRange: [],
        categories: [],
        rating: "",
        colors: [],
        page: 1,
        pageSize: 12,
    });

    const { data, isLoading, error } = useGetProductsByCategoryQuery(
        {
            ...filters,
            slug,
        },
        { skip: !slug }
    );

    if (error) {
        return (
            <Empty
                className="py-8"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không tìm thấy sản phẩm phù hợp"
            />
        );
    }

    if (isLoading) return <Skeleton active className="mt-10" />;

    const { products = [], pagination = {} } = data || {};

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
                                className="cursor-pointer hover:text-blue-600 flex items-center"
                            >
                                <HomeOutlined className="mr-1" /> Trang chủ
                            </span>
                        ),
                    },
                    {
                        title: "Danh mục sản phẩm",
                    },
                ]}
            />

            <CategoryBanner category={products[0]?.category || {}} />

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Filter Sidebar */}
                <div className="w-full lg:w-1/4">
                    <Card className="sticky top-4" bordered={false}>
                        <FilterOption
                            currentFilters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </Card>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    <Card bordered={false} className="min-h-screen">
                        <h3 className="text-lg font-medium">Danh sách sản phẩm</h3>
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
                                description="Không tìm thấy sản phẩm phù hợp"
                                className="py-12"
                            />
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Category;