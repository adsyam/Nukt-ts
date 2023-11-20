import { Navigate } from "react-router-dom"
import { useAuthContext } from "../../contexts/AuthContext"

export default function ProtectedRoute({ children }) {
  const { user } = useAuthContext()

  if (!user) {
    return <Navigate to="/" />
  }
  return children
}
