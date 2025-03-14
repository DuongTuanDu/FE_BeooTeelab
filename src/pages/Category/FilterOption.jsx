import React from "react";
import { Skeleton, Empty } from "antd";
import { useGetFilterOptionsQuery } from "../../redux/product/product.query";
import { formatPrice } from "../../helpers/formatPrice";
import { FiStar } from "react-icons/fi";

const FilterOption = ({ currentFilters, onFilterChange }) => {
    const { data, isLoading } = useGetFilterOptionsQuery();

    if (isLoading) return <Skeleton active />;
    if (!data) return <Empty description="Không có tùy chọn lọc" />;

    const handleFilterChange = (type, value) => {
        onFilterChange({
            [type]: value,
        });
    };

    const filterSections = [
        {
            title: "Khoảng giá",
            content: (
                <div className="space-y-3">
                    {data.priceRanges.map((range) => (
                        <div
                            key={`${range.min}-${range.max}`}
                            onClick={() =>
                                handleFilterChange("priceRange", [range.min, range.max])
                            }
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all
                ${currentFilters.priceRange?.[0] === range.min
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-blue-300"
                                }`}
                        >
                            <span className="text-sm font-medium">
                                {formatPrice(range.min)} - {formatPrice(range.max)}đ
                            </span>
                            <div
                                className={`w-4 h-4 rounded-full border-2 transition-all
                ${currentFilters.priceRange?.[0] === range.min
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-300"
                                    }`}
                            />
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: "Đánh giá",
            content: (
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div
                            key={rating}
                            onClick={() => handleFilterChange("rating", rating)}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all
                ${currentFilters.rating === rating
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-blue-300"
                                }`}
                        >
                            <div className="flex items-center space-x-1">
                                {[...Array(rating)].map((_, i) => (
                                    <FiStar
                                        key={i}
                                        className={`${currentFilters.rating === rating
                                                ? "text-blue-500 fill-blue-500"
                                                : "text-yellow-400 fill-yellow-400"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: "Danh mục",
            content: (
                <div className="space-y-2">
                    {data.categories.map((category) => (
                        <div
                            key={category._id}
                            onClick={() =>
                                handleFilterChange(
                                    "categories",
                                    currentFilters.categories?.includes(category._id)
                                        ? currentFilters.categories.filter(
                                            (c) => c !== category._id
                                        )
                                        : [...(currentFilters.categories || []), category._id]
                                )
                            }
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all
                ${currentFilters.categories?.includes(category._id)
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-blue-300"
                                }`}
                        >
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="text-xs text-gray-500">
                                ({category.productCount})
                            </span>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: "Màu sắc",
            content: (
                <div className="flex flex-wrap gap-2">
                    {data.colors.map((color) => (
                        <div
                            key={color}
                            onClick={() =>
                                handleFilterChange(
                                    "colors",
                                    currentFilters.colors?.includes(color)
                                        ? currentFilters.colors.filter((c) => c !== color)
                                        : [...(currentFilters.colors || []), color]
                                )
                            }
                            className={`px-4 py-2 rounded-full cursor-pointer border transition-all
                ${currentFilters.colors?.includes(color)
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "border-gray-200 hover:border-blue-300"
                                }`}
                        >
                            <span className="text-sm font-medium">{color}</span>
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    const hasActiveFilters = Object.keys(currentFilters).some((key) =>
        Array.isArray(currentFilters[key])
            ? currentFilters[key].length > 0
            : currentFilters[key] !== null && currentFilters[key] !== ""
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Bộ lọc</h3>
                {hasActiveFilters && (
                    <button
                        onClick={() =>
                            onFilterChange({
                                categories: [],
                                priceRange: [],
                                rating: "",
                                colors: [],
                            })
                        }
                        className="text-sm text-blue-500 hover:text-blue-600"
                    >
                        Xóa tất cả
                    </button>
                )}
            </div>

            {filterSections.map((section, index) => (
                <div key={index}>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-base mb-2">{section.title}</span>
                    </div>
                    {section.content}
                </div>
            ))}
        </div>
    );
};

export default FilterOption;