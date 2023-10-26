import axios from "axios";
import { useCallback, useEffect, useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styles from "./styles/Home.module.css";

/**
 * ƒGƒ‰[Œ^‚©‚Ç‚¤‚©‚ð”»’è‚·‚éŠÖ”
 */
const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  website: string;

  address: {
    city: string;
    geo: {
      lat: string;
      lng: string;
    }
  }
}

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: "name",
        accessorKey: "name",
      },
      {
        header: "email",
        accessorKey: "email",
      },
      {
        header: "phone",
        accessorKey: "phone",
      },
      {
        header: "username",
        accessorKey: "username",
      },
      {
        header: "website",
        accessorKey: "website",
      },
      {
        header: "city",
        accessorKey: "address.city",
      },
      {
        header: "latitude",
        accessorKey: "address.geo.lat",
      },
      {
        header: "longitude",
        accessorKey: "address.geo.lng",
      },
    ],
    []
  );
  const table = useReactTable({
    data: users,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      setUsers(response.data);
    } catch (e) {
      if (isError(e)) {
        setError(e);
      }
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <main className={styles.main}>
      <h1>Test Users Data from jsonplaceholder</h1>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ margin: "5px" }}>
        <span>Page</span>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </div>
      <div>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
      </div>
      <select
        style={{ margin: "10px" }}
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
      <div>{table.getRowModel().rows.length} Rows</div>
    </main>
  );
};