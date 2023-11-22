import { useRef, useState } from "react"
import { AuthContextProps, useAuthContext } from "../../contexts/AuthContext"
import { DBContextProps, useDBContext } from "../../contexts/DBContext"

interface UploadVideoModalProps {
  showModal: boolean
  onClose: () => void
}

const UploadVideoModal = ({ showModal, onClose }: UploadVideoModalProps) => {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [tags, setTags] = useState("")
  const [video, setVideo] = useState<File | null>()
  const [thumbnail, setThumbnail] = useState<File | null>()
  const [status, setStatus] = useState(false)
  const videoRef = useRef(null)
  const imageRef = useRef(null)
  const { user } = useAuthContext() as AuthContextProps
  const { addVideo } = useDBContext() as DBContextProps

  const handleUpload = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (video instanceof File && thumbnail instanceof File) {
      addVideo(String(user?.uid), title, desc, tags, video, thumbnail, status)
      onClose()
    } else {
      console.error("Please select both video and thumbnail files")
    }
  }

  if (!showModal) return
  return (
    <div
      className="fixed left-0 w-full h-[200vh] bg-black/50 z-[999999] overflow-y-hidden
        grid place-items-center backdrop-blur-[2px]"
    >
      <form
        className="bg-black w-[400px] md:w-[600px] h-[600px] shadow-sm shadow-white/40
        p-4 rounded-md flex flex-col gap-5"
      >
        <div className="flex justify-between items-center">
          <h2>Upload a video</h2>
          <button onClick={onClose}>close</button>
        </div>
        <div className="flex flex-col justify-start w-full">
          <label className="w-max">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="my first react video"
            className="text-black p-2"
          />
        </div>
        <div className="flex flex-col justify-start w-full">
          <label className="w-max">Description:</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe your video"
            rows={5}
            className="resize-none text-black pl-2"
          />
        </div>
        <div className="flex flex-col justify-start w-full">
          <label className="w-max">Tags:</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="coding,react,javascript"
            className="text-black p-2"
          />
        </div>
        <div className="flex justify-start items-center gap-4 w-full">
          <div className="flex flex-col justify-center items-start gap-2">
            <label htmlFor="">Add video file</label>
            <input
              type="file"
              ref={videoRef}
              onChange={(e) =>
                setVideo(e.target.files ? e.target.files[0] : null)
              }
              className="w-max cursor-pointer"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <label htmlFor="">Add image thumbnail</label>
            <input
              type="file"
              ref={imageRef}
              onChange={(e) =>
                setThumbnail(e.target.files ? e.target.files[0] : null)
              }
              className="w-max cursor-pointer"
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
            className="cursor-pointer"
          />
          <label>Private</label>
        </div>
        <button
          onClick={(e) => handleUpload(e)}
          className="w-max mx-auto px-5 py-1 bg-white/40 text-lg font-medium rounded-md"
        >
          Upload
        </button>
      </form>
    </div>
  )
}

export default UploadVideoModal
