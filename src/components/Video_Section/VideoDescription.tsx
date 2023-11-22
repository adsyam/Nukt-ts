import { useEffect, useRef, useState } from "react"
import { AiFillCheckCircle, AiFillLike, AiOutlineLike } from "react-icons/ai"
import { Link } from "react-router-dom"

import { doc, onSnapshot } from "firebase/firestore"
import { textDB } from "../../config/firebase"
import { AuthContextProps, useAuthContext } from "../../contexts/AuthContext"
import { DBContextProps, useDBContext } from "../../contexts/DBContext"
import { timeFormat } from "../../utils/timeFormat"

const descriptionStyles = {
  WebkitLineClamp: 5,
  WebkitBoxOrient: "vertical" as const,
  display: "-webkit-box",
  overflow: "hidden",
}

interface VideoDetail {
  snippet: {
    title: string
    channelId: string
    channelTitle: string
    description: string
    publishedAt: string
  }
  statistics: {
    viewCount: number
    likeCount: number
  }
}

export default function VideoDescriptions({ videoDetail }: { videoDetail: VideoDetail}) {
  const [isOpen, setIsOpen] = useState(false)
  const [readMore, setReadMore] = useState(false)
  const [subscribe, setSubscribe] = useState<string[] | undefined>()
  const [like, setLike] = useState(false)
  const descriptionRef = useRef<HTMLDivElement>(null)

  const { user } = useAuthContext() as AuthContextProps
  const { addSubcription, removeSubscription } =
    useDBContext() as DBContextProps

  const {
    snippet: { title, channelId, channelTitle, description, publishedAt },
    statistics: { viewCount, likeCount },
  } = videoDetail

  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = onSnapshot(
      doc(textDB, "Users", user?.uid),
      { includeMetadataChanges: true },
      (doc) => setSubscribe(doc.data()?.subscriptions["channels"])
    )
  }, [user?.uid])

  useEffect(() => {
    if (descriptionRef.current) {
      setReadMore(
        descriptionRef.current.scrollHeight >=
          descriptionRef.current.clientHeight
      )
    }
  }, [])

  const handdleSubscriptions = () => {
    if (subscribe?.includes(channelId)) {
      removeSubscription(String(user?.uid), "channels", channelId)
    } else {
      addSubcription(String(user?.uid), "channels", channelId)
    }
  }

  return (
    <>
      <h1 className="text-white text-[1.2rem] md:text-[1.5rem] font-bold px-[1rem] py-[1rem]">
        {title}
      </h1>
      <div className="flex flex-col gap-3 justify-between text-white px-[1rem]">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between">
          <div className="flex gap-4">
            <Link
              to={`/profile/${channelId}`}
              className="flex items-center gap-1"
            >
              <p className="text-slate-300">{channelTitle}</p>
              <AiFillCheckCircle size=".8rem" color="gray" />
            </Link>
            <button
              onClick={handdleSubscriptions}
              className={`px-2 rounded-md capitalize py-2 ${
                subscribe?.includes(channelId) ? "bg-[#389FDD]" : "bg-white/50"
              }`}
            >
              {!subscribe?.includes(channelId) ? "subscribe" : "subscribed"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-slate-300 border-2 py-[.45rem] px-3 rounded-md">
              {Number(viewCount).toLocaleString() || 0} views
            </p>
            <div className="flex gap-3 items-center border-2 py-1 px-2 rounded-md">
              <p className="text-slate-300">
                {like
                  ? (Number(likeCount) + 1).toLocaleString()
                  : Number(likeCount).toLocaleString() || 0}
              </p>
              <hr className="h-[30px] border-[1px] border-white/20" />
              {like ? (
                <div className="text-[1.5rem]">
                  <AiFillLike
                    onClick={() => setLike(!like)}
                    className="cursor-pointer"
                  />
                </div>
              ) : (
                <div className="text-[1.5rem]">
                  <AiOutlineLike
                    onClick={() => setLike(!like)}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <hr />
        <div className="bg-white/20 rounded-md p-2">
          <div>{timeFormat(publishedAt)}</div>
          <div
            ref={descriptionRef}
            style={{
              whiteSpace: "pre-line",
              ...(isOpen ? {} : descriptionStyles),
            }}
          >
            {description}
          </div>
          {readMore && (
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
