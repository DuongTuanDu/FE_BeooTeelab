import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Badge,
    message,
    Popover,
    Layout,
    Menu,
    Input,
    Button,
    Drawer,
} from "antd";
import {
    ShoppingOutlined,
    SearchOutlined,
    MenuOutlined,
} from "@ant-design/icons";
import debounce from "lodash/debounce";
import { getAllCategory } from "../../redux/category/category.thunk";
import { getProductSearch } from "../../redux/product/product.thunk";
import { logoutCustomer } from "../../redux/auth/auth.slice";
import { formatPrice } from "../../helpers/formatPrice";
import logo from "../../resources/logo.png";

const { Header } = Layout;
const { Search } = Input;

const HeaderCustomer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const { isLoading, productSearchs } = useSelector((state) => state.product);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const products = useSelector((state) => state.cart?.cart?.products || []);

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);

    useEffect(() => {
        dispatch(getAllCategory());
    }, [dispatch]);

    const debouncedSearch = useCallback(
        debounce(async (searchTerm) => {
            if (searchTerm) {
                dispatch(getProductSearch(searchTerm));
            } else {
                setSearchResults([]);
            }
        }, 1000),
        [dispatch]
    );

    useEffect(() => {
        debouncedSearch(search);
        return () => debouncedSearch.cancel();
    }, [search, debouncedSearch]);

    useEffect(() => {
        if (productSearchs.length > 0) {
            setSearchResults(productSearchs);
        }
    }, [productSearchs]);

    const handleLogout = () => {
        dispatch(logoutCustomer());
        message.success("Đăng xuất thành công");
        navigate("/");
    };

    const searchContent = (
        <div className="w-64 md:w-96 max-h-[70vh] overflow-y-auto">
            {isLoading ? (
                <div className="p-4">Đang tìm kiếm...</div>
            ) : searchResults.length > 0 ? (
                searchResults?.map((product) => (
                    <div
                        key={product._id}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/detail/${product.slug}`);
                            setSearch("");
                            setSearchVisible(false);
                        }}
                        className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4 border-b"
                    >
                        <img
                            src={product.mainImage.url}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                        />
                        <div className="space-y-1">
                            <div className="font-medium line-clamp-2">{product.name}</div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-rose-600">
                                    {formatPrice(
                                        product?.isPromotion
                                            ? product?.promotion?.finalPrice
                                            : product?.price
                                    )}
                                    đ
                                </span>
                                {product?.isPromotion && (
                                    <span className="text-gray-400 line-through">
                                        {formatPrice(product?.price)}đ
                                    </span>
                                )}
                                {product?.promotion &&
                                    product?.promotion?.promotionInfo?.type ===
                                    "PERCENTAGE" && (
                                        <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded-full text-xs font-medium">
                                            {product?.promotion?.promotionInfo?.value} %
                                        </span>
                                    )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-4">Không tìm thấy kết quả</div>
            )}
        </div>
    );

    const menuItems = [
        {
            key: "home",
            label: "Trang Chủ",
            onClick: () => navigate("/"),
        },
        {
            key: "categories",
            label: "Danh Mục",
            children: categories?.map((item) => ({
                key: item.slug,
                label: item.name,
                onClick: () => navigate(`/category/${item.slug}`),
            })),
        },
        {
            key: "size",
            label: "Bảng Size",
            onClick: () => navigate("/size"),
        },
        {
            key: "promotions",
            label: "🎁 Khuyết mãi hot",
            onClick: () => navigate("/promotions"),
        },
        {
            key: "account",
            label: "Tài khoản",
            children: !isAuthenticated
                ? [
                    {
                        key: "login",
                        label: "Đăng nhập",
                        onClick: () => {
                            window.location.href = "/auth";
                        },
                    },
                    {
                        key: "register",
                        label: "Đăng ký",
                        onClick: () => {
                            window.location.href = "/auth?page=register";
                        },
                    },
                ]
                : [
                    {
                        key: "profile",
                        label: "Hồ sơ",
                        onClick: () => navigate("/account"),
                    },
                    {
                        key: "logout",
                        label: "Đăng xuất",
                        onClick: handleLogout,
                    },
                ],
        },
    ];

    return (
        <Header className="bg-white px-4 md:px-6 fixed w-full z-50 flex items-center justify-between shadow-md">
            {/* Logo */}
            <div className="flex items-center">
                <Button
                    type="text"
                    icon={<MenuOutlined />}
                    onClick={() => setDrawerVisible(true)}
                    className="mr-4 md:hidden"
                />
                <img
                    onClick={() => navigate("/")}
                    className="h-12 cursor-pointer"
                    src={logo}
                    alt="Logo"
                />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block flex-1 mx-8">
                <Menu mode="horizontal" items={menuItems} className="border-none" />
            </div>

            {/* Search and Cart */}
            <div className="flex items-center gap-4">
                <Popover
                    content={searchContent}
                    trigger="click"
                    open={searchVisible && search.length > 0}
                    onOpenChange={setSearchVisible}
                    placement="bottomRight"
                >
                    <Search
                        placeholder="Tìm kiếm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-xs hidden md:block"
                    />
                </Popover>
                <Button
                    type="text"
                    icon={<SearchOutlined />}
                    onClick={() => setSearchVisible(!searchVisible)}
                    className="md:hidden"
                />
                <Badge count={products.length} color="#b55947">
                    <Button
                        size="large"
                        type="text"
                        icon={<ShoppingOutlined size={24} className="text-[#b55947]" />}
                        onClick={() => navigate("/cart")}
                    />
                </Badge>
            </div>

            {/* Mobile Navigation Drawer */}
            <Drawer
                title="Menu"
                placement="left"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
            >
                <Menu mode="inline" items={menuItems} className="border-none" />
            </Drawer>

            {/* Mobile Search Popover */}
            <Popover
                content={searchContent}
                trigger="click"
                open={searchVisible}
                onOpenChange={setSearchVisible}
                placement="bottomRight"
                className="md:hidden"
            >
                <div
                    className={`absolute left-0 right-0 top-full bg-white p-4 border-t ${searchVisible ? "block" : "hidden"
                        }`}
                >
                    <Search
                        placeholder="Tìm kiếm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </Popover>
        </Header>
    );
};

export default HeaderCustomer;