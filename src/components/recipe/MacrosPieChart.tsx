
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MacrosPieChartProps {
  macrosString: string;
}

export const MacrosPieChart: React.FC<MacrosPieChartProps> = ({ macrosString }) => {
  if (!macrosString) return null;

  try {
    const [protein, carbs, fat] = macrosString.split('-').map(Number);
    const data = [
      { name: 'Protein', value: protein },
      { name: 'Carbs', value: carbs },
      { name: 'Fat', value: fat }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
      <div className="w-24 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={15}
              outerRadius={30}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  } catch (error) {
    console.error("Error rendering macros pie chart:", error);
    return null;
  }
};
