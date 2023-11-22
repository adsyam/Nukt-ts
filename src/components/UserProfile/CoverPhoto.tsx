import { getDownloadURL, listAll, ref } from "firebase/storage"
import { useEffect, useRef, useState } from "react"
import { AiOutlineCamera } from "react-icons/ai"

import { useParams } from "react-router"
import { fileDB } from "../../config/firebase"
import { AuthContextProps, useAuthContext } from "../../contexts/AuthContext"
import { DBContextProps, useDBContext } from "../../contexts/DBContext"

export default function CoverPhoto({ isUser }: { isUser: boolean }) {
  const { id } = useParams()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [image, setImage] = useState<string>()
  const [reload, setReload] = useState(false)
  const { user } = useAuthContext() as AuthContextProps
  const { addImage } = useDBContext() as DBContextProps

  useEffect(() => {
    if (isUser) {
      const listRef = ref(fileDB, `${id}/coverImage/`)
      listAll(listRef).then((response) => {
        getDownloadURL(response.items[0]).then((url) => {
          setImage(url)
        })
      })
    }
  }, [image, id, isUser])

  const handleImageUpload = () => {
    inputRef.current?.click()
  }

  const handleChange = (input: File | null) => {
    if (input !== null) {
      addImage(String(user?.uid), "coverImage", input)
      setTimeout(() => {
        setReload(!reload)
      }, 1000)
    }
  }

  return (
    <div className="w-full relative">
      <img
        src={
          isUser
            ? image || "https://source.unsplash.com/random/landscape?sunset"
            : `https://source.unsplash.com/random/landscape?sunset`
        }
        alt=""
        className="w-full h-[60vh] object-cover"
      />
      {id === user?.uid && (
        <div
          role="button"
          onClick={handleImageUpload}
          className="absolute right-5 bottom-5 flex gap-2 items-center bg-[#0d0d0d50] p-[.3rem] rounded-md cursor-pointer
         hover:bg-white hover:text-black duration-300"
        >
          <AiOutlineCamera size={30} />{" "}
          <span className="capitalize hidden md:block">
            change your cover photo
          </span>
          <input
            type="file"
            ref={inputRef}
            onChange={(e) => handleChange(e.target.files ? e.target.files[0] : null)}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}
