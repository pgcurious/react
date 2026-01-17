import { Link } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { useUser, useAuthActions } from '@/stores';

/**
 * Dashboard Page
 */
function Dashboard() {
  const user = useUser();
  const { logout } = useAuthActions();

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="ghost" onClick={logout}>
          Logout
        </Button>
      </div>

      <Card className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Welcome, {user?.name ?? 'User'}!</h2>
        <p className="text-gray-600">
          You are logged in as <strong>{user?.email}</strong> with role{' '}
          <span className="px-2 py-1 bg-blue-100 rounded text-blue-800 text-sm">
            {user?.role}
          </span>
        </p>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <h3 className="font-semibold mb-2">Users</h3>
          <p className="text-gray-600 text-sm mb-4">
            Manage users in the system
          </p>
          <Link to="/users">
            <Button size="sm">View Users</Button>
          </Link>
        </Card>

        <Card>
          <h3 className="font-semibold mb-2">Profile</h3>
          <p className="text-gray-600 text-sm mb-4">
            Update your profile settings
          </p>
          <Button size="sm" variant="secondary">
            Edit Profile
          </Button>
        </Card>

        <Card>
          <h3 className="font-semibold mb-2">Settings</h3>
          <p className="text-gray-600 text-sm mb-4">
            Configure application settings
          </p>
          <Button size="sm" variant="secondary">
            Settings
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
