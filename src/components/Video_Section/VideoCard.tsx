import { motion } from "framer-motion"
import { AiOutlinePlus } from "react-icons/ai"
import { Link, useLocation } from "react-router-dom"
import { AuthContextProps, useAuthContext } from "../../contexts/AuthContext"
import { DBContextProps, useDBContext } from "../../contexts/DBContext"
import { VideoCardProps } from "../../interface/Global_Interface"

export default function VideoCard({ video, item, index }: VideoCardProps) {
  const { user } = useAuthContext() as AuthContextProps
  const { addHistoryOrLibrary } = useDBContext() as DBContextProps
  const location = useLocation().pathname

  const handleAddToLibrary = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault()
    try {
      if (video?.id?.videoId) {
        addHistoryOrLibrary(
          String(user?.uid),
          "library",
          "videos",
          (video?.id?.videoId || item?.id) as string
        )
      }

      alert("Successfully added to library")
    } catch (err) {
      console.error(err)
    }
  }

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <div className="w-[200px] md:w-[300px] h-max group/card relative">
      <Link
        to={
          video?.id?.videoId
            ? `/watch?v=${video?.id?.videoId}`
            : `/watch?v=${item?.id}`
        }
        className=""
      >
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index! * 0.07 }}
          className="w-full h-[100px] md:h-[160px] overflow-hidden rounded-md "
        >
          <motion.img
            style={{ y: -25 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
            }}
            src={
              video?.snippet?.thumbnails?.high?.url ||
              item?.snippet?.thumbnails?.high?.url
            }
            alt={video?.snippet?.title || item?.snippet?.title}
            className="text-center w-[400px] -translate-y-9"
          />
        </motion.div>
      </Link>
      <div className="h-[100px] md:h-[120px] text-wrap p-[.5rem] md:p-[1rem] flex flex-col justify-start gap-2">
        <Link to={`/watch?v=${video?.id?.videoId}` || `/watch?v=${item?.id}`}>
          <p className="text-sm md:text-[1rem] font-bold">
            {video?.snippet?.title.slice(0, 40) ||
              item?.snippet?.title.slice(0, 40)}
          </p>
        </Link>
        <Link
          to={
            `/profile/${video?.snippet?.channelId}` ||
            `/profile/${item?.snippet?.channelId}`
          }
        >
          <div className="flex justify-start items-center gap-1 bg-slate-400/30 w-max px-[.4rem] rounded-md">
            <p className="text-xs md:text-[.9rem] font-semibold text-slate-300">
              {video?.snippet?.channelTitle.slice(0, 20) ||
                item?.snippet?.channelTitle.slice(0, 20)}
            </p>
          </div>
        </Link>
      </div>
      {(location === "/home" ||
        location === "/watch" ||
        location === "/search") && (
        <div
          role="button"
          onClick={(e) => handleAddToLibrary(e)}
          className="w-[25px] md:w-[30px] h-[25px] md:h-[30px] bg-black/60 rounded-md flex items-center justify-center
          cursor-pointer opacity-0 transition-all duration-200 z-[99999] group-hover/card:opacity-100 group/add absolute  bottom-[130px] left-[260px]"
        >
          <AiOutlinePlus className="font-bold w-[20px] md:w-[25px] h-[20px] md:h-[25px]" />
          <p
            className="absolute w-max bg-black/80 p-1 rounded-md text-xs md:text-sm opacity-0 group-hover/add:opacity-100
          translate-x-0 group-hover/add:-translate-x-20 transition-all ease-in-out duration-300"
          >
            Add to library
          </p>
        </div>
      )}
    </div>
  )
}
