import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { useNavigate } from "react-router-dom"
import { auth, googleProvider } from "../config/firebase"

interface AuthProviderProps {
  children: ReactNode
}

export interface AuthContextProps {
  createUser: (email: string, password: string) => Promise<UserCredential>
  signInUser: (email: string, password: string) => Promise<UserCredential>
  signInWithGoogle: () => Promise<UserCredential>
  logout: () => Promise<void>
  user: {
    providerData?: {
      providerId: string
    }[]
    displayName?: string | null
    auth?: {
      currentUser: {
        providerData: {
          email: string
        }[]
      }
    }
    uid?: string
    photoURL?: string | null
  } | null
}

const AuthContext = createContext<AuthContextProps | null>(null)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  const [loading, setLoading] = useState(true)

  const createUser = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signInUser = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false)
      setUser(currentUser || null)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      return navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        createUser,
        signInUser,
        signInWithGoogle,
        user,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

export { AuthProvider, useAuthContext }
