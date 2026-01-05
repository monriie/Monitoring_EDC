import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useMachines } from "@/hooks/useMachine"
import { CustomTooltip } from "../ui/tooltip"

const DataBarChart = () => {
  const { machines } = useMachines()

  const data = useMemo(() => {
    const terdataBank = machines.filter(
      m => m.status_data === "TERDATA_BANK"
    ).length

    const vendorOnly = machines.filter(
      m => m.status_data === "VENDOR_ONLY"
    ).length

    return [
      { name: "Terdata Bank", value: terdataBank, shortName: "Bank" },
      { name: "Vendor Only", value: vendorOnly, shortName: "Vendor" },
    ]
  }, [machines])

  if (!data.some(d => d.value > 0)) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Status Data
        </h3>
        <div className="py-8 text-center text-gray-400 text-sm">
          Tidak ada data status
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Status Data
      </h3>

      <div className="w-full">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart 
            data={data}
            margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
          >
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="#00AEEF"
              radius={[8, 8, 0, 0]}
              maxBarSize={100}
              label={{ 
                position: 'top', 
                fontSize: 14,
                fontWeight: 'bold',
                fill: '#374151'
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DataBarChart;