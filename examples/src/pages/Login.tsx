import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/features';

/**
 * Login Page
 */
function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
}

export default Login;
