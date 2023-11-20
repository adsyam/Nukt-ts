import { Outlet } from "react-router"
import { AuthProvider } from "./contexts/AuthContext"
import { DBProvider } from "./contexts/DBContext"
import { DataProvider } from "./contexts/DataContext"
import { Navbar } from "./components"

export default function AppLayout() {
  return (
    <>
      <AuthProvider>
        <DBProvider>
          <DataProvider>
            <Navbar />
            <Outlet />
          </DataProvider>
        </DBProvider>
      </AuthProvider>
    </>
  )
}
