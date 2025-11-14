import { LayoutDashboard, IndianRupee, CreditCard, PiggyBank, LogOut as LogOutIcon, BarChart2 } from "lucide-react";
import { NavLink, Form } from "react-router-dom";
import { getAuthToken } from "../../utils/auth";

const Sidebar = () => {
    const token = getAuthToken()

    const menuItems = [
        {
            path: "/home",
            label: "Home",
            icon: LayoutDashboard,
        },
        {
            path: "/income",
            label: "Income",
            icon: IndianRupee,
        },
        {
            path: "/expenses",
            label: "Expenses",
            icon: CreditCard,
        },
        {
            path: "/savings",
            label: "Savings",
            icon: PiggyBank,
        },
        {
            path: "/report",
            label: "Report",
            icon: BarChart2,
        }
    ];

    return (
        <div className="w-64  h-full shadow-sm">
            <div className="p-6">
                <div className="text-sm text-white dark:text-dark-secondary mb-6 font-medium">Menu</div>
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${isActive
                                        ? "bg-gray-500  text-white dark:text-dark-bg shadow-md"
                                        : "text-white  hover:bg-accent1 hover:text-primary dark:hover:text-dark-primary"
                                    }`
                                }
                            >
                                <Icon size={18} />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
            {token && (
                <div className="p-6">
                    <Form action="/logout" method="post">
                        <button className="flex bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition p-3">
                            <LogOutIcon size={18} />
                            Logout
                        </button>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
