import { Outlet } from "react-router"
import { useContext, useMemo } from "react"

const AnimatedBackground = () => {
  // Generate posisi partikel hanya sekali
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Neon glow orbs (bioskop vibes) */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-700 rounded-full mix-blend-screen blur-3xl opacity-20 animate-blob dark:opacity-25"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen blur-3xl opacity-20 animate-blob animation-delay-2000 dark:opacity-25"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-red-600 rounded-full mix-blend-screen blur-3xl opacity-20 animate-blob animation-delay-4000 dark:opacity-25"></div>

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white dark:bg-gray-300 opacity-10"
          style={{
            width: `${p.width}px`,
            height: `${p.height}px`,
            top: `${p.top}%`,
            left: `${p.left}%`,
            animation: `float ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

const AuthLayout = () => {

  return (
    <div
      className="relative flex items-center justify-center min-h-screen 
        bg-linear-to-br from-gray-900 via-gray-950 to-black 
        dark:from-black dark:via-gray-900 dark:to-gray-950 
        text-white overflow-hidden"
    >
      <AnimatedBackground />

      {/* Auth Content (Login) */}
      <div className="relative z-10 w-full flex items-center justify-center p-4">
        <Outlet />
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -40px) scale(1.05); }
          50% { transform: translate(-30px, 30px) scale(0.95); }
          75% { transform: translate(10px, 50px) scale(1.1); }
        }

        @keyframes float {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }

        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}

export default AuthLayout;