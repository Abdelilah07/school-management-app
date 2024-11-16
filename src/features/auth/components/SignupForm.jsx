import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, User, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import { signup, clearError } from '../../auth/slices/authSlice';

// Password validation helper that matches the backend requirements
const validatePassword = (password) => {
  const requirements = {
    minLength: 8,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    numbers: /[0-9]/,
    specialCharacters: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const errors = [];
  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`);
  }
  if (!requirements.uppercase.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!requirements.lowercase.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!requirements.numbers.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!requirements.specialCharacters.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return errors;
};

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get auth states from Redux
  const isLoading = useSelector((state) => state.auth.status === 'loading');
  const reduxError = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    acceptTerms: false,
  });

  const [localErrors, setLocalErrors] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    errors: [],
  });

  // Clear any existing errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearError());
    return () => dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Validate password on change
  useEffect(() => {
    if (formData.password) {
      const errors = validatePassword(formData.password);
      setPasswordStrength({
        score: errors.length === 0 ? 100 : Math.max(0, 100 - errors.length * 20),
        errors,
      });
    } else {
      setPasswordStrength({ score: 0, errors: [] });
    }
  }, [formData.password]);

  const validateForm = () => {
    const errors = [];

    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (passwordStrength.errors.length > 0) {
      errors.push(...passwordStrength.errors);
    }

    if (!formData.acceptTerms) {
      errors.push('You must accept the Terms of Service and Privacy Policy');
    }

    setLocalErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErrors([]);

    if (!validateForm()) {
      return;
    }

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...signupData } = formData;
    const resultAction = await dispatch(signup(signupData));

    if (signup.fulfilled.match(resultAction)) {
      navigate('/home');
    }
  };

  // Combine local validation errors with backend errors
  const displayErrors = [...localErrors, reduxError].filter(Boolean);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center justify-center mb-2">
            Create Account
          </h2>
          <p className="text-center text-base-content/60 mb-6">Join our learning platform today</p>

          {displayErrors.length > 0 && (
            <div className="alert alert-error mb-6">
              <AlertCircle className="h-5 w-5" />
              <ul className="list-disc ml-4">
                {displayErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full pl-10"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input input-bordered w-full pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <div className="relative">
                <select
                  className="select select-bordered w-full pl-10"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="trainee">Trainee</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="w-full bg-base-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        passwordStrength.score >= 80
                          ? 'bg-success'
                          : passwordStrength.score >= 60
                            ? 'bg-warning'
                            : 'bg-error'
                      }`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                required
              />
              <span className="label-text">
                I agree to the{' '}
                <Link to="/terms" className="link link-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="link link-primary">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading || !formData.acceptTerms}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
