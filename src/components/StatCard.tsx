import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number | React.ReactNode;
  label: string;
  error?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, error }) => {
  return (
    <div className="bg-white p-6">
      <div className="flex items-center mb-4">
        <div className="mr-4">{icon}</div>
        <h2 className="text-xl font-bold">{label}</h2>
      </div>
      <div className="text-2xl font-semibold">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          value
        )}
      </div>
    </div>
  );
};

export default StatCard;
