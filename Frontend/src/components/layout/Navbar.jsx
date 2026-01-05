import React from 'react'

const Navbar = () => {
  return (
    // <nav className="fixed top-0 left-0 right-0 z-50 w-full px-5 md:px-12 transition-colors duration-300 backdrop-blur-md shadow-md">
    //   <div className="w-full flex items-center py-4">
    //     {/* Logo */}
    //     <div className="flex w-full items-center justify-between gap-3">
    //         <img src="/logo-bank_sumsel.png" alt="Bank Sumsel Babel" className="w-auto h-10" />
    //         <h1 className="text-xl font-semibold text-[#00AEEF]">Sistem Monitoring Mesin EDC</h1>
    //     </div>
    //   </div>
    // </nav>
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#00AEEF] px-5 md:px-12 transition-colors duration-300">
      <div className="w-full flex items-center py-4">
        {/* Logo */}
        <div className="flex w-full items-center justify-between gap-3">
            <img src="/logo-bank_sumsel(1).png" alt="Bank Sumsel Babel" className="w-auto h-8 md:h-10" />
            <h1 className="text-sm md:text-xl font-semibold text-white">Sistem Monitoring Mesin EDC</h1>
        </div>
      </div>
    </nav>
  )
}

export default Navbar