import React, { useCallback, useEffect, useState } from "react";
import TableUser from "../../components/Table/TableUser";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { getUserList } from "../../redux/user/user.thunk";
import { Input } from "antd";

const ManageUser = () => {
  const dispatch = useDispatch();
  const { users, pagination, isLoading } = useSelector((state) => state.user);

  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  useEffect(() => {
    dispatch(getUserList({ ...paginate, ...filters }));
  }, [dispatch, paginate.page, paginate.pageSize, filters]);

  useEffect(() => {
    if (pagination) {
      setPaginate((prev) => ({
        ...prev,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPage: pagination.totalPage,
        totalItems: pagination.totalUsers,
      }));
    }
  }, [pagination]);

  const debouncedFilter = useCallback(
    debounce((name, value) => {
      setFilters((prev) => ({ ...prev, [name]: value }));
      setPaginate((prev) => ({ ...prev, page: 1 }));
    }, 1000),
    []
  );

  const handleFilterChange = (name, value) => {
    debouncedFilter(name, value);
  };

  return (
    <div className="mt-4 mx-auto">
      <div className="py-4">
        <Input
          className="flex-1"
          type="text"
          placeholder="Nhập thông tin người dùng..."
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>
      <TableUser
        users={users}
        isLoading={isLoading}
        page={paginate.page}
        pageSize={paginate.pageSize}
        totalItems={paginate.totalItems}
        setPaginate={setPaginate}
      />
    </div>
  );
};

export default ManageUser;