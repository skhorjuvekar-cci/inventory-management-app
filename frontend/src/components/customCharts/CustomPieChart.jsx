import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function CustomPieChart({
  data,
  dataKey = "value",
  nameKey = "name",
  width = 400,
  height = 350,
  outerRadius = 100,
  colors = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63"],
  showLegend = true,
  showTooltip = true,
  label = true,
}) {
  return (
    <PieChart width={width} height={height}>
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        outerRadius={outerRadius}
        label={label}
      >
        {data.map((_, index) => (
          <Cell key={index} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      {showTooltip && <Tooltip />}
      {showLegend && <Legend />}
    </PieChart>
  );
}
