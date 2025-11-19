import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Chart } from '../components/charts/Chart';
import { useReactTable, getCoreRowModel, getGroupedRowModel, getExpandedRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import { ChevronRight, ChevronDown, Download } from 'lucide-react';

export const Finance: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [grouping, setGrouping] = useState<string[]>(['projectId']);

  useEffect(() => {
    api.sales.getAll().then(setSales);
  }, []);

  // --- Pivot Table Config ---
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: 'Dimension',
        accessorKey: 'projectId', // This is a bit hacky for a quick pivot sim, usually you'd dynamic columns
        cell: ({ row, getValue }) => {
            return (
                <div 
                    style={{ paddingLeft: `${row.depth * 2}rem` }}
                    className="flex items-center gap-2 font-medium text-slate-800"
                >
                    {row.getCanExpand() ? (
                        <button onClick={row.getToggleExpandedHandler()}>
                             {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                    ) : null}
                    {getValue() as string} 
                    {row.getCanExpand() && <span className="text-xs text-slate-400 font-normal">({row.subRows.length})</span>}
                </div>
            )
        }
      },
      {
        header: 'Unit Type',
        accessorKey: 'unitType',
      },
      {
        header: 'Count',
        accessorKey: 'count',
        aggregationFn: 'count',
        cell: info => info.getValue(),
      },
      {
        header: 'Total Revenue',
        accessorKey: 'amount',
        aggregationFn: 'sum',
        cell: info => <span className="font-mono font-medium text-emerald-600">${(info.getValue() as number)?.toLocaleString()}</span>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: sales,
    columns,
    state: { grouping, expanded: true }, // expanded: true is loose typing, usually object
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  // --- Chart Config ---
  const chartOptions = {
    color: ['#6366f1', '#f43f5e'],
    tooltip: { trigger: 'axis' },
    legend: { data: ['Projected', 'Actual'] },
    xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: { type: 'value' },
    series: [
        { name: 'Projected', type: 'bar', data: [120, 132, 101, 134, 90, 230] },
        { name: 'Actual', type: 'line', smooth: true, data: [110, 122, 105, 140, 100, 220] }
    ]
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">Financial Analysis</h1>
            <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 text-sm">
                <Download size={16} /> Export Report
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Revenue: Planned vs Actual</h3>
                <Chart options={chartOptions} height="300px" />
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Distribution by Unit Type</h3>
                <Chart options={{
                    tooltip: { trigger: 'item' },
                    series: [{
                        type: 'pie',
                        radius: ['40%', '70%'],
                        data: [
                            { value: 1048, name: 'Studio' },
                            { value: 735, name: '1BR' },
                            { value: 580, name: '2BR' },
                            { value: 484, name: '3BR' },
                            { value: 300, name: 'Penthouse' }
                        ]
                    }]
                }} height="300px" />
            </div>
        </div>

        {/* Pivot Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-semibold text-slate-700">Sales Pivot Overview</h3>
                <div className="flex gap-2">
                     <span className="text-xs text-slate-500 self-center">Group by: Project > Unit</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} className="px-6 py-3 font-semibold border-b border-slate-200">
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className={`hover:bg-slate-50 border-b border-slate-100 ${row.getIsGrouped() ? 'bg-slate-50/50' : 'bg-white'}`}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="px-6 py-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};