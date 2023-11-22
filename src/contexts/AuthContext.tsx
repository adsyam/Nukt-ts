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
    displayName?: string
    auth?: {
      currentUser: {
        providerData: {
          email: string
        }[]
      }
    }
    uid?: string
    photoURL?: string
  } | null
  isAuthenticated: boolean | null
}

const AuthContext = createContext<AuthContextProps | null>(null)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<{
    providerData?: { providerId: string }[] | undefined
    displayName?: string | undefined
    auth?: { currentUser: { providerData: { email: string }[] } } | undefined
    uid?: string | undefined
    photoURL?: string | undefined
  } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setLoading(false)
      if (currentUser !== null) {
        setUser({
          ...currentUser,
          displayName: currentUser.displayName ?? undefined,
          photoURL: currentUser.photoURL ?? undefined,
        })
        setIsAuthenticated(!!currentUser)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      return navigate("/login")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        createUser,
        signInUser,
        signInWithGoogle,
        user,
        isAuthenticated,
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
