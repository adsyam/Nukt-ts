import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router"
import { API_KEY, TMDB_BASE_URL } from "../config/TMDB_API"
import { CategoryProps } from "../interface/Global_Interface"

export default function useFetchRecommend(  ) {
  const { id } = useParams()
  const [data, setData] = useState<CategoryProps[]>()
  const location = useLocation()
  const pathname = location.pathname

  useEffect(() => {
    let mediaType: string

    if (pathname.includes("Movie")) {
      mediaType = "movie"
    } else if (pathname.includes("TVSeries")) {
      mediaType = "tv"
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/${mediaType}/${id}/recommendations?api_key=${API_KEY}`
        )

        setData(response.data.results)
      } catch (error) {
        console.error("Error Fetching Data:", error)
      }
    }

    fetchData()
  }, [id, pathname])

  return { data, pathname }
}
