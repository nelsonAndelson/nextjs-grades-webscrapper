"use client";
import { GradesObjectType, StudentProfileType } from "@/types/types";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatGrades } from "../../../utils/studentGradesUtils";

export const columns: ColumnDef<StudentProfileType>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      const formattedGrades = formatGrades(student.gradesObject);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(formattedGrades)}
            >
              Copy Grades
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("View Student")}>
              View Student
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: () => <div className="flex flex-row justify-center">Email</div>,
    cell: ({ getValue }) => {
      const email = getValue() as string;
      return <div className="flex flex-row justify-center ">{email}</div>;
    },
  },
  {
    accessorKey: "dateAdded",
    header: "Date Created",
    cell: ({ getValue }) => {
      const date = getValue() as string;
      const formattedDate = date && new Date(date).toLocaleDateString();
      return (
        <div className="flex flex-row justify-center">
          {formattedDate || ""}
        </div>
      );
    },
  },
  {
    accessorKey: "gradesObject",
    header: "Grades",
    cell: ({ getValue }) => {
      const grades = getValue() as GradesObjectType;
      return (
        <div className="flex flex-col">
          {Object.keys(grades).map((key) => (
            <div key={key} className="flex flex-row justify-between">
              <p>{key}</p>
              <p>{grades[key]}</p>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "gradesAverage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Average
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const average = getValue() as number;
      return <div className="flex flex-row justify-center">{average}</div>;
    },
  },
];
