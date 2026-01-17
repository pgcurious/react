# Modern React Quick Reference (2024-2026)

A cheat sheet for modern React with TypeScript patterns.

## Components

```tsx
// ✅ Modern: Direct function with typed props
interface Props {
  title: string;
  count?: number;
  children: ReactNode;
}

function MyComponent({ title, count = 0, children }: Props) {
  return <div>{title}: {count} - {children}</div>;
}

// ❌ Avoid: React.FC (legacy pattern)
const MyComponent: React.FC<Props> = ({ title }) => { ... }
```

## Hooks Quick Reference

### useState
```tsx
const [value, setValue] = useState<string>('');
const [user, setUser] = useState<User | null>(null);

// Functional update (when depending on previous state)
setValue(prev => prev + 1);
```

### useEffect
```tsx
useEffect(() => {
  // Run on mount and when deps change
  const subscription = subscribe();

  return () => {
    // Cleanup on unmount or before re-run
    subscription.unsubscribe();
  };
}, [dependency1, dependency2]);
```

### useContext
```tsx
// Create
const MyContext = createContext<ContextType | null>(null);

// Custom hook (always include null check)
function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('Must use within Provider');
  return context;
}

// Provide
<MyContext.Provider value={value}>{children}</MyContext.Provider>
```

### useReducer
```tsx
type Action =
  | { type: 'increment' }
  | { type: 'set'; payload: number };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'set': return action.payload;
    default: return state;
  }
}

const [state, dispatch] = useReducer(reducer, 0);
dispatch({ type: 'increment' });
```

### useRef
```tsx
// DOM reference
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();

// Mutable value (no re-render on change)
const countRef = useRef(0);
countRef.current += 1;
```

### useMemo & useCallback
```tsx
// Memoize expensive calculation
const filtered = useMemo(() =>
  items.filter(i => i.active),
  [items]
);

// Memoize function (for passing to children)
const handleClick = useCallback((id: string) => {
  console.log(id);
}, []);
```

### useId (React 18+)
```tsx
// Generate unique IDs for accessibility
const id = useId();
<label htmlFor={id}>Name</label>
<input id={id} />
```

## Event Types

```tsx
// Common event types
onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
```

## TanStack Query (React Query)

```tsx
// Query - fetching data
const { data, isLoading, error } = useQuery({
  queryKey: ['users', id],
  queryFn: () => fetchUser(id),
  staleTime: 5 * 60 * 1000,
});

// Mutation - changing data
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
mutation.mutate(newUser);
```

## Zustand (State Management)

```tsx
// Create store
const useStore = create<State>()((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));

// Use in component
const count = useStore((s) => s.count);
const increment = useStore((s) => s.increment);
```

## React Hook Form + Zod

```tsx
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});

<input {...register('email')} />
{errors.email && <span>{errors.email.message}</span>}
```

## React Router v6

```tsx
// Setup
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users/:id" element={<User />} />
  </Routes>
</BrowserRouter>

// Navigation
const navigate = useNavigate();
navigate('/home');
navigate(-1); // go back

// Params
const { id } = useParams<{ id: string }>();
```

## File Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI (Button, Input, etc.)
│   └── features/     # Feature components
├── hooks/            # Custom hooks
├── stores/           # Zustand stores
├── contexts/         # React contexts
├── services/         # API functions
├── types/            # TypeScript types
├── lib/              # Utilities
└── pages/            # Route pages
```

## What to Avoid (Deprecated/Legacy)

| ❌ Don't Use | ✅ Use Instead |
|--------------|----------------|
| Class components | Functional components |
| componentDidMount | useEffect |
| this.state, setState | useState |
| PropTypes | TypeScript |
| defaultProps | Default parameters |
| React.FC | Direct function typing |
| Create React App | Vite or Next.js |
| HOCs (mostly) | Custom hooks |
| Redux connect() | Redux Toolkit + hooks |
| forwardRef (React 19+) | Direct ref prop |

## Essential Libraries

| Purpose | Library |
|---------|---------|
| Data Fetching | TanStack Query |
| Forms | React Hook Form + Zod |
| Routing | React Router v6 |
| State | Zustand or Jotai |
| Styling | Tailwind CSS |
| UI | shadcn/ui |
| Testing | Vitest + Testing Library |
