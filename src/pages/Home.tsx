import { useEffect } from "react"
import {
  Carousel,
  Footer,
  Popular,
  TopRated,
  Trending,
  VideoFeed,
} from "../components"
import { AuthContextProps, useAuthContext } from "../contexts/AuthContext"
import { DBContextProps, useDBContext } from "../contexts/DBContext"
import { DataContextProps, useDataContext } from "../contexts/DataContext"
// import PopularMovie from "../components/Popular"

export default function Home() {
  const { sidebar } = useDataContext() as DataContextProps
  const { user } = useAuthContext() as AuthContextProps
  const { addUser } = useDBContext() as DBContextProps

  useEffect(() => {
    const addUserData = async () => {
      try {
        if (user?.providerData !== undefined) {
          if (user?.providerData[0].providerId === "google.com") {
            await addUser(
              String(user?.uid),
              String(user?.displayName),
              String(user?.auth?.currentUser?.providerData[0]?.email)
            )
          }
        } else {
          await addUser(user?.uid ?? "", user?.displayName ?? "", "")
        }
      } catch (err) {
        console.log("[HOME]Error adding user data: ", err)
      }
    }

    addUserData()
  }, [
    addUser,
    user?.auth?.currentUser?.providerData,
    user?.displayName,
    user?.providerData,
    user?.uid,
  ])

  return (
    <div className="overflow-x-hidden">
      <Carousel mediaType={""} />
      <div>
        <div
          className={`${
            sidebar
              ? "translate-x-[10rem] origin-left duration-300 w-[95%]"
              : "w-full origin-right duration-300"
          }`}
        >
          <Popular />
          <Trending />
          <TopRated />
        </div>
        <VideoFeed />
      </div>
      <Footer />
    </div>
  )
}
