# Modern React with TypeScript - Enterprise Learning Guide

> **Last Updated**: January 2026
> **React Version**: 18.x / 19.x
> **Focus**: Functional Components, Hooks, TypeScript, Production-Ready Patterns

## What This Guide Covers

This is a comprehensive guide to learning **modern React** with TypeScript. We focus exclusively on current best practices - no class components, no deprecated lifecycle methods, no legacy patterns.

---

## Table of Contents

1. [Core Concepts You Must Know](#core-concepts-you-must-know)
2. [Project Setup (Vite, NOT CRA)](#project-setup)
3. [TypeScript Essentials for React](#typescript-essentials-for-react)
4. [Components & Props](#components--props)
5. [Essential Hooks](#essential-hooks)
6. [State Management](#state-management)
7. [Data Fetching](#data-fetching)
8. [Routing](#routing)
9. [Forms](#forms)
10. [Testing](#testing)
11. [Enterprise Patterns](#enterprise-patterns)
12. [Performance Optimization](#performance-optimization)
13. [Deployment](#deployment)

---

## Core Concepts You Must Know

### What's Deprecated/Legacy (AVOID These)

| ❌ Legacy Pattern | ✅ Modern Alternative |
|-------------------|----------------------|
| Class Components | Functional Components |
| `componentDidMount`, `componentDidUpdate` | `useEffect` hook |
| `this.state`, `this.setState` | `useState` hook |
| Higher-Order Components (HOCs) | Custom Hooks |
| Render Props (mostly) | Custom Hooks |
| Create React App (CRA) | Vite or Next.js |
| Redux with connect() | Redux Toolkit or Zustand/Jotai |
| PropTypes | TypeScript |
| `defaultProps` | Default parameters |
| `forwardRef` (React 19+) | Direct ref prop |
| `React.FC` type | Direct function typing |

### Modern React Philosophy

1. **Functional Components Only** - Class components are legacy
2. **Hooks for Everything** - State, effects, context, refs
3. **TypeScript First** - Type safety is essential for enterprise
4. **Composition Over Inheritance** - Small, reusable components
5. **Colocation** - Keep related code together
6. **Server Components** - The future with Next.js App Router

---

## Project Setup

### Use Vite (NOT Create React App)

Create React App is no longer recommended by the React team. Use **Vite** for new projects:

```bash
# Create a new React + TypeScript project
npm create vite@latest my-app -- --template react-ts

# Navigate and install
cd my-app
npm install

# Start development server
npm run dev
```

### Or Use a Framework (Recommended for Production)

For production apps, the React team recommends using a framework:

```bash
# Next.js (Most Popular - Full-stack React)
npx create-next-app@latest my-app --typescript --tailwind --app

# Remix (Full-stack with great data loading)
npx create-remix@latest my-app

# TanStack Start (New, modern alternative)
# Check tanstack.com for latest setup
```

### Recommended Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   └── features/       # Feature-specific components
├── hooks/              # Custom hooks
├── lib/                # Utilities, helpers, configs
├── services/           # API calls, external services
├── stores/             # State management (if using Zustand/Jotai)
├── types/              # TypeScript types/interfaces
├── app/ or pages/      # Routes (if using Next.js)
└── main.tsx            # Entry point
```

---

## TypeScript Essentials for React

### Typing Components (Modern Way)

```tsx
// ✅ Modern: Direct function typing (preferred)
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}

// ❌ Avoid: React.FC (adds implicit children, causes issues)
// const Button: React.FC<ButtonProps> = ({ label }) => { ... }
```

### Typing Children

```tsx
import { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;  // Use ReactNode for children
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### Typing Events

```tsx
function Form() {
  // Input change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  // Form submit event
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle submit
  };

  // Click event
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('clicked');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

### Typing Hooks

```tsx
import { useState, useRef, useEffect } from 'react';

function Example() {
  // useState - inferred or explicit
  const [count, setCount] = useState(0);  // inferred as number
  const [user, setUser] = useState<User | null>(null);  // explicit for complex types

  // useRef
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

---

## Components & Props

### Basic Component Pattern

```tsx
interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onEdit: (id: string) => void;
  isEditable?: boolean;
}

function UserProfile({ user, onEdit, isEditable = true }: UserProfileProps) {
  return (
    <div className="user-profile">
      <img src={user.avatar ?? '/default-avatar.png'} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {isEditable && (
        <button onClick={() => onEdit(user.id)}>Edit</button>
      )}
    </div>
  );
}
```

### Component Composition

```tsx
// Compound components pattern
interface TabsProps {
  children: ReactNode;
  defaultTab?: string;
}

interface TabProps {
  id: string;
  label: string;
  children: ReactNode;
}

function Tabs({ children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function Tab({ id, label, children }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext();

  if (activeTab !== id) return null;
  return <div>{children}</div>;
}

// Usage
<Tabs defaultTab="profile">
  <Tab id="profile" label="Profile">Profile content</Tab>
  <Tab id="settings" label="Settings">Settings content</Tab>
</Tabs>
```

---

## Essential Hooks

### useState - Managing State

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  // Direct update
  const increment = () => setCount(count + 1);

  // Functional update (preferred when depending on previous state)
  const incrementSafe = () => setCount(prev => prev + 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementSafe}>+</button>
    </div>
  );
}
```

### useEffect - Side Effects

```tsx
function UserData({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Effect runs when userId changes
    let cancelled = false;

    async function fetchUser() {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        if (!cancelled) {
          setUser(data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    // Cleanup function - runs on unmount or before next effect
    return () => {
      cancelled = true;
    };
  }, [userId]);  // Dependency array - effect runs when these change

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  return <div>{user.name}</div>;
}
```

### useContext - Sharing State

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Create context with type
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// 2. Create custom hook for consuming context
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 3. Create provider component
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Use in components
function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={theme}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'}
      </button>
    </header>
  );
}
```

### useReducer - Complex State

```tsx
import { useReducer } from 'react';

interface State {
  items: CartItem[];
  total: number;
}

type Action =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        items: [...state.items, action.payload],
        total: state.total + action.payload.price,
      };
    case 'REMOVE_ITEM':
      const item = state.items.find(i => i.id === action.payload);
      return {
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - (item?.price ?? 0),
      };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
}

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  return (
    <div>
      <p>Total: ${state.total}</p>
      {state.items.map(item => (
        <div key={item.id}>
          {item.name} - ${item.price}
          <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

### useRef - References & Mutable Values

```tsx
import { useRef, useEffect } from 'react';

function VideoPlayer({ src }: { src: string }) {
  // DOM reference
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mutable value that persists across renders (doesn't trigger re-render)
  const playCountRef = useRef(0);

  const handlePlay = () => {
    videoRef.current?.play();
    playCountRef.current += 1;
    console.log(`Played ${playCountRef.current} times`);
  };

  return (
    <div>
      <video ref={videoRef} src={src} />
      <button onClick={handlePlay}>Play</button>
    </div>
  );
}
```

### useMemo & useCallback - Performance

```tsx
import { useMemo, useCallback, useState } from 'react';

function ExpensiveList({ items, filter }: { items: Item[]; filter: string }) {
  // useMemo - memoize expensive calculations
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);  // Only recalculate when items or filter change

  // useCallback - memoize functions (for passing to child components)
  const handleItemClick = useCallback((id: string) => {
    console.log('Clicked:', id);
  }, []);  // Empty deps = function never changes

  return (
    <ul>
      {filteredItems.map(item => (
        <ListItem
          key={item.id}
          item={item}
          onClick={handleItemClick}  // Won't cause unnecessary re-renders
        />
      ))}
    </ul>
  );
}
```

### Custom Hooks - Reusable Logic

```tsx
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <select value={theme} onChange={e => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
```

```tsx
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      // Fetch search results
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

---

## State Management

### When to Use What

| Scenario | Solution |
|----------|----------|
| Local component state | `useState` |
| Complex local state | `useReducer` |
| Shared UI state (theme, modals) | Context + `useState` |
| Server state (API data) | TanStack Query (React Query) |
| Global client state | Zustand or Jotai |
| Complex global state | Redux Toolkit (if needed) |

### TanStack Query (React Query) - Server State

This is the **#1 recommended solution** for handling API data:

```tsx
// Setup - main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

```tsx
// Usage - fetching data
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

// Mutations
function CreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newUser: CreateUserDTO) =>
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = (data: CreateUserDTO) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

### Zustand - Simple Global State

```tsx
// stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);

// Usage in components
function Header() {
  const { user, logout } = useAuthStore();

  if (!user) return <LoginButton />;

  return (
    <div>
      <span>Welcome, {user.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Data Fetching

### Modern Patterns

```tsx
// services/api.ts
const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export async function createUser(data: CreateUserDTO): Promise<User> {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  return response.json();
}
```

```tsx
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, createUser } from '@/services/api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,  // Consider data fresh for 5 minutes
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

---

## Routing

### React Router v6+ (Client-Side)

```tsx
// main.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'users', element: <Users /> },
      { path: 'users/:id', element: <UserDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

```tsx
// components/Layout.tsx
import { Outlet, Link, NavLink } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          Home
        </NavLink>
        <NavLink to="/users">Users</NavLink>
      </nav>
      <main>
        <Outlet />  {/* Child routes render here */}
      </main>
    </div>
  );
}
```

```tsx
// pages/UserDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleDelete = async () => {
    await deleteUser(id!);
    navigate('/users');
  };

  return (
    <div>
      <h1>User {id}</h1>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}
```

---

## Forms

### React Hook Form (Recommended)

```tsx
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema with Zod
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18'),
});

type UserFormData = z.infer<typeof userSchema>;

function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<UserFormData> = async (data) => {
    await createUser(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...register('name')} />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && <span className="error">{errors.age.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

---

## Testing

### Vitest + React Testing Library

```tsx
// components/__tests__/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Click me" onClick={() => {}} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

```tsx
// Testing hooks
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../hooks/useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

---

## Enterprise Patterns

### Error Boundaries

```tsx
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Send to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Note: Error boundaries must be class components (React limitation)
// Wrap your app or specific sections
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Suspense for Loading States

```tsx
import { Suspense, lazy } from 'react';

// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

### Authentication Pattern

```tsx
// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuth().then(setUser).finally(() => setIsLoading(false));
  }, []);

  const login = async (credentials: Credentials) => {
    const user = await loginAPI(credentials);
    setUser(user);
  };

  const logout = async () => {
    await logoutAPI();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected Route component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

### API Layer with Type Safety

```tsx
// lib/api-client.ts
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${import.meta.env.VITE_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new APIError(response.status, `API Error: ${response.statusText}`);
  }

  return response.json();
}

// Type-safe API functions
export const api = {
  users: {
    list: () => apiClient<User[]>('/users'),
    get: (id: string) => apiClient<User>(`/users/${id}`),
    create: (data: CreateUserDTO) =>
      apiClient<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: UpdateUserDTO) =>
      apiClient<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiClient<void>(`/users/${id}`, { method: 'DELETE' }),
  },
};
```

---

## Performance Optimization

### React.memo for Component Memoization

```tsx
import { memo } from 'react';

interface ListItemProps {
  item: Item;
  onSelect: (id: string) => void;
}

// Only re-renders if props change
const ListItem = memo(function ListItem({ item, onSelect }: ListItemProps) {
  console.log(`Rendering item ${item.id}`);
  return (
    <li onClick={() => onSelect(item.id)}>
      {item.name}
    </li>
  );
});
```

### Virtualization for Long Lists

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,  // Estimated row height
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualItem.size,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Code Splitting

```tsx
import { lazy, Suspense } from 'react';

// Split by route
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Split by feature
const HeavyChart = lazy(() => import('./components/HeavyChart'));

// Named exports
const AdminPanel = lazy(() =>
  import('./pages/Admin').then(module => ({ default: module.AdminPanel }))
);
```

---

## Deployment

### Environment Variables

```bash
# .env.local (local development - not committed)
VITE_API_URL=http://localhost:3001

# .env.production (production)
VITE_API_URL=https://api.example.com
```

```tsx
// Access in code
const apiUrl = import.meta.env.VITE_API_URL;
```

### Build for Production

```bash
# Build
npm run build

# Preview production build locally
npm run preview
```

### Recommended Hosting

1. **Vercel** - Best for Next.js, great for any React app
2. **Netlify** - Easy static site hosting
3. **Cloudflare Pages** - Fast global CDN
4. **AWS Amplify** - Full AWS integration

---

## Essential Libraries

| Category | Library | Purpose |
|----------|---------|---------|
| Data Fetching | TanStack Query | Server state management |
| Forms | React Hook Form + Zod | Form handling & validation |
| Routing | React Router v6 / TanStack Router | Client-side routing |
| State | Zustand | Simple global state |
| Styling | Tailwind CSS | Utility-first CSS |
| UI Components | shadcn/ui | Beautiful, accessible components |
| Testing | Vitest + React Testing Library | Unit & integration tests |
| E2E Testing | Playwright | End-to-end tests |

---

## Next Steps

1. **Set up a project** using Vite or Next.js
2. **Build a simple CRUD app** to practice
3. **Add authentication** using the patterns above
4. **Implement testing** from the start
5. **Deploy to production** on Vercel or similar

See the `examples/` directory for complete, working code examples.
