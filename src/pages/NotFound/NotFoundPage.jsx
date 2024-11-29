import { Compass } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="card-body items-center text-center space-y-6">
            {/* Animated Compass Icon */}
            <div className="avatar placeholder">
              <div className="bg-primary/10 text-primary rounded-full w-24 h-24 flex items-center justify-center">
                <Compass className="w-12 h-12 animate-pulse" />
              </div>
            </div>

            {/* 404 Title */}
            <div>
              <h1 className="text-6xl font-black text-primary tracking-tight mb-2">404</h1>
              <h2 className="text-2xl font-semibold text-base-content">Page Not Found</h2>
            </div>
            <div className="space-y-4 w-full">
              <p className="text-base-content/70 text-sm px-4">
                The page you're searching for has vanished into the digital abyss.
              </p>
              <button
                onClick={() => window.history.back()}
                className="btn btn-outline btn-primary w-full"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
