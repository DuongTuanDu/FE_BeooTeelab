import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import size from "../../resources/size.png";
import { Breadcrumb } from "antd";

const Size = () => {
    return (
        <div className="px-8 py-4">
            <div className="py-6 md:px-16 xl:px-16 2xl:px-16">
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <div
                                    onClick={() => navigate("/")}
                                    className="text-slate-600 text-base cursor-pointer"
                                >
                                    <HomeOutlined /> Trang Chủ
                                </div>
                            ),
                        },
                        {
                            title: (
                                <div className="text-slate-800 text-base cursor-pointer">
                                    Bảng size
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
            <img className="w-full" src={size} alt="size-image" />
        </div>
    );
};

export default Size;