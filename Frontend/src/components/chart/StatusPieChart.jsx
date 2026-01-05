import { useMemo } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useMachines } from "@/hooks/useMachine"
import { CustomLegend, CustomTooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

const StatusPieChart = () => {
  const { machines } = useMachines()

  const data = useMemo(() => {
    const aktif = machines.filter(m => m.status_mesin === "AKTIF").length
    const perbaikan = machines.filter(m => m.status_mesin === "PERBAIKAN").length
    const overdue = machines.filter(m => {
      if (!m.estimasi_selesai) return false
      return new Date(m.estimasi_selesai) < new Date()
    }).length
    const nonaktif = machines.filter(m => m.status_mesin === "NONAKTIF").length

    return [
      { name: "Aktif", value: aktif, color: "#22c55e" },
      { name: "Perbaikan", value: perbaikan, color: "#facc15" },
      { name: "Overdue", value: overdue, color: "#ef4444" },
      { name: "Nonaktif", value: nonaktif, color: "#64748b" },
    ].filter(item => item.value > 0)
  }, [machines])

  if (!data.some(d => d.value > 0)) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Status Mesin
        </h3>
        <div className="py-8 text-center text-gray-400 text-sm">
          Tidak ada data status mesin
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Status Mesin
      </h3>

      <div className="w-full">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              innerRadius="0%"
              paddingAngle={2}
              label={({ name, percent }) => 
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={index} 
                  fill={entry.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              content={<CustomLegend />}
              wrapperStyle={{ 
                paddingTop: '10px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default StatusPieChart;