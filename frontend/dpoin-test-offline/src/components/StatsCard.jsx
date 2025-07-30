// src/components/StatsCard.jsx
export default function StatsCard({ title, value, icon, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500"
  };

  return (
    <div className={`rounded-lg shadow-md p-4 ${colorClasses[color]} text-white`}>
      <div className="flex items-center">
        <div className="p-2 bg-black bg-opacity-20 rounded-full mr-4">{icon}</div>
        <div>
          <h3 className="text-sm uppercase tracking-wide font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}