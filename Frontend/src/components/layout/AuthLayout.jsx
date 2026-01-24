import { Outlet } from "react-router"

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-full relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/bg-kantor.png')"
          }}
          role="img"
          aria-label="Bank Sumsel Babel Office Background"
        />
        
        {/* Blue Overlay with animated orbs */}
        <div className="absolute inset-0 bg-[#00AEEF]/70" />
        
        {/* Content Overlay */}
        <div className="relative h-full flex flex-col items-center justify-center text-white p-12 z-10">
          <div className="px-10 text-center space-y-6">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Monitoring Mesin EDC
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-2xl text-white/90 leading-relaxed">
              Sistem pemantauan dan manajemen mesin EDC Bank Sumsel Babel secara real-time
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-4xl flex items-center justify-center p-6 relative z-10 shadow-none">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout;