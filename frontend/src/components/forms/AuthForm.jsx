import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigation,
} from 'react-router-dom';

function AuthForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get('mode') === 'login';
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8f5ed] to-[#ffffff] font-sans">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          {isLogin ? 'Log in' : 'Create account'}
        </h1>

        {data && !data.success && data.errors && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <ul className="list-disc list-inside space-y-1">
              {data.errors.map((err, index) => (
                <li key={index}>
                  {err.field !== 'non_field_errors' && (
                    <strong>{err.field}: </strong>
                  )}
                  {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data && data.success && data.message && (
          <p className="bg-green-100 text-green-800 p-3 rounded-lg mb-4">
            {data.message}
          </p>
        )}

        <Form method="post" className="flex flex-col gap-5">
          {!isLogin && (
            <>
              <div className="flex flex-col">
                <label htmlFor="first_name" className="mb-1 text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  required
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="last_name" className="mb-1 text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  required
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                />
              </div>
            </>
          )}

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
          </div>

          <button
            disabled={isSubmitting}
            className="bg-green-600 text-white py-2 rounded-full hover:bg-green-700 disabled:opacity-50 transition"
          >
            {isSubmitting ? 'Submitting...' : isLogin ? 'Log in' : 'Sign up'}
          </button>

          <p className="text-center text-sm mt-6 text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link
              to={`?mode=${isLogin ? 'signup' : 'login'}`}
              className="text-green-600 font-semibold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default AuthForm;