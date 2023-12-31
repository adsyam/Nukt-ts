import { Player } from "@lottiefiles/react-lottie-player"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import useResponsive from "../hooks/useResponsive"
import { loader_Geometric } from "../assets"
import {
  Carousel,
  CategoryCard,
  CategoryToggle,
  Footer,
  MediaTypeButton,
  PagingButton,
} from "../components"
import useFetchTMDB from "../hooks/useFetchTMDB"

import { DataContextProps, useDataContext } from "../contexts/DataContext"

export default function AllCategory() {
  const [changeCategory, setChangeCategory] = useState<string>()
  const location = useLocation()
  const pathname = location.pathname
  const { sidebar } = useDataContext() as DataContextProps
  const { responsiveGridCard } = useResponsive()

  const { data, mediaType, setMediaType, isloading } =
    useFetchTMDB({
      defMediaType: "tv",
      defPage: 1,
      category: changeCategory ?? "",
    })

  useEffect(() => {
    if (pathname.includes("home/popular")) {
      setChangeCategory("popular")
    } else if (pathname.includes("home/trending")) {
      setChangeCategory("trending")
    } else if (pathname.includes("home/toprated")) {
      setChangeCategory("top_rated")
    } else if (pathname.includes("home/latest")) {
      setChangeCategory("airing_today")
    } else if (pathname.includes("home/intheatre")) {
      setChangeCategory("now_playing")
    }
  }, [pathname, changeCategory])

  return (
    <>
      <Carousel mediaType={mediaType} />
      <div
        className={`whitespace-nowrap ${
          sidebar
            ? "translate-x-[10rem] origin-left duration-300 w-[95%]"
            : "w-full origin-right duration-300"
        }`}
      >
        <div className="mt-12 mb-3 mx-32 flex flex-col items-center gap-4 justify-center text-white">
          <div className="flex items-center gap-4">
            <CategoryToggle />
          </div>
          <MediaTypeButton mediaType={mediaType} setMediaType={setMediaType} />
        </div>
        <div className={responsiveGridCard}>
          {!isloading
            ? data
                ?.filter((d) => d.poster_path && d.backdrop_path)
                .slice(0, 20)
                .map((d, index) => (
                  <CategoryCard
                    key={d.id}
                    index={index}
                    id={d.id}
                    poster={d.poster_path}
                    title={d.original_title}
                    name={d.original_name}
                    releaseDate={d.release_date}
                    firstAirDate={d.first_air_date}
                    mediaType={mediaType}
                    rating={Number(d.vote_average.toFixed(1))}
                  />
                ))
            : data
                ?.filter((d) => d.poster_path && d.backdrop_path)
                .slice(0, 20)
                .map((_d, index) => (
                  <Player
                    autoplay
                    loop
                    src={loader_Geometric}
                    key={index}
                    className="h-[35vh]"
                  />
                ))}
        </div>
        {isloading ? null : (
          <div className="flex justify-center mt-12">
            <PagingButton />
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
