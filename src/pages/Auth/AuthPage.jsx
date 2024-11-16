import { useState } from 'react';
import { useSelector } from 'react-redux';
import LoginForm from '../../features/auth/components/LoginForm';
import SignupForm from '../../features/auth/components/SignupForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // If authenticated, redirect or display a message
  if (isAuthenticated) {
    return <div>You are already logged in!</div>;
  }

  return (
    <div className="auth-page">
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

      {isLogin ? <LoginForm /> : <SignupForm />}

      <p>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign up' : 'Login'}</button>
      </p>
    </div>
  );
};

export default AuthPage;
