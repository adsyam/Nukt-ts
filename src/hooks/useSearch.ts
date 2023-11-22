import axios from "axios"
import { useEffect, useState } from "react"
import { API_KEY, TMDB_BASE_URL } from "../config/TMDB_API"
import { CategoryProps } from "../interface/Global_Interface"



export default function useSearch(query: string | null) {
  const [movieResult, setMovieResult] = useState<CategoryProps[] | null>(null)
  const [seriesResult, setSeriesResult] = useState<CategoryProps[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}&api_key=${API_KEY}`
        )

        setMovieResult(response.data.results)
        setTimeout(() => {
          setLoading(false)
        }, 1300)
      } catch (error) {
        console.error("Error Fetching Data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [page, query])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/search/tv?query=${query}&include_adult=false&language=en-US&page=${page}&api_key=${API_KEY}`
        )

        setSeriesResult(response.data.results)
        setTimeout(() => {
          setLoading(false)
        }, 1300)
      } catch (error) {
        console.error("Error Fetching Data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [page, query])

  return { movieResult, seriesResult, page, setPage, loading }
}
