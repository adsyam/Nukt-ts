import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router"
import { API_KEY, TMDB_BASE_URL } from "../config/TMDB_API"

interface useFetchDetails {
    data: Array<[]>
    isLoading: boolean
    setIsLoading: boolean
    id: string
    season: string
    episode: string
    pathname: string
}

export default function useFetchDetails() {
  const { id, season, episode } = useParams<string>()
  const [data, setData] = useState<[]>()
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const pathname = location.pathname

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaType = pathname.includes("Movie") ? "movie" : "tv"
        const response = await axios.get(
          `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`
        )

        setData(response.data)
        setTimeout(() => {
          setIsLoading(false)
        }, 1600)
      } catch (error) {
        console.error("Error fetching data", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, pathname])



  return { data, isLoading, setIsLoading, id, season, episode, pathname }
}
