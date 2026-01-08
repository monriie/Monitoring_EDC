import React from "react"
import { Link, useLocation } from "react-router"
import {
  Home,
  LibraryBig,
  Monitor,
  ReceiptText,
  LogOut,
  User,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const Sidebar = () => {
  const location = useLocation()
  const { logout } = useAuth()
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/"},
    { icon: LibraryBig, label: "Rekap", path: "/rekap"},
    { icon: Monitor, label: "Overdue", path: "/overdue"},
    { icon: ReceiptText, label: "Sewa", path: "/sewa"},
  ]


  const isActive = (path) => location.pathname === path

  return (
    <aside className="fixed top-15.5 left-0 z-40 h-[calc(100vh-4rem)] bg-white shadow-sm w-16 md:w-52 transition-all duration-300">
      <nav className="flex flex-col h-full py-6 justify-between">
        {/* Menu Items */}
        <ul className="space-y-1 md:space-y-2 px-2 md:pl-8 md:pr-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <li key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg 
                    transition-all duration-200 relative
                    ${active
                      ? "bg-[#E6F6FC] text-[#00AEEF]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  {/* Icon Container */}
                  <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
                    <Icon
                      className={`w-5 h-5 md:w-6 md:h-6 shrink-0 transition-colors
                        ${active ? "text-[#00AEEF]" : "text-gray-500 group-hover:text-gray-700"}
                      `}
                    />
                  </div>

                  {/* Label - Hidden on mobile */}
                  <span className="hidden md:inline text-sm md:text-base font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>

                {/* Tooltip for mobile */}
                <div className="md:hidden absolute left-full ml-2 top-1/2 -translate-y-1/2 pointer-events-none z-50">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#00AEEF] text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#00AEEF]" />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {/* User Info & Logout */}
        <div className="px-2 md:px-4 space-y-2">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg">
            <User className="w-5 h-5 md:w-6 md:h-6" />
            <div className="hidden md:block">
              <p className="hidden md:inline text-sm md:text-base font-medium">admin</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden md:inline text-sm md:text-base font-medium">
              Logout
            </span>
          </button>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar;