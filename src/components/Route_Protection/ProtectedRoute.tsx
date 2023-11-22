import { Navigate } from "react-router-dom"
import { AuthContextProps, useAuthContext } from "../../contexts/AuthContext"
import { ReactNode } from "react"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuthContext() as AuthContextProps

  if (!user) {
    return <Navigate to="/" />
  }
  return children
}
