import { useState } from "react"
import { Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import Loading from "../common/Loading"

const Login = () => {
  const { login, loading } = useAuth()
  const [form, setForm] = useState({ username: "", password: "" })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      return
    }
    await login(form.username, form.password)
  }

  return (
    <div className="w-full">
      <Card className="w-full border-0 shadow-none">
        <CardContent className="p-8">
          
          <div className="mb-8 flex justify-center">
            <img 
              src="/logo-bank_sumsel.png" 
              alt="Bank Sumsel Babel" 
              className="h-12" 
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={handleChange}
                  className="pl-10 h-11"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="pl-10 h-11"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5">
              <p className="font-semibold text-blue-900 text-xs mb-1">
                Akun Demo
              </p>
              <p className="text-blue-800 text-xs">
                Username: <span className="font-semibold">admin</span> | 
                Password: <span className="font-semibold">admin123</span>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#00AEEF] hover:bg-[#0099D6] text-white font-semibold shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loading />
                  <span>Memproses...</span>
                </div>
              ) : (
                "Masuk"
              )}
            </Button>
            
          </form>

          <p className="text-center text-xs text-gray-500 mt-8">
            © 2026 Bank Sumsel Babel. Hak Cipta Dilindungi.
          </p>
          
        </CardContent>
      </Card>
      
    </div>
  )
}

export default Login;