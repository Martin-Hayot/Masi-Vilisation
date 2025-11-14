import { RequireAuth } from "~/components/providers/auth-provider";

const DashboardPage = () => {
  return (
    <RequireAuth>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </RequireAuth>
  );
};

export default DashboardPage;
