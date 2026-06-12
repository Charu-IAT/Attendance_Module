import './Card.css';

interface DashboardCardProps {
  title: string;
  count: string | number;
  color: string;
}

export default function DashboardCard({ title, count, color }: DashboardCardProps) {
  return (
    <div
      className="dashboard-card"
      style={{ borderBottom: `4px solid ${color}` }}
    >
      <h4>{title}</h4>
      <h1>{count}</h1>
    </div>
  );
}
