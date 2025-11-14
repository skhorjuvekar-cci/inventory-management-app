import { useRouteError, Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "An error occurred!";
  let message = "Something went wrong.";

  if (error.status === 500) {
    message = error.data?.message || "Internal server error occurred.";
  }

  if (error.status === 404) {
    title = "Page not found!";
    message = "The page you're looking for doesn't exist.";
  }

  if (error.status === 401 || error.status === 403) {
    title = "Unauthorized!";
    message = "You don't have permission to access this resource.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <AlertTriangle className="text-red-600" size={48} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>

        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>

        {process.env.NODE_ENV === 'development' && error.data && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 font-mono break-words">
              {JSON.stringify(error.data, null, 2)}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            <RefreshCcw size={20} />
            Go Back
          </button>

          <Link
            to="/home"
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            <Home size={20} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;