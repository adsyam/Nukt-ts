import { getDownloadURL, listAll, ref } from "firebase/storage"
import { useEffect, useRef, useState } from "react"
import { AiOutlineCamera } from "react-icons/ai"

import { useParams } from "react-router"
import { fileDB } from "../../config/firebase"
import { AuthContextProps, useAuthContext } from "../../contexts/AuthContext"
import { DBContextProps, useDBContext } from "../../contexts/DBContext"

export default function ProfilePic({ image, isUser }: { image: string; isUser: boolean }) {
  const { id } = useParams()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { user } = useAuthContext() as AuthContextProps
  const { addImage } = useDBContext() as DBContextProps

  const [imageUrl, setImageUrl] = useState<string>()
  const [reload, setReload] = useState(false)

  useEffect(() => {
    if (isUser) {
      const listRef = ref(fileDB, `${id}/profileImage/`)
      listAll(listRef).then((response) => {
        getDownloadURL(response.items[0]).then((url) => {
          setImageUrl(url)
        })
      })
    }
  }, [isUser, id, imageUrl])

  const handleImageUpload = () => {
    inputRef.current?.click()
  }

  const handleChange = (input: File | null) => {
    if (input !== null) {
      addImage(String(user?.uid), "profileImage", input)
      setTimeout(() => {
        setReload(!reload)
      }, 1000)
    }
  }

  return (
    <div
      className="rounded-full w-[130px] h-[130px] md:w-[13rem] md:h-[13rem] border-2 
      border-white relative translate-x-[3rem] -translate-y-[3rem] md:-translate-y-[7rem]"
    >
      <img
        src={
          isUser
            ? imageUrl ||
              user?.photoURL ||
              "../../assets/profile-placeholder.svg"
            : image || "../../assets/profile-placeholder.svg"
        }
        alt="user profile pic"
        className="rounded-full w-full h-full object-cover"
      />
      {id === user?.uid && (
        <div
          role="button"
          onClick={handleImageUpload}
          className="absolute -right-2 md:right-0 bottom-0 md:bottom-5 bg-[#0d0d0d]/50 p-[.3rem] rounded-full cursor-pointer
         hover:bg-white hover:text-black duration-300"
        >
          <AiOutlineCamera size={30} />
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleChange(e.target.files ? e.target.files[0] : null)}
          />
        </div>
      )}
    </div>
  )
}
