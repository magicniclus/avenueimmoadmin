/* eslint-disable react-hooks/exhaustive-deps */
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
  useReactTable,
} from "@tanstack/react-table";
import { onValue, ref } from "firebase/database";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export type Partner = {
  id: string;
  contrat: string;
  email: string;
  entreprise: string;
  nom: string;
  prenom: string;
  telephone: string;
};

export const columns: ColumnDef<Partner>[] = [
  {
    accessorKey: "contrat",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Contrat
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("contrat")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "entreprise",
    header: "Entreprise",
    cell: ({ row }) => <div>{row.getValue("entreprise")}</div>,
  },
  {
    accessorKey: "nom",
    header: "Nom",
    cell: ({ row }) => <div>{row.getValue("nom")}</div>,
  },
  {
    accessorKey: "prenom",
    header: "Prénom",
    cell: ({ row }) => <div>{row.getValue("prenom")}</div>,
  },
  {
    accessorKey: "telephone",
    header: "Téléphone",
    cell: ({ row }) => <div>{row.getValue("telephone")}</div>,
  },
];

export function AllDataPartenaire() {
  const dispatch = useDispatch();

  const drawerOpen = useSelector(
    (state: RootState) => state?.drawer?.drawerOpen
  );

  const [data, setData] = useState<Partner[]>([]);
  const [allId, setAllId] = useState<{ id: string }[]>([]);
  const [uniqueId, setUniqueId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const dataRef = ref(database, "/agents");
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const result = snapshot.val();
        if (result) {
          const parsedData = Object.keys(result).map((key) => ({
            id: key,
            contrat: result[key].informations.contrat ?? "",
            email: result[key].informations.email ?? "",
            entreprise: result[key].informations.entreprise ?? "",
            nom: result[key].informations.nom ?? "",
            prenom: result[key].informations.prenom ?? "",
            telephone: result[key].informations.telephone ?? "",
          }));
          const showAllId = Object.keys(result).map((key) => ({
            id: key,
          }));
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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId))
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());
    },
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const setOpen = (value: boolean) => {
    dispatch(setDrawerOpen(value));
  };

  const handleRowClick = (index: number) => {
    const selectedId = allId[index].id;
    if (uniqueId === selectedId) {
      setOpen(false); // Close the drawer before reopening
      setTimeout(() => {
        setUniqueId(selectedId);
        setOpen(true);
        router.push(`?id=${selectedId}`);
      }, 300); // Adjust the timeout to match the drawer close animation duration
    } else {
      setUniqueId(selectedId);
      setOpen(true);
      router.push(`?id=${selectedId}`);
    }
  };

  useEffect(() => {
    if (!drawerOpen) {
      router.push(pathName); // Remove query parameter when drawer is closed
      setUniqueId(null); // Reset uniqueId when drawer is closed
    }
  }, [drawerOpen, pathName, router]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setUniqueId(id);
      setOpen(true);
    }
  }, [searchParams]);

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
              Colonnes <ChevronDown className="ml-2 h-4 w-4" />
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
      <div className="rounded-md border">
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
      <div className="flex items-center justify-end space-x-2 py-4">
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
