import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services';
import { Button, Card, Input, Modal } from '@/components/ui';
import { useDebounce, useToggle } from '@/hooks';
import type { User } from '@/types';

/**
 * UserList Component
 *
 * Modern patterns demonstrated:
 * 1. TanStack Query for data fetching
 * 2. Optimistic updates
 * 3. Search with debounce
 * 4. Pagination
 * 5. Loading and error states
 */

function UserList() {
  const queryClient = useQueryClient();

  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, toggleDeleteModal, setDeleteModalOpen] = useToggle(false);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 300);

  // Query - fetch users
  const {
    data: usersData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['users', { page, search: debouncedSearch }],
    queryFn: () => usersService.getAll({ page, pageSize: 10, search: debouncedSearch }),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    placeholderData: (previousData) => previousData, // Keep previous data while loading new
  });

  // Mutation - delete user
  const deleteMutation = useMutation({
    mutationFn: (userId: string) => usersService.delete(userId),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteModalOpen(false);
      setSelectedUser(null);
    },
  });

  // Handlers
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id);
    }
  };

  // Render loading state
  if (isLoading && !usersData) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>
    );
  }

  // Render error state
  if (isError) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            Failed to load users: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const users = usersData?.data ?? [];
  const pagination = usersData?.pagination;

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Users list */}
      <Card padding="none">
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {search ? 'No users found matching your search' : 'No users yet'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar ?? '/default-avatar.png'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {user.role}
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(user)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="secondary"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="px-4 py-2">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={toggleDeleteModal}
        title="Delete User"
        size="sm"
      >
        <p className="mb-4">
          Are you sure you want to delete{' '}
          <strong>{selectedUser?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            isLoading={deleteMutation.isPending}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export { UserList };
