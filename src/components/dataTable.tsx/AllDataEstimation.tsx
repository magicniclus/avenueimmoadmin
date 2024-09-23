import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { database } from "@/firebase/firebase.config";
import { setDrawerOpen } from "@/redux/drawerSlice";
import { RootState } from "@/redux/store";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { onValue, ref } from "firebase/database";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export type Estimation = {
  id: string;
  adresse: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  predictedPrice: number;
  date: string;
  assigned?: boolean;
};

export const columns: ColumnDef<Estimation>[] = [
  {
    accessorKey: "adresse",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Adresse
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("adresse")}</div>,
  },
  {
    accessorKey: "firstName",
    header: "Prénom",
    cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
  },
  {
    accessorKey: "lastName",
    header: "Nom",
    cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "predictedPrice",
    header: () => <div className="text-right">Prix Prévu</div>,
    cell: ({ row }) => {
      const predictedPrice = parseFloat(row.getValue("predictedPrice"));
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(predictedPrice);

      return <div className="font-medium text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateStr = row.getValue("date");
      if (typeof dateStr === "string") {
        const parsedDate = parseCustomDate(dateStr);
        return <div>{parsedDate.toLocaleString("fr-FR")}</div>;
      } else {
        return <div>Format invalide</div>;
      }
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = rowA.getValue(columnId);
      const dateB = rowB.getValue(columnId);
      if (typeof dateA === "string" && typeof dateB === "string") {
        const parsedDateA = parseCustomDate(dateA);
        const parsedDateB = parseCustomDate(dateB);
        return parsedDateB.getTime() - parsedDateA.getTime(); // Tri du plus récent au plus ancien
      } else {
        return 0;
      }
    },
  },
  {
    accessorKey: "assigned",
    header: "Attribué",
    cell: ({ row }) => (
      <div
        className={`${
          row.getValue("assigned")
            ? "p-1 rounded-lg bg-blue-300 border border-blue-500 flex justify-center"
            : "p-1 rounded-lg bg-red-300 border border-red-500 flex justify-center"
        }`}
      >
        {row.getValue("assigned") ? "Oui" : "Non"}
      </div>
    ),
  },
];

// Fonction de parsing pour extraire correctement la date
function parseCustomDate(dateStr: string): Date {
  const regex = /(\d{1,2}) (\w+) (\d{4}) à (\d{2}):(\d{2})/;
  const match = dateStr.match(regex);

  if (match) {
    const [, day, monthName, year, hours, minutes] = match;

    const monthMap: { [key: string]: number } = {
      janvier: 0,
      février: 1,
      mars: 2,
      avril: 3,
      mai: 4,
      juin: 5,
      juillet: 6,
      août: 7,
      septembre: 8,
      octobre: 9,
      novembre: 10,
      décembre: 11,
    };

    const month = monthMap[monthName.toLowerCase()];

    if (month !== undefined) {
      return new Date(
        Number(year),
        month,
        Number(day),
        Number(hours),
        Number(minutes)
      );
    }
  }

  return new Date();
}

export function AllDataEstimation() {
  const dispatch = useDispatch();
  const drawerOpen = useSelector(
    (state: RootState) => state?.drawer?.drawerOpen
  );
  const [data, setData] = useState<Estimation[]>([]);
  const [allId, setAllId] = useState<{ id: string }[]>([]);
  const [uniqueId, setUniqueId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const dataRef = ref(database, "/estimations");
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const result = snapshot.val();
        if (result) {
          const parsedData = Object.keys(result).map((key) => ({
            id: key,
            assigned: result[key].assigned ?? false,
            ...result[key],
          }));
          const showAllId = Object.keys(result).map((key) => ({ id: key }));
          setAllId(showAllId);
          setData(parsedData);
        } else {
          setAllId([]);
          setData([]);
        }
      },
      (error) => {
        setError(error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  // Tri initial du plus récent au plus ancien (desc = true)
  useEffect(() => {
    setSorting([{ id: "date", desc: true }]);
  }, []);

  const [sorting, setSorting] = useState<SortingState>([]);

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), // This line ensures sorting works
  });

  const setOpen = (value: boolean) => {
    dispatch(setDrawerOpen(value));
  };

  const handleRowClick = async (index: number) => {
    setUniqueId(allId[index].id);
  };

  useEffect(() => {
    if (uniqueId) {
      router.push(`?id=${uniqueId}`);
      setOpen(true);
    }
  }, [uniqueId]);

  useEffect(() => {
    if (!drawerOpen) {
      router.push(pathName); // Remove query parameter when drawer is closed
    }
  }, [drawerOpen, pathName, router]);

  return (
    <div className="w-full">
      {error && <p>Erreur: {error}</p>}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrer les données..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colonnes <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(index)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end py-4 space-x-2">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
