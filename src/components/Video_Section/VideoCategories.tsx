import { useDataContext } from "../../contexts/DataContext"
import { useFetchVideoDetails } from "../../hooks/videoHooks"
import VideosGrid from "./VideosGrid"
import VideosLinear from "./VideosLinear"

export default function VideoCategories({ catergoryName }) {
  const { location } = useDataContext()

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
