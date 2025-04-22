import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Sorting,
  getFilteredRowModel,
} from "@tanstack/react-table";
import * as AllAPI from "../../api/apiHandler";
import { Link } from "react-router-dom";

function BasicTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    AllAPI.lead_listing({}).then((res) => {
      setData(res.data);
    });
  }, []);

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      footer: "ID",
    },
    {
      header: "First name",
      accessorKey: "first_name",
      footer: "First name",
    },
    {
      header: "Last name",
      accessorKey: "last_name",
      footer: "Last name",
    },
    {
      header: "Disposition",
      accessorKey: "disposition",
      footer: "Disposition",
    },
  ];

  const [sorting, setsorting] = useState([]);
  const [filtering, setfiltering] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setsorting,
    onGlobalFilterChange: setfiltering,
  });

  if (data == []) {
    return <h1>No Data Found</h1>;
  }

  return (
    <>
      <div className="container">
        <div className="d-flex float-end mb-3 mt-3 ">
          {/* <label className="form-label">Search</label> */}
          <input
            className="form-control"
            type="text"
            value={filtering}
            onChange={(e) => setfiltering(e.target.value)}
            placeholder="Search"
          />
        </div>

        <table className="table table-striped border">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleGroupingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
                <th>Action</th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td>
                  <ul className="action">
                    <li className="edit">
                      <Link to={"/qualifying"} state={{ ID: row.original.id }}>
                        <i className="icon-pencil-alt"></i>
                      </Link>
                    </li>
                    <li className="delete">
                      <span
                        style={{ cursor: "pointer" }}
                        // onClick={() => removeLeadItem(cell.id)}
                      >
                        <i className="icon-trash"></i>
                      </span>
                    </li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
                <th>Action</th>
              </tr>
            ))}
          </tfoot>
        </table>
        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-primary"
            onClick={() => table.setPageIndex(0)}
          >
            First page
          </button>
          <button
            className="btn btn-primary"
            style={{ marginLeft: "5px" }}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous page
          </button>
          <button
            className="btn btn-primary"
            style={{ marginLeft: "5px" }}
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next page
          </button>
          <button
            className="btn btn-primary ml-5px"
            style={{ marginLeft: "5px" }}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            Last page
          </button>
        </div>
      </div>
    </>
  );
}

export default BasicTable;
