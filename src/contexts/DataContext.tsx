import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react"
import { useLocation } from "react-router-dom"

interface DataProviderProps {
  children: ReactNode
}

interface SidebarState {
  sidebar: boolean
}

interface UserSidebarState {
  userSidebar: boolean
}

interface ActiveState {
  isActive: boolean
}

interface DropDownState {
  dropDown: boolean
}

interface ModalState {
  modal: boolean
}

type Action =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "TOGGLE_USER_SIDEBAR" }
  | { type: "SET_IS_ACTIVE"; payload: boolean }
  | { type: "TOGGLE_DROPDOWN" }
  | { type: "SET_MODAL"; payload: boolean }

interface State {
  sidebar: SidebarState
  userSidebar: UserSidebarState
  active: ActiveState
  dropDown: DropDownState
  modal: ModalState
  location: string
  searchParams: URLSearchParams
}

export interface DataContextProps extends State {
  showSidebar: () => void
  showUserSidebar: () => void
  handleDropDown: () => void
  isActive: boolean
}

const initialState: State = {
  sidebar: { sidebar: false },
  userSidebar: { userSidebar: false },
  active: { isActive: false },
  dropDown: { dropDown: false },
  modal: { modal: false },
  location: "",
  searchParams: new URLSearchParams(""),
}

const dataReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        sidebar: { sidebar: !state.sidebar.sidebar },
      }
    case "TOGGLE_USER_SIDEBAR":
      return {
        ...state,
        userSidebar: { userSidebar: !state.userSidebar.userSidebar },
      }
    case "SET_IS_ACTIVE":
      return {
        ...state,
        active: { isActive: action.payload },
      }
    case "TOGGLE_DROPDOWN":
      return {
        ...state,
        dropDown: { dropDown: !state.dropDown.dropDown },
      }
    case "SET_MODAL":
      return {
        ...state,
        modal: { modal: action.payload },
      }
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
        isActive: state.active.isActive,
        showUserSidebar,
        handleDropDown,
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
