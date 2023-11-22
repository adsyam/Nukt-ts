import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  ReactNode,
} from "react"
import { useNavigate } from "react-router-dom"
import {
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import { auth, googleProvider } from "../config/firebase"

interface AuthProviderProps {
  children: ReactNode
}

interface AuthState {
  user: {
    uid: string
  } | null
  loading: boolean
}

type AuthAction =
  | { type: "SET_USER"; payload: { uid: string } }
  | { type: "SET_LOADING"; payload: boolean }

const initialState: AuthState = {
  user: null,
  loading: true,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: { uid: action.payload.uid },
        loading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state
  }
}

interface AuthContextProps {
  createUser: (email: string, password: string) => Promise<UserCredential>
  signInUser: (email: string, password: string) => Promise<UserCredential>
  signInWithGoogle: () => Promise<UserCredential>
  logout: () => Promise<void>
  user: {
    uid: string
  } | null
}

const AuthContext = createContext<AuthContextProps | null>(null)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(authReducer, initialState)

  const createUser = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      dispatch({ type: "SET_USER", payload: { uid: userCredential.user.uid } })
      return userCredential
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const signInUser = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      dispatch({ type: "SET_USER", payload: { uid: userCredential.user.uid } })
      return userCredential
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider)
      dispatch({ type: "SET_USER", payload: { uid: userCredential.user.uid } })
      return userCredential
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch({ type: "SET_USER", payload: { uid: currentUser?.uid || "" } })
      dispatch({ type: "SET_LOADING", payload: false })
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      dispatch({ type: "SET_USER", payload: { uid: "" } })
      navigate("/login")
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
        user: state.user,
        logout,
      }}
    >
      {!state.loading && children}
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
