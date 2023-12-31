import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { useLocation } from "react-router"
import { textDB } from "../../config/firebase"
import { AuthContextProps, useAuthContext } from "../../contexts/AuthContext"
import { DBContextProps, useDBContext } from "../../contexts/DBContext"
import { useFetchVideoDetail } from "../../hooks/videoHooks"
import VideoCard from "../Video_Section/VideoCard"

export default function VideoHistory() {
  const { user } = useAuthContext() as AuthContextProps
  const { updateHistoryOrLibrary } = useDBContext() as DBContextProps
  const [videoIds, setVideoIds] = useState([])
  const location = useLocation().pathname.split("/")[2]

  useEffect(() => {
    if (!user?.uid) return
    const unsubscribe = onSnapshot(
      doc(textDB, "Users", user?.uid),
      { includeMetadataChanges: true },
      (doc) => setVideoIds(doc.data()?.[location].videos)
    )

    return () => unsubscribe()
  }, [location, user?.uid])

  const videoDetails = useFetchVideoDetail(videoIds)

  if (!videoDetails) return

  const handleDelete = (videoToDelete: {
    channelId?: string | undefined
    videoId: string
  }) => {
    const newIds: string[] = [...videoIds]

    const indexToRemove = newIds.findIndex(
      (id: string) => id === videoToDelete.videoId
    )
    if (indexToRemove !== -1) {
      newIds.splice(indexToRemove, 1)
      updateHistoryOrLibrary(String(user?.uid), location, "videos", newIds)
    }
  }


  return (
    <section className="w-full min-h-max">
      {videoIds.length < 1 ? "" : <h2 className="mb-3 font-medium">Videos</h2>}
      <div className="w-full flex items-center gap-5 flex-wrap relative">
        {videoDetails.map((video, index) => (
          <div key={video?.id.videoId} className="relative group">
            <VideoCard key={index} item={video} />
            <button
              onClick={() => handleDelete(video?.id)}
              className="absolute top-0 right-0 bg-black/40 p-[.5rem] rounded-full
              z-50 opacity-0 group-hover:opacity-100 duration-300"
            >
              <AiOutlineClose size={25} />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
