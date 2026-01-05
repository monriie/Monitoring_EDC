import { Outlet } from "react-router"
import Navbar from "./Navbar"
import Footer from "./Footer"
import Sidebar from "./Sidebar"

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex min-h-screen mt-24 overflow-hidden">
        <Sidebar />
        <main className="flex-1 ml-20 mr-4 mb-10 md:ml-60 md:mr-8 overflow-hidden transition-all duration-300">
          <Outlet />
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default MainLayout