import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/services/api"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function Signup() {
  const [ngoName, setNgoName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const navigate = useNavigate()

  const handleSignup = async () => {
    setError("")
    setSuccess("")

    if (!ngoName || !email || !password) {
      setError("All fields are required")
      return
    }

    try {
      setLoading(true)
      await api.post("/auth/signup", {
        ngoName,
        email,
        password,
      })

      setSuccess("Account created successfully. Redirecting to login...")
      setTimeout(() => navigate("/login"), 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            NGO Registration
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600 border border-green-200 bg-green-50 px-3 py-2 rounded">
              {success}
            </p>
          )}

          <Input
            placeholder="NGO Name"
            value={ngoName}
            onChange={(e) => setNgoName(e.target.value)}
          />

          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Account
          </Button>

          <p className="text-sm text-center text-gray-500">
            Already registered?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
