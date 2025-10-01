import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, Truck } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('driver');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Mock login - In production, this would make an API call
    const userData = {
      email,
      name: email.split('@')[0],
      role,
    };

    login(userData);

    // Redirect based on role
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/driver');
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <div className="flex justify-center mb-4">
            <Truck className="h-12 w-12 text-primary" />
          </div>
          <h2 className="card-title text-center text-2xl font-bold mb-6">
            Fleet Management System
          </h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input input-bordered w-full pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Login as</span>
              </label>
              <div className="flex gap-4">
                <label className="label cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="role"
                    className="radio radio-primary"
                    value="driver"
                    checked={role === 'driver'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="label-text ml-2">Driver</span>
                </label>
                <label className="label cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="role"
                    className="radio radio-primary"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="label-text ml-2">Admin</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Sign In
            </button>
          </form>

          <div className="divider">Demo Credentials</div>
          <div className="text-sm text-center space-y-1 text-base-content/70">
            <p>Admin: admin@fleet.com / password</p>
            <p>Driver: driver@fleet.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;