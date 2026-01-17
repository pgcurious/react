import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, Card } from '@/components/ui';
import { authService } from '@/services';
import { useAuthActions } from '@/stores';
import { useNotifications } from '@/contexts';

/**
 * LoginForm Component
 *
 * Modern patterns demonstrated:
 * 1. React Hook Form for form management
 * 2. Zod for schema validation
 * 3. TanStack Query mutation for API call
 * 4. Zustand for auth state
 * 5. Toast notifications
 */

// Validation schema with Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuthActions();
  const { success, error: showError } = useNotifications();

  // Form setup with React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.user, data.token);
      success('Welcome back!', 'Login successful');
      onSuccess?.();
    },
    onError: (error) => {
      showError(
        error instanceof Error ? error.message : 'Login failed',
        'Authentication Error'
      );
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="max-w-md mx-auto">
      <Card.Header>
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <p className="text-gray-500 text-center mt-2">
          Welcome back! Please sign in to continue.
        </p>
      </Card.Header>

      <Card.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              {...register('rememberMe')}
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>

          <Button
            type="submit"
            className="w-full"
            isLoading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </form>
      </Card.Body>

      <Card.Footer>
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </Card.Footer>
    </Card>
  );
}

export { LoginForm };
