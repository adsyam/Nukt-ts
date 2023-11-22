import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router"
import { API_KEY, TMDB_BASE_URL } from "../config/TMDB_API"

export interface useFetchDetailsData {
  vote_count: number
  vote_average: number
  original_name: string
  original_title: string
  seasons?: {
    air_date: string
    episode_count: number
    id: number
    name: string
    overview: string
    poster_path: string
    season_number: number
    vote_average: number
  }[]
  poster_path: string
  overview: string
  production_companies: {
    id: number
    logo_path: string | null
    name: string
    origin_country: string
  }[]
  genres: {
    id: number
    name: string
  }[]
}

export default function useFetchDetails() {
  const { id, season, episode } = useParams<string>()
  const [data, setData] = useState<useFetchDetailsData | null>(null)
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
