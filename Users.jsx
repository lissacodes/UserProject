import React, { useState, useEffect, Fragment } from "react";
import userService from "../../services/userService";
import UserTable from "./UserTable";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import debug from "sabio-debug";
import { TextField, InputAdornment, Card, Divider } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const _logger = debug.extend("users");

export default function Users() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const [activePage, setActivePage] = useState(1);
  const [users, setUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredData, setFilteredData] = useState(users);

  useEffect(() => {
    userService
      .getUsers(pagination.pageIndex, pagination.pageSize)
      .then(onGetUserSuccess)
      .catch(onGetUsersError);
  }, []);

  let onGetUserSuccess = (response) => {
    let userItems = [];
    let totalCount = 0;

    userItems = response.data.item.pagedItems;
    totalCount = response.data.item.totalCount;

    setFilteredData(userItems);
    setUsers(userItems);
    setPagination({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
    });
    _logger(userItems);
    _logger(totalCount);
  };

  let onGetUsersError = (error) => {
    _logger(error);
  };

  let onPageChange = (pageNumber) => {
    userService
      .getUsers(pageNumber - 1, pagination.pageSize)
      .then(onGetUserSuccess)
      .catch(onGetUsersError);

    setActivePage(pageNumber);
  };

  let mapUser = (user) => (
    <UserTable user={user} key={user.id} handleRefresh={handleRefresh} />
  );

  let handleRefresh = (props) => {
    _logger(props);
    userService
      .getUsers(activePage - 1, pagination.pageSize)
      .then(onGetUserSuccess)
      .catch(onGetUsersError);
  };

  const handleChange = (e) => {
    let value = e.target.value.toLowerCase();
    let result = [];
    _logger(e.target.value);
    result = users.filter((data) => {
      return data.email.search(value) !== -1;
    });
    setFilteredData(result);
    setInputValue(e.target.value);
  };

  return (
    <Fragment>
      <Card className="card-box mb-3">
        <div className="d-flex align-items-center ml-2 mr-2">
          <div className="mr-auto p-3">
            <h3 className="pl-5 text-black">Users</h3>
          </div>
          <div className="col-12 col-lg-auto mb-lg-0 me-lg-3">
            <TextField
              className="app-search-input p-3"
              size="small"
              value={inputValue}
              onChange={handleChange}
              inputProps={{ "aria-label": "search" }}
              placeholder="Search Emails…"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="app-search-icon" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
        <Divider />
        <Card className="card-box text-center">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Emails</th>
                <th scope="col">Roles</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>{filteredData.map(mapUser)}</tbody>
          </table>
        </Card>

        <Divider />
        <Pagination
          total={pagination.totalCount}
          pageSize={pagination.pageSize}
          current={activePage}
          onChange={onPageChange}
          className="px-5 py-4"
        />
      </Card>
    </Fragment>
  );
}
