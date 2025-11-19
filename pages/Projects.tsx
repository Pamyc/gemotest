import React, { useMemo, useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { api } from '../services/api';
import { Project, ProjectStatus } from '../types';
import { ArrowUpDown, Search, Filter } from 'lucide-react';

export const Projects: React.FC = () => {
  const [data, setData] = useState<Project[]>([]);
  const [sorting, setSorting] = useState<any>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    api.projects.getAll().then(setData);
  }, []);

  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center hover:text-blue-600"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Project Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
          )
        },
        cell: info => <span className="font-semibold text-slate-700">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue() as ProjectStatus;
          let color = 'bg-slate-100 text-slate-800';
          if (status === ProjectStatus.CONSTRUCTION) color = 'bg-blue-100 text-blue-800';
          if (status === ProjectStatus.COMPLETED) color = 'bg-green-100 text-green-800';
          if (status === ProjectStatus.PLANNING) color = 'bg-yellow-100 text-yellow-800';
          
          return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>
        }
      },
      {
        accessorKey: 'totalBuildings',
        header: 'Buildings',
      },
      {
        accessorKey: 'soldPercentage',
        header: 'Sold %',
        cell: info => {
            const val = info.getValue() as number;
            return (
                <div className="flex items-center gap-2">
                    <span className="text-xs w-8">{val}%</span>
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${val > 80 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${val}%` }}></div>
                    </div>
                </div>
            )
        }
      },
      {
        accessorKey: 'revenue',
        header: ({ column }) => (
            <button
              className="flex items-center ml-auto hover:text-blue-600"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Revenue
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
        ),
        cell: info => <div className="text-right font-mono">${(info.getValue() as number).toLocaleString()}</div>,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Residential Complexes</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow text-sm font-medium">
            + New Project
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    value={globalFilter ?? ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Search projects..."
                    className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                <Filter size={18} /> Filters
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-3 font-semibold">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
            Showing {table.getRowModel().rows.length} projects
        </div>
      </div>
    </div>
  );
};