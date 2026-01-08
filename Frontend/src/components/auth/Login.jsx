import { useState } from "react"
import { Lock, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { Link } from "react-router"
import Loading from "../common/Loading"

export const Login = () => {
  const { login, loading } = useAuth()
  const [form, setForm] = useState({ username: "", password: "" })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      toast.error("Username dan password harus diisi")
      return
    }
    await login(form.username, form.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#00AEEF] rounded-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Login
            </CardTitle>
          </div>
          <CardDescription>
            Masuk ke Sistem Monitoring Mesin EDC
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Info Akun Demo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="font-semibold text-blue-900 mb-1">Akun Demo:</p>
              <p className="text-blue-800">Admin: admin / admin123</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#00AEEF] hover:bg-[#0099D6]"
              disabled={loading}
            >
              {loading ? (
                <Loading/>
              ) : (
                
                <p className="md:text-lg">
                  Login
                </p>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
export default Login;