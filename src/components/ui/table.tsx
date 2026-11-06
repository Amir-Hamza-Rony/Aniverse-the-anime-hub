"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table ref={ref} className={cn("caption-corner", className)} {...props} />
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn(className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn(className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn(className)} {...props} />
  )
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn(className)} {...props} />
  )
);
TableRow.displayName = "TableRow";

const TableCell = React.forwardRef<HTMLTableDataCellElement, React.HTMLAttributes<HTMLTableDataCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle", className)} {...props} />
  )
);
TableCell.displayName = "TableCell";

const TableHead = React.forwardRef<HTMLTableHeaderCellElement, React.HTMLAttributes<HTMLTableHeaderCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn("p-4 align-middle", className)} {...props} />
  )
);
TableHead.displayName = "TableHead";

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableCell, TableHead };
