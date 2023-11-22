import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react"
import { useLocation } from "react-router-dom"

interface DataProviderProps {
  children: ReactNode
}

type Action =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "TOGGLE_USER_SIDEBAR" }
  | { type: "SET_IS_ACTIVE"; payload: boolean }
  | { type: "TOGGLE_DROPDOWN" }
  | { type: "SET_MODAL"; payload: boolean }

export interface DataContextProps {
  showSidebar: () => void
  setSidebar: Dispatch<Action>
  showUserSidebar: () => void
  setUserSidebar: Dispatch<Action>
  handleDropDown: () => void
  isActive: boolean
  modal: boolean
  setModal: Dispatch<Action>
  location: string
  searchParams: URLSearchParams
  sidebar: boolean
}

interface State {
  sidebar: boolean
  userSidebar: boolean
  active: boolean
  dropDown: boolean
  modal: boolean
  location: string
  searchParams: URLSearchParams
}

const initialState: State = {
  sidebar: false,
  userSidebar: false,
  active: false,
  dropDown: false,
  modal: false,
  location: "",
  searchParams: new URLSearchParams(""),
}

const dataReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebar: !state.sidebar }
    case "TOGGLE_USER_SIDEBAR":
      return { ...state, userSidebar: !state.userSidebar }
    case "SET_IS_ACTIVE":
      return { ...state, active: action.payload }
    case "TOGGLE_DROPDOWN":
      return { ...state, dropDown: !state.dropDown }
    case "SET_MODAL":
      return { ...state, modal: action.payload }
    default:
      return state
  }
}

const DataContext = createContext<DataContextProps | null>(null)

const DataProvider = ({ children }: DataProviderProps) => {
  const [state, dispatch] = useReducer(dataReducer, initialState)
  const location = useLocation().pathname

  useEffect(() => {
    const handleScroll = () => {
      dispatch({
        type: "SET_IS_ACTIVE",
        payload: window.scrollY > 60,
      })
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const showSidebar = () => dispatch({ type: "TOGGLE_SIDEBAR" })
  const showUserSidebar = () => dispatch({ type: "TOGGLE_USER_SIDEBAR" })
  const handleDropDown = () => dispatch({ type: "TOGGLE_DROPDOWN" })

  return (
    <DataContext.Provider
      value={{
        ...state,
        location,
        showSidebar,
        setSidebar: dispatch,
        showUserSidebar,
        setUserSidebar: dispatch,
        handleDropDown,
        isActive: state.active,
        modal: state.modal,
        setModal: dispatch,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

function useDataContext() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider")
  }
  return context
}

export { DataContext, DataProvider, useDataContext }
