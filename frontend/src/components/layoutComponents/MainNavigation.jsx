import { Form, NavLink, useRouteLoaderData } from 'react-router-dom';

function MainNavigation() {
  const token = useRouteLoaderData("root");

  return (
    <header className="bg-black flex justify-between items-center px-6 py-5">
        {/* Logo */}
        <h1 className="text-sm font-bold tracking-wide text-white uppercase">
          EXPENSE TRACKER <span className="font-normal">APP</span>
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-4">
            {token && (
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-5 py-1.5 rounded-full text-sm font-medium transition ${isActive
                      ? "bg-white text-black"
                      : "text-white hover:text-gray-300"
                    }`
                  }
                  end
                >
                  Home
                </NavLink>
              </li>)}



            {/* Right button */}
            {!token && (
              <li>
                <NavLink
                  to="/auth?mode=login"
                  className="ml-4 bg-green-600 text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-green-700 transition"
                >
                  Sign-up/ Log-in
                </NavLink>
              </li>
            )}
            {token && (
              <li>
                <Form action="/logout" method="post">
                  <button className="ml-4 bg-red-500 text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-red-600 transition">
                    Logout
                  </button>
                </Form>
              </li>
            )}
          </ul>
        </nav>
    </header>
  );
}

export default MainNavigation;
