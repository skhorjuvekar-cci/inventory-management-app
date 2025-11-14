import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layoutComponents/Sidebar';
import Footer from '../components/layoutComponents/Footer';
import TrackerContextProvider from '../context/tracker-context';

function MainLayout() {
  return (
    <TrackerContextProvider>
      <div className="flex h-screen">

        <aside className="w-64 bg-gray-800">
          <Sidebar />
        </aside>


        <div className="flex-1 flex flex-col bg-secondary">
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </TrackerContextProvider>
  );
}

export default MainLayout;
