import { Link } from "wouter";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/dashboard">
          <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6B4226] hover:bg-[#5A371F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226]">
            Go to Dashboard
          </a>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;