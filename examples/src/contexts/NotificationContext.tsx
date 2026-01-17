import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';

/**
 * Notification Context with useReducer
 *
 * Modern patterns demonstrated:
 * 1. useReducer for complex state
 * 2. Action creators pattern
 * 3. Auto-dismiss notifications
 * 4. Type-safe actions with discriminated unions
 */

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
}

// Discriminated union for actions
type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' };

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    case 'CLEAR_ALL':
      return { notifications: [] };
    default:
      return state;
  }
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, 'id'>
  ) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  // Convenience methods
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
  defaultDuration?: number;
}

function NotificationProvider({
  children,
  defaultDuration = 5000,
}: NotificationProviderProps) {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
  });

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>): string => {
      const id = crypto.randomUUID();
      const duration = notification.duration ?? defaultDuration;

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { ...notification, id },
      });

      // Auto-dismiss after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    [defaultDuration, removeNotification]
  );

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // Convenience methods
  const success = useCallback(
    (message: string, title?: string) => {
      addNotification({ type: 'success', message, title });
    },
    [addNotification]
  );

  const error = useCallback(
    (message: string, title?: string) => {
      addNotification({ type: 'error', message, title });
    },
    [addNotification]
  );

  const warning = useCallback(
    (message: string, title?: string) => {
      addNotification({ type: 'warning', message, title });
    },
    [addNotification]
  );

  const info = useCallback(
    (message: string, title?: string) => {
      addNotification({ type: 'info', message, title });
    },
    [addNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        addNotification,
        removeNotification,
        clearAll,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export {
  NotificationProvider,
  useNotifications,
  type Notification,
  type NotificationType,
};
