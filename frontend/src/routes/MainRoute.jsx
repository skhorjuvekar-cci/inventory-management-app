import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "../layout/AuthLayout";
import MainLayout from "../layout/MainLayout";
import ErrorPage from "../pages/Error"; // Import ErrorPage

import HomePage from "../pages/Home";
//import HomePage, { loader as homeLoader } from "../pages/Home";
import AuthenticationPage, { action as authAction } from "../pages/Authentication";
import { tokenLoader, checkAuthLoader } from "../utils/auth";
import { action as logoutAction } from "../pages/Logout";
import IncomePage, { loader as incomeLoader } from "../pages/Income";
import ExpensesPage, { loader as expensesLoader } from "../pages/Expenses";
import SavingPage, { loader as savingLoader } from "../pages/Saving";
import ReportPage from '../pages/Report';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth?mode=login" replace />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    loader: checkAuthLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <AuthenticationPage />,
        action: authAction,
      },
    ],
  },

  {
    path: "/",
    // element: <MainLayout />,
    loader: tokenLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "home",
        //loader: homeLoader,
        element: <HomePage />,
      },
      {
        path: "income",
        loader: incomeLoader,
        element: <IncomePage />,
      },
      {
        path: "expenses",
        loader: expensesLoader,
        element: <ExpensesPage />,
      },
      {
        path: "savings",
        loader: savingLoader,
        element: <SavingPage />,
      },
      {
        path: "report",
        //loader: homeLoader,
        element: <ReportPage />,
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;









// import { createBrowserRouter, Navigate } from "react-router-dom";

// import AuthLayout from "../layout/AuthLayout";
// import MainLayout from "../layout/MainLayout";
// import ErrorPage from "../pages/Error"; // Import ErrorPage

// import HomePage from "../pages/Home";
// //import HomePage, { loader as homeLoader } from "../pages/Home";
// import AuthenticationPage, { action as authAction } from "../pages/Authentication";
// import { tokenLoader, checkAuthLoader } from "../utils/auth";
// import { action as logoutAction } from "../pages/Logout";
// import IncomePage, { loader as incomeLoader } from "../pages/Income";
// import ExpensesPage, { loader as expensesLoader } from "../pages/Expenses";
// import SavingPage, { loader as savingLoader } from "../pages/Saving";
// import ReportPage from '../pages/Report';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Navigate to="/auth?mode=login" replace />,
//     errorElement: <ErrorPage />,
//   },

//   {
//     path: "/auth",
//     element: <AuthLayout />,
//     loader: checkAuthLoader,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         index: true,
//         element: <AuthenticationPage />,
//         action: authAction,
//       },
//     ],
//   },

//   {
//     path: "/",
//     // element: <MainLayout />,
//     loader: tokenLoader,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         path: "home",
//         //loader: homeLoader,
//         element: <HomePage />,
//       },
//       {
//         path: "income",
//         loader: incomeLoader,
//         element: <IncomePage />,
//       },
//       {
//         path: "expenses",
//         loader: expensesLoader,
//         element: <ExpensesPage />,
//       },
//       {
//         path: "savings",
//         loader: savingLoader,
//         element: <SavingPage />,
//       },
//       {
//         path: "report",
//         //loader: homeLoader,
//         element: <ReportPage />,
//       },
//       {
//         path: "logout",
//         action: logoutAction,
//       },
//     ],
//   },

//   {
//     path: "*",
//     element: <ErrorPage />,
//   },
// ]);

// export default router;