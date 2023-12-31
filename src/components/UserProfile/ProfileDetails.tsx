import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { textDB } from "../../config/firebase"
import { AuthContextProps, useAuthContext } from "../../contexts/AuthContext"
import { DBContextProps, useDBContext } from "../../contexts/DBContext"
import { ChannelDetail } from "../../pages/UserProfile"
import ProfileNav from "./ProfileNav"

interface ProfileDetailsProps {
  channelDetail: ChannelDetail
  id: string
}

interface SubscriberState {
  users: string[]
  channels: string[]
}

export default function ProfileDetails({
  channelDetail,
  id,
}: ProfileDetailsProps) {
  const [isUser, setIsUser] = useState(false)
  const [subscribe, setSubscribe] = useState<SubscriberState>({
    users: [],
    channels: [],
  })
  const { user } = useAuthContext() as AuthContextProps
  const { addSubcription, removeSubscription, addSubscribers } =
    useDBContext() as DBContextProps

  useEffect(() => {
    if (!user?.uid) return
    const unsubscribe = onSnapshot(
      doc(textDB, "Users", user?.uid),
      { includeMetadataChanges: true },
      (doc) => setSubscribe(doc.data()?.subscriptions)
    )

    return () => unsubscribe()
  }, [user?.uid])

  useEffect(() => {
    if (!channelDetail?.kind) {
      setIsUser(true)
    } else {
      setIsUser(false)
    }
  }, [channelDetail])

  const handdleSubscriptions = () => {
    if (isUser) {
      if (subscribe["users"]?.includes(id)) {
        removeSubscription(String(user?.uid), "users", id)
      } else {
        addSubcription(String(user?.uid), "users", id)
        addSubscribers(id, String(user?.uid))
      }
    } else {
      if (subscribe["channels"]?.includes(id)) {
        removeSubscription(String(user?.uid), "channels", id)
      } else {
        addSubcription(String(user?.uid), "channels", id)
      }
    }
  }

  return (
    <section className="px-[2rem]">
      <div
        className="w-max flex flex-col gap-2 translate-x-[11rem] md:translate-x-[18rem]
        -translate-y-[7rem] md:-translate-y-[12rem]"
      >
        <div>
          <h2 className="text-[1.2rem] font-medium">
            {isUser ? channelDetail?.username : channelDetail?.snippet?.title}
          </h2>
          <p className="text-white/60">
            {isUser ? channelDetail?.email : channelDetail?.snippet?.customUrl}
          </p>
        </div>
        <div className="flex gap-4">
          <p>
            <span className="font-bold">
              {isUser
                ? channelDetail?.subscribers?.length
                : parseInt(
                    channelDetail?.statistics?.subscriberCount
                  ).toLocaleString()}
            </span>{" "}
            Subscribers
          </p>
          <p>
            <span className="font-bold">
              {isUser
                ? 0
                : parseInt(
                    channelDetail?.statistics?.videoCount
                  ).toLocaleString()}
            </span>{" "}
            Videos
          </p>
        </div>
        {id !== user?.uid && (
          <div className="w-full flex justify-start items-center">
            <button
              onClick={handdleSubscriptions}
              className={`w-max px-10 py-2 capitalize rounded-md ${
                isUser
                  ? subscribe["users"]?.includes(id)
                    ? "bg-[#389FDD]"
                    : "bg-white/30"
                  : subscribe["channels"]?.includes(id)
                  ? "bg-[#389FDD]"
                  : "bg-white/30"
              }`}
            >
              {isUser
                ? subscribe["users"]?.includes(id)
                  ? "subscribed"
                  : "subscribe"
                : subscribe["channels"]?.includes(id)
                ? "subscribed"
                : "subscribe"}
            </button>
          </div>
        )}
      </div>

      <ProfileNav id={channelDetail?.id} />
    </section>
  )
}
