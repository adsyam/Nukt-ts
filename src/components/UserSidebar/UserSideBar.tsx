import { getDownloadURL, listAll, ref } from "firebase/storage"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { fileDB } from "../../config/firebase"
import { AuthContextProps, useAuthContext } from "../../contexts/AuthContext"
import { DataContextProps, useDataContext } from "../../contexts/DataContext"
import { UserSidebarMenu } from "../../utils/index"

export default function UserSidebar({
  showUserSidebar,
}: {
  showUserSidebar: boolean
}) {
  const { user, logout } = useAuthContext() as AuthContextProps
  const { setModal } = useDataContext() as DataContextProps
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    const listRef = ref(fileDB, `${user?.uid}/profileImage/`)
    listAll(listRef).then((response) => {
      getDownloadURL(response.items[0]).then((url) => {
        setImageUrl(url)
      })
    })
  }, [user?.uid])

  const toggleModal = () => {
    setModal({ type: "SET_MODAL", payload: true })
    return (document.body.style.overflow = "hidden")
  }

  return (
    <>
      <aside
        className={`absolute h-fit text-black font-medium top-[4rem] right-[2rem]  bg-[#ffffff90] p-[1rem]
    rounded-md shadow-sm border-2 border-[#ffffff30] shadow-white ${
      showUserSidebar
        ? "origin-top-right scale-1 duration-300 ease-in-out"
        : "origin-top-right scale-0 duration-300 ease-in-out"
    }`}
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-[50px] h-[50px] rounded-full border-2 overflow-hidden">
            <img
              src={
                imageUrl ||
                user?.photoURL ||
                "/src/assets/profile-placeholder.svg"
              }
              alt="user image"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2>{user?.displayName || "Guest User"}</h2>
            <p>
              {user?.auth?.currentUser?.providerData[0]?.email ||
                "sample@email.com"}
            </p>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-3 mt-[1rem]">
          {UserSidebarMenu.map((item, index) => (
            <div key={index}>
              {item.name === "sign out" || item.name === "send feedback" ? (
                <button
                  onClick={item.name === "sign out" ? logout : toggleModal}
                  className="uppercase hover:text-[#7300FF] hover:font-bold text-start"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={index}
                  to={
                    item.name === "my profile"
                      ? `/profile/${user?.uid}`
                      : item.url
                  }
                  className="uppercase hover:text-[#7300FF] hover:font-bold"
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}
