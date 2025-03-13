import React, { useState } from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Card, message, Breadcrumb } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { BiSolidExit } from "react-icons/bi";
import { IoPricetags } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { logoutCustomer } from "../../redux/auth/auth.slice";
import Profile from "./components/Profile";
import OrderHistory from "./components/OrderHistory";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("profile");
  const { userInfo } = useSelector((state) => state.auth);

  const AccountContent = () => {
    switch (selected) {
      case "profile":
        return <Profile />;
      case "order":
        return <OrderHistory />;
      default:
        return <Profile />;
    }
  };

  const menuItems = [
    {
      key: "profile",
      icon: <FaUserCircle className="text-2xl" />,
      text: "Hồ sơ",
    },
    {
      key: "cart",
      icon: <FaBasketShopping className="text-2xl" />,
      text: "Giỏ hàng",
    },
    {
      key: "order",
      icon: <IoPricetags className="text-2xl" />,
      text: "Đơn hàng",
    },
    {
      key: "logout",
      icon: <BiSolidExit className="text-2xl" />,
      text: "Đăng xuất",
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="py-4 sm:py-6 lg:px-16">
        <Breadcrumb
          items={[
            {
              title: (
                <div className="text-slate-600 text-sm sm:text-base cursor-pointer">
                  <HomeOutlined /> Trang chủ
                </div>
              ),
            },
            {
              title: (
                <div className="text-slate-800 text-sm sm:text-base cursor-pointer">
                  Tài khoản
                </div>
              ),
            },
          ]}
        />
        <div className="py-4 flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/4">
            <Card
              title={
                <div className="flex py-2 gap-2 items-center text-xs sm:text-sm">
                  <div className="avatar">
                    <div className="w-10 sm:w-14 rounded-full">
                      <img src={userInfo?.avatar?.url} alt="User Avatar" />
                    </div>
                  </div>
                  <div>
                    <div>{userInfo?.name}</div>
                    <div className="truncate max-w-[150px] sm:max-w-full">
                      {userInfo?.email}
                    </div>
                  </div>
                </div>
              }
              bordered={false}
              className="w-full"
            >
              <div className="px-2 text-sm sm:text-base">
                {menuItems.map((item) => (
                  <div
                    key={item.key}
                    onClick={() => {
                      if (item.key === "cart") return navigate("/cart");
                      if (item.key === "logout") {
                        dispatch(logoutCustomer());
                        message.success("Đăng xuất thành công");
                        navigate("/");
                        return;
                      }
                      item.key !== "logout" && setSelected(item.key);
                    }}
                    className={`flex gap-2 items-center py-3 px-2 mb-2 hover:bg-slate-100 rounded-md font-medium cursor-pointer text-slate-700 ${
                      selected === item.key ? "bg-slate-100" : ""
                    }`}
                  >
                    <div>{item.icon}</div>
                    <div>{item.text}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="flex-grow lg:w-3/4">
            <Card bordered={false} className="w-full">
              <div className="px-2 text-sm sm:text-base">
                <AccountContent />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
