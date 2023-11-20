import { Navigate } from "react-router-dom"
import { useAuthContext } from "../../contexts/AuthContext"

export default function RedirectRoute({ children }) {
  const { user } = useAuthContext()

  if (user) {
    return <Navigate to="/home" />
  } else {
    return children
  }
}
