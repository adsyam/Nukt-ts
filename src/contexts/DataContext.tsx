import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { useLocation } from "react-router-dom"

interface DataProviderProps {
  children: ReactNode
}

interface DataContextProps {
  sidebar: boolean
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>
  userSidebar: boolean
  setUserSidebar: React.Dispatch<React.SetStateAction<boolean>>
  isActive: boolean
  //   setIsActive: React.Dispatch<React.SetStateAction<boolean>>
  dropDown: boolean
  //   setDropDown: React.Dispatch<React.SetStateAction<boolean>>
  modal: boolean
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  location: string
  searchParams: URLSearchParams
  showSidebar: () => void
  showUserSidebar: () => void
  handleDropDown: () => void
}

const DataContext = createContext<DataContextProps | null>(null)

const DataProvider = ({ children }: DataProviderProps) => {
  const [sidebar, setSidebar] = useState(false) //state of sidebar
  const [userSidebar, setUserSidebar] = useState(false)
  const [isActive, setIsActive] = useState(false) //state of navbar
  const [dropDown, setDropDown] = useState(false) //state of dropdown
  const [modal, setModal] = useState(false) //state of feedback modal
  const location = useLocation().pathname //get the current page location
  const searchParams = new URLSearchParams(window.location.search)

  //show sidebar if menu button is clicked
  const showSidebar = () => setSidebar(!sidebar)
  const showUserSidebar = () => setUserSidebar(!userSidebar)

  //give navbar a black bg once user scrolldown
  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 60 ? setIsActive(true) : setIsActive(false)
    })
  })

  const handleDropDown = () => {
    dropDown === false ? setDropDown(true) : setDropDown(false)
  }

  return (
    <DataContext.Provider
      value={{
        showSidebar,
        sidebar,
        setSidebar,
        userSidebar,
        showUserSidebar,
        setUserSidebar,
        isActive,
        location,
        dropDown,
        handleDropDown,
        searchParams,
        modal,
        setModal,
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

export { useDataContext, DataProvider, DataContext }
