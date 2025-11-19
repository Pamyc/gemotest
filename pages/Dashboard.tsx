import React, { useEffect, useState } from 'react';
import { Chart } from '../components/charts/Chart';
import { api } from '../services/api';
import { KPI, Project } from '../types';
import { TrendingUp, Building2, Users, DollarSign, Briefcase } from 'lucide-react';

const KPICard = ({ title, value, subValue, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
        <TrendingUp size={12} /> {subValue}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${color} text-white bg-opacity-90`}>
      <Icon size={24} />
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [kpiData, projData, cData] = await Promise.all([
        api.dashboard.getKPI(),
        api.projects.getAll(),
        api.dashboard.getRevenueChartData()
      ]);
      setKpi(kpiData);
      setProjects(projData.slice(0, 5));
      setChartData(cData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-10">Loading Dashboard...</div>;

  const chartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['Sales Count', 'Revenue ($M)'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: chartData.map(d => d.month),
        axisPointer: { type: 'shadow' }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Sales Count',
        min: 0,
        interval: 10,
        axisLabel: { formatter: '{value}' }
      },
      {
        type: 'value',
        name: 'Revenue',
        min: 0,
        interval: 2,
        axisLabel: { formatter: '${value} M' }
      }
    ],
    series: [
      {
        name: 'Sales Count',
        type: 'bar',
        data: chartData.map(d => d.sales),
        itemStyle: { color: '#3b82f6' }
      },
      {
        name: 'Revenue ($M)',
        type: 'line',
        yAxisIndex: 1,
        data: chartData.map(d => d.revenue),
        smooth: true,
        itemStyle: { color: '#10b981' },
        lineStyle: { width: 3 }
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Revenue" 
          value={`$${(kpi?.totalRevenue || 0).toLocaleString()}`} 
          subValue="+12.5% vs last month" 
          icon={DollarSign} 
          color="bg-blue-600" 
        />
        <KPICard 
          title="Total Deals" 
          value={kpi?.dealsCount} 
          subValue="+5% new leads" 
          icon={Briefcase} 
          color="bg-indigo-600" 
        />
        <KPICard 
          title="Active Projects" 
          value={kpi?.totalProjects} 
          subValue="2 Launching soon" 
          icon={Building2} 
          color="bg-amber-500" 
        />
        <KPICard 
          title="Active Units" 
          value={kpi?.activeUnits} 
          subValue="85% Occupancy" 
          icon={Users} 
          color="bg-emerald-500" 
        />
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Sales & Revenue Overview</h3>
          <Chart options={chartOptions} height="350px" />
        </div>

        {/* Top Projects List */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Performing Projects</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-3 py-2">Project</th>
                  <th className="px-3 py-2">Sold %</th>
                  <th className="px-3 py-2 text-right">Rev ($M)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-700">{p.name}</td>
                    <td className="px-3 py-3">
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${p.soldPercentage}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-500">{p.soldPercentage}%</span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-600">
                      {(p.revenue / 1000000).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};