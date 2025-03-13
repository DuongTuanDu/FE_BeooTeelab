import React, { useEffect } from "react";
import ProductList from "../../components/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { getProductHome } from "../../redux/product/product.thunk";
import { useNavigate } from "react-router-dom";
import Banner from "../../components/Banner";
import { BsStars } from "react-icons/bs";

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const { productHome, isLoading } = useSelector((state) => state.product);

    useEffect(() => {
        if (categories.length > 0) {
            const slugs = categories.map((item) => item.slug);
            dispatch(getProductHome(slugs.join(",")));
        }
    }, [dispatch, categories]);

    return (
        <>
            <Banner />
            <div className="py-4">
                <div className="text-3xl text-center font-bold mt-10">
                    Enjoy Your Youth!
                </div>
                <div className="text-center px-4 w-full flex items-center justify-center">
                    <div className="sm:w-full md:w-1/2 py-2">
                        Không chỉ là thời trang, TEELAB còn là "phòng thí nghiệm" của tuổi
                        trẻ - nơi nghiên cứu và cho ra đời nguồn năng lượng mang tên
                        "Youth". Chúng mình luôn muốn tạo nên những trải nghiệm vui vẻ, năng
                        động và trẻ trung.
                    </div>
                </div>
            </div>
            {productHome.length > 0 &&
                productHome.map((item, index) => {
                    if (item.products.length > 0) {
                        return (
                            <React.Fragment key={item.category._id || index}>
                                <ProductList
                                    isLoading={isLoading}
                                    title={item.category.name}
                                    products={item?.products}
                                    isPagination={false}
                                />
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => navigate(`/category/${item.category.slug}`)}
                                        className="px-8 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
                                    >
                                        <BsStars className="text-xl" />
                                        Xem thêm
                                    </button>
                                </div>
                            </React.Fragment>
                        );
                    }
                    return null;
                })}
        </>
    );
};

export default HomePage;