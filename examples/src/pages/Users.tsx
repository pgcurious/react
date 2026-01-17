import { UserList } from '@/components/features';

/**
 * Users Page
 */
function Users() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8">Users</h1>
      <UserList />
    </div>
  );
}

export default Users;
