import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { useLocation } from "react-router"
import { textDB } from "../../config/firebase"
import { useAuthContext } from "../../contexts/AuthContext"
import { useDBContext } from "../../contexts/DBContext"
import { useFetchVideoDetail } from "../../hooks/videoHooks"
import VideoCard from "../Video_Section/VideoCard"

export default function VideoHistory({ reload }) {
  const { user } = useAuthContext()
  const { updateHistoryOrLibrary } = useDBContext()
  const [videoIds, setVideoIds] = useState([])
  const location = useLocation().pathname.split("/")[2]

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(textDB, "Users", user?.uid),
      { includeMetadataChanges: true },
      (doc) => setVideoIds(doc.data()[location].videos)
    )
  }, [])

  const videoDetails = useFetchVideoDetail(videoIds)

  if (!videoDetails) return

  const handleDelete = (idToDelete) => {
    const newIds = [...videoIds]

    const indexToRemove = newIds.indexOf(idToDelete.toString())
    if (indexToRemove !== -1) {
      newIds.splice(indexToRemove, 1)
      updateHistoryOrLibrary(user.uid, location, "videos", newIds)
    }
  }

  return (
    <section className="w-full min-h-max">
      {videoIds.length < 1 ? "" : <h2 className="mb-3 font-medium">Videos</h2>}
      <div className="w-full flex items-center gap-5 flex-wrap relative">
        {videoDetails.map((video, index) => (
          <div key={video?.id} className="relative group">
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
