import { Link } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { useTheme } from '@/contexts';
import { useIsAuthenticated } from '@/stores';

/**
 * Home Page
 */
function Home() {
  const { toggleTheme, resolvedTheme } = useTheme();
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          Modern React + TypeScript
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A complete example of enterprise-grade React patterns with TypeScript,
          featuring hooks, state management, data fetching, and more.
        </p>

        <div className="flex justify-center gap-4 mb-12">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="lg">Get Started</Button>
            </Link>
          )}
          <Button variant="secondary" size="lg" onClick={toggleTheme}>
            {resolvedTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          <Card>
            <h3 className="font-bold text-lg mb-2">Functional Components</h3>
            <p className="text-gray-600 text-sm">
              Modern React uses functional components with hooks instead of
              class components. All examples use this pattern.
            </p>
          </Card>

          <Card>
            <h3 className="font-bold text-lg mb-2">TypeScript First</h3>
            <p className="text-gray-600 text-sm">
              Full type safety with TypeScript. Catch errors at compile time
              and get better IDE support.
            </p>
          </Card>

          <Card>
            <h3 className="font-bold text-lg mb-2">TanStack Query</h3>
            <p className="text-gray-600 text-sm">
              Server state management with automatic caching, background
              refetching, and mutations.
            </p>
          </Card>

          <Card>
            <h3 className="font-bold text-lg mb-2">Zustand</h3>
            <p className="text-gray-600 text-sm">
              Simple, fast global state management without the boilerplate
              of Redux.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
