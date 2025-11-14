import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function CustomBarChart({
  data,
  xKey = "name",
  yKey = "value",
  width = 400,
  height = 250,
  barColor = "#4CAF50",
  showLegend = false,
  showTooltip = true,
  grid = true,
}) {
  return (
    <BarChart width={width} height={height} data={data}>
      {grid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis dataKey={xKey} />
      <YAxis />
      {showTooltip && <Tooltip />}
      {showLegend && <Legend />}
      <Bar dataKey={yKey} fill={barColor} />
    </BarChart>
  );
}
