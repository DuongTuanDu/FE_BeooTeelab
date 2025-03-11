import { Card } from "antd";
import React, { useEffect } from "react";
import StatisticalProductSelling from "../../components/StatisticalProductSelling";
import StatisicalRevenue from "../../components/StatisicalRevenue";
import { useDispatch, useSelector } from "react-redux";
import { getStatisticalAdmin } from "../../redux/statistical/statistical.thunk";
import { formatPrice } from "../../helpers/formatPrice";

const DashBoard = () => {
    const dispatch = useDispatch();
    const {
        isLoading,
        totalOrders,
        totalProducts,
        totalCustomers,
        totalOrderAmount,
        monthlyRevenue,
        topSellingProducts,
    } = useSelector((state) => state.statistical);

    useEffect(() => {
        dispatch(getStatisticalAdmin());
    }, []);

    return (
        <div className="py-6">
            <div className="flex flex-wrap gap-2 xl:flex-nowrap">
                <div className="w-full xl:flex-1">
                    <Card className="mb-2 w-full" bordered={false}>
                        <div className="text-base">
                            <div className="font-bold flex justify-between">
                                <div>Tổng đơn hàng</div>
                                <div className="bg-green-400 rounded">
                                    <svg
                                        className="px-0.5"
                                        width={"25px"}
                                        height={"25px"}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g
                                            id="SVGRepo_tracerCarrier"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        ></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <rect
                                                x="5"
                                                y="4"
                                                width="14"
                                                height="17"
                                                rx="2"
                                                stroke="#ffffff"
                                                strokeWidth="2"
                                            ></rect>
                                            <path
                                                d="M9 9H15"
                                                stroke="#ffffff"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            ></path>
                                            <path
                                                d="M9 13H15"
                                                stroke="#ffffff"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            ></path>
                                            <path
                                                d="M9 17H13"
                                                stroke="#ffffff"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            ></path>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <div className="font-bold text-xl pt-1 text-[#35c28d]">
                                {totalOrders}
                            </div>
                        </div>
                    </Card>
                    <Card className="w-full mb-2" bordered={false}>
                        <div className="text-base">
                            <div className="font-bold flex justify-between">
                                <div>Tổng tiền đơn hàng</div>
                                <div className="bg-sky-400 rounded">
                                    <svg
                                        className="px-0.5"
                                        fill="#ffffff"
                                        height="25px"
                                        width="25px"
                                        version="1.1"
                                        id="Capa_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        viewBox="0 0 490 490"
                                        xmlSpace="preserve"
                                        stroke="#ffffff"
                                    >
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g
                                            id="SVGRepo_tracerCarrier"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        ></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <g>
                                                <g>
                                                    <g>
                                                        <path d="M344.4,111.3c20.8-25,33.3-57.2,33.3-90.5c0-11.4-9.4-20.8-20.8-20.8H133.2c-11.4,0-20.8,9.4-20.8,20.8 c0,33.3,11.4,65.5,33.3,90.5C77,151.9,33.3,233,33.3,322.5C33.3,472.3,154,490,244.5,490s211.2-17.7,212.2-167.5 C456.7,234.1,413,152.9,344.4,111.3z M244.5,448.4c-120.7,0-170.6-36.4-170.6-125.9c0-79.1,40.6-150.8,104-182.1 c8.3-4.2,14.6-12.5,15.6-21.8c1-9.4-2.1-19.8-9.4-26c-14.6-13.5-25-31.2-29.1-51h178.9c-4.2,19.8-14.6,37.5-29.1,51 c-7.3,6.2-10.4,16.6-9.4,26c1,9.4,7.3,17.7,15.6,21.8c63.5,31.2,104,103,104,182.1C415.1,412,365.2,448.4,244.5,448.4z"></path>{" "}
                                                    </g>
                                                    <path d="M297.4,319.5c0-28.9-23.5-52.4-52.4-52.4c-11.4,0-20.7-9.3-20.7-20.7s9.3-20.7,20.7-20.7c5.8,0,11.1,2.3,15.1,6.5 c6,6.4,16.1,6.7,22.4,0.7c6.4-6,6.7-16.1,0.7-22.4c-6.1-6.5-13.9-11.3-22.3-14v-9.2c0-8.8-7.1-15.9-15.9-15.9 c-8.8,0-15.9,7.1-15.9,15.9v9.2c-21.2,6.7-36.5,26.6-36.5,50c0,28.9,23.5,52.4,52.4,52.4c11.4,0,20.7,9.3,20.7,20.7 s-9.3,20.7-20.7,20.7c-5.8,0-11.1-2.3-15.1-6.5c-6-6.4-16.1-6.7-22.4-0.7c-6.4,6-6.7,16.1-0.7,22.4c6.1,6.5,13.9,11.3,22.3,14v9.2 c0,8.8,7.1,15.9,15.9,15.9s15.9-7.1,15.9-15.9v-9.2C282,362.7,297.4,342.8,297.4,319.5z"></path>{" "}
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <div className="font-bold text-xl pt-1 text-[#32bffc]">
                                {formatPrice(totalOrderAmount)} VND
                            </div>
                        </div>
                    </Card>
                    <Card className="w-full" bordered={false}>
                        <div className="font-bold text-base">Thống kê doanh thu</div>
                        <StatisicalRevenue {...{ monthlyRevenue, isLoading }} />
                    </Card>
                </div>
                <div className="flex-1">
                    <div className="flex gap-2 flex-wrap">
                        <Card className="w-full md:flex-1" bordered={false}>
                            <div className="text-base">
                                <div className="font-bold flex justify-between">
                                    <div>Tổng khách hàng</div>
                                    <div className="bg-orange-400 rounded">
                                        <svg
                                            className="px-0.5"
                                            width="25px"
                                            height="25px"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            stroke="#ffffff"
                                        >
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g
                                                id="SVGRepo_tracerCarrier"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path
                                                    d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                                                    stroke="#ffffff"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                ></path>
                                                <path
                                                    d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                                                    stroke="#ffffff"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                ></path>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <div className="font-bold text-xl pt-1 text-[#ff8a4d]">
                                    {totalCustomers}
                                </div>
                            </div>
                        </Card>
                        <Card className="w-full md:flex-1" bordered={false}>
                            <div className="text-base">
                                <div className="font-bold flex justify-between">
                                    <div>Tổng sản phẩm</div>
                                    <div className="bg-purple-400 rounded">
                                        <svg
                                            className="px-0.5"
                                            width="25px"
                                            height="25px"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            stroke="#ffffff"
                                        >
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g
                                                id="SVGRepo_tracerCarrier"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path
                                                    d="M3 7L6 4H9C9 4.39397 9.0776 4.78407 9.22836 5.14805C9.37913 5.51203 9.6001 5.84274 9.87868 6.12132C10.1573 6.3999 10.488 6.62087 10.8519 6.77164C11.2159 6.9224 11.606 7 12 7C12.394 7 12.7841 6.9224 13.1481 6.77164C13.512 6.62087 13.8427 6.3999 14.1213 6.12132C14.3999 5.84274 14.6209 5.51203 14.7716 5.14805C14.9224 4.78407 15 4.39397 15 4H18L21 7L20.5 12L18 10.5V20H6V10.5L3.5 12L3 7Z"
                                                    stroke="#ffffff"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="square"
                                                    strokeLinejoin="round"
                                                ></path>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <div className="font-bold text-xl pt-1 text-[#b198ff]">
                                    {totalProducts}
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="py-2">
                        <Card className="w-full pb-[64px] pt-5" bordered={false}>
                            <div className="font-bold text-base">
                                Thống kê sản phẩm bán chạy
                            </div>
                            <StatisticalProductSelling {...{ topSellingProducts, isLoading }} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;