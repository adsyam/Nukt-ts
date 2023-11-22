import { Navigate } from "react-router-dom"
import { AuthContextProps, useAuthContext } from "../../contexts/AuthContext"
import { ReactNode } from "react"

export default function RedirectRoute({ children }: { children: ReactNode }) {
  const { user } = useAuthContext() as AuthContextProps

  if (user) {
    return <Navigate to="/home" />
  } else {
    return children
  }
}
