import { DataContextProps, useDataContext } from "../../contexts/DataContext"
import { useFetchVideoDetails } from "../../hooks/videoHooks"
import VideosGrid from "./VideosGrid"
import VideosLinear from "./VideosLinear"

interface VideoCategoriesProps {
    catergoryName: string
}

export default function VideoCategories({ catergoryName }: VideoCategoriesProps) {
  const { location } = useDataContext() as DataContextProps

  return (
    <>
      {location === "/search" ? (
        <VideosGrid videos={useFetchVideoDetails(catergoryName)} />
      ) : (
        <VideosLinear videos={useFetchVideoDetails(catergoryName)} />
      )}
    </>
  )
}
