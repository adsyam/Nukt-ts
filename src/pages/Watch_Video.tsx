import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"

import {
    Footer,
  MediaFrame,
  Reviews,
  VideoDescriptions,
  VideosGrid,
} from "../components"
import { textDB } from "../config/firebase"
import { AuthContextProps, useAuthContext } from "../contexts/AuthContext"
import { DBContextProps, useDBContext } from "../contexts/DBContext"
import { DataContextProps, useDataContext } from "../contexts/DataContext"
import useResponsive from "../hooks/useResponsive"
import { useFetchRelatedVideos, useFetchStats } from "../hooks/videoHooks"

export default function WatchVideo() {
  const id = new URLSearchParams(window.location.search).get("v") ?? ""
  const [historyToggle, setHistoryToggle] = useState(true)

  const videoDetails = useFetchStats(id)
  const videos = useFetchRelatedVideos(id)
  //   const comments = useFetchVideoComments(id)
  const { user } = useAuthContext() as AuthContextProps
  const { sidebar } = useDataContext() as DataContextProps
  const { addHistoryOrLibrary } = useDBContext() as DBContextProps
  const videoRef = useRef(null)
  const { lgBelow } = useResponsive()

  useEffect(() => {
    if (!user?.uid) return

    const docRef = doc(textDB, "Users", user?.uid)
    const unsubscribe = onSnapshot(docRef, (doc) =>
      setHistoryToggle(doc.data()?.storeHistory)
    )

    return () => unsubscribe()
  }, [id, user, user?.uid])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (historyToggle && user?.uid) {
        const nonNullContentId = id ?? ""
        addHistoryOrLibrary(user?.uid, "history", "videos", nonNullContentId)
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [addHistoryOrLibrary, historyToggle, id, user?.uid, videoDetails])

  if (!videoDetails) {
    return (
      <div className="w-full h-[100vh] bg-[#0d0d0d] grid place-items-center">
        <h1 className="text-[2rem] text-white"></h1>
      </div>
    )
  }

  if (lgBelow) {
    return (
      <>
        <section
          className={`min-h-[100vh] bg-[#0d0d0d] flex ${
            sidebar
              ? "translate-x-[15rem] origin-left duration-300 w-[87%]"
              : "w-full origin-right duration-300"
          }`}
        >
          <div className="flex flex-col gap-3 pt-[5rem] justify-center">
            <div className="flex-1">
              <div className="w-full p-[1rem]">
                <div className="">
                  <iframe
                    title="YouTube video player"
                    ref={videoRef}
                    key={id}
                    src={`https://www.youtube.com/embed/${id}`}
                    allowFullScreen
                    frameBorder={0}
                    className="aspect-video w-full h-full rounded-[10px]"
                  />
                </div>
                <VideoDescriptions videoDetail={videoDetails} />
              </div>
            </div>
            <div className="flex flex-col items-center flex-1 w-full lg:flex-row">
              <Reviews id={id} />
              <div className="flex flex-col flex-1">
                <p className="text-white text-center text-[1.5rem] font-medium">
                  Related Videos
                </p>
                <div className="flex justify-center">
                  <VideosGrid videos={videos!} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="flex gap-4 mx-10 mt-20">
        <div className="flex flex-col w-full gap-4">
          <MediaFrame
            id={String(id)}
            server={`https://www.youtube.com/embed/${id}`}
          />
          <VideoDescriptions videoDetail={videoDetails} />
          <Reviews id={id} />
          <div></div>
        </div>
        <div>
          <p className="text-white text-center text-[1.5rem] font-medium">
            Related Videos
          </p>
          <div className="">
            <VideosGrid videos={videos!} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
