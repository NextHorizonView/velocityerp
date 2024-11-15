// components/DashboardStats.tsx
import { LuArrowUpRightFromCircle } from 'react-icons/lu';

const DashboardStats = ({ stats }: { stats: { label: string; value: string }[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {stats.map((stat) => (
      <div key={stat.label} className="relative bg-gray-100 rounded-lg p-4">
        <div className="text-[#576086]">
          <p className="text-sm">{stat.label}</p>
          <p className="text-2xl font-bold mt-2">{stat.value}</p>
        </div>
        <button
          className="absolute bottom-2 right-2 w-8 h-8 bg-white p-2 shadow-md rounded-full flex items-center justify-center text-gray-400 hover:bg-[#576086] hover:text-white"
        >
          <LuArrowUpRightFromCircle className="w-6 h-6 transform" />
        </button>
      </div>
    ))}
  </div>
);

export default DashboardStats;
