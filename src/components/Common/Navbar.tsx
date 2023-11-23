import {
  faBars,
  faBell,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getDownloadURL, listAll, ref } from "firebase/storage"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import {} from "react-icons/ai"
import { Link } from "react-router-dom"
import { nukt_logo } from "../../assets"
import { fileDB } from "../../config/firebase"
import { AuthContextProps, useAuthContext } from "../../contexts/AuthContext"
import { DataContextProps, useDataContext } from "../../contexts/DataContext"
import useFetchDetails from "../../hooks/useFetchDetails"
import Sidebar from "../LeftSidebar/Sidebar"
import FeedbackModal from "../Modal/FeedbackModal"
import UserSidebar from "../UserSidebar/UserSideBar"
import Searchbar from "./SearchBar"

export default function Navbar() {
  const { data, pathname } = useFetchDetails()
  const {
    showSidebar,
    sidebar,
    userSidebar,
    showUserSidebar,
    isActive,
    modal,
    setSidebar,
    setUserSidebar,
  } = useDataContext() as DataContextProps
  const { user, isAuthenticated } = useAuthContext() as AuthContextProps
  const [searchMobile, setSearchMobile] = useState(false)
  const [showSearchbar, setShowSearchbar] = useState(false)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    if (isAuthenticated && user !== null) {
      setSidebar({ type: "TOGGLE_SIDEBAR", payload: false })
      setUserSidebar({ type: "TOGGLE_USER_SIDEBAR", payload: false })
    }
  }, [isAuthenticated, pathname, setSidebar, setUserSidebar, user])

  useEffect(() => {
    const listRef = ref(fileDB, `${user?.uid}/profileImage/`)
    listAll(listRef).then((response) => {
      getDownloadURL(response.items[0]).then((url) => {
        setImageUrl(url)
      })
    })
  }, [user?.uid])

  useEffect(() => {
    if (
      !(
        pathname.includes("Movie") ||
        pathname.includes("TVSeries") ||
        pathname.includes("home/popular") ||
        pathname.includes("home/trending") ||
        pathname.includes("home/toprated")
      )
    ) {
      document.title = "Nukt"
      return
    }

    if (!(data && (data.original_name || data.original_title))) {
      return
    }

    if (pathname.includes("Movie")) {
      document.title = `Movie | ${data.original_title}`
    } else if (pathname.includes("TVSeries")) {
      document.title = `Series | ${data.original_name}`
    } else if (pathname.includes("/home/popular")) {
      document.title = `meow`
    } else if (pathname.includes("/home/trending")) {
      document.title = `Series | ${data.original_name}`
    } else if (pathname.includes("/home/toprated")) {
      document.title = `Series | ${data.original_name}`
    }
  }, [data, pathname])

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
      if (screenWidth < 640) {
        setSearchMobile(true)
      } else {
        setSearchMobile(false)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [screenWidth])

  const onClose = () => {
    setShowSearchbar(!showSearchbar)
  }

  return (
    <>
      <nav
        className={`${
          isActive || sidebar
            ? "bg-[#0A0E1730] backdrop-blur-[1px]"
            : "bg-transparent"
        } py-2 flex items-center justify-between px-5 fixed top-0 right-0 left-0 z-10 text-white`}
      >
        <div className="flex gap-5">
          {/* {pathname.includes("signup") ?? ( */}
            <button
              className={`px-[.6rem] rounded-md ${user ? "" : "hidden"}`}
              onClick={showSidebar}
              disabled={pathname.includes("signup")}
            >
              {sidebar ? (
                <FontAwesomeIcon
                  role="button"
                  icon={faXmark}
                  className="text-2xl text-white"
                />
              ) : (
                <FontAwesomeIcon
                  role="button"
                  icon={faBars}
                  className="text-2xl text-white"
                />
              )}
            </button>
        {/* //   )} */}

          {!showSearchbar && (
            <Link
              to={`/home`}
              className="flex items-center gap-2 w-max"
            >
              <img src={nukt_logo} alt="" width={35} height={41} />
              <p className="hidden font-bold text-white md:block">Nukt</p>
            </Link>
          )}
        </div>
        {!user || pathname.includes("signup") ? (
          ""
        ) : (
          <Searchbar
            searchMobile={searchMobile}
            showSearchbar={showSearchbar}
            onClose={onClose}
          />
        )}
        <div className="flex items-center gap-2">
          {user === null || pathname.includes("signup") ? (
            <Link to="/login" className="bg-[#0d0d0d50] rounded-md p-[.5rem]">
              <span className="uppercase text-[.9rem]">sign in</span>
            </Link>
          ) : (
            <>
              {screenWidth < 640 && (
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className={`${
                    showSearchbar ? "hidden" : "block"
                  } cursor-pointer`}
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="w-[22px] h-[22px]"
                    onClick={() => setShowSearchbar(!showSearchbar)}
                  />
                </motion.div>
              )}
              {!showSearchbar && (
                <FontAwesomeIcon icon={faBell} className="font-[90px]" />
              )}
              <button
                title="Profile"
                type="button"
                onClick={showUserSidebar}
                className="bg-[#0d0d0d50] rounded-full border-2 border-[#ffffff70]
                w-[40px] h-[40px] overflow-hidden"
              >
                <img
                  src={
                    imageUrl ||
                    user.photoURL ||
                    "/src/assets/profile-placeholder.svg"
                  }
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
              <UserSidebar showUserSidebar={userSidebar} />
            </>
          )}
        </div>
      </nav>
      <Sidebar />
      <FeedbackModal active={modal} />
    </>
  )
}
