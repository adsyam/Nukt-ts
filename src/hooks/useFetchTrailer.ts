import axios from "axios"
import { useEffect, useState } from "react"
import { API_KEY, TMDB_BASE_URL } from "../config/TMDB_API"

interface TrailerProps {
    key: string
    type: string
    id: string
}

export default function useFetchTrailer(mediaType: string | undefined, id: string) {
  const [getTrailer, setGetTrailer] = useState<TrailerProps[]>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/${mediaType}/${id}/videos?api_key=${API_KEY}`
        )

        setGetTrailer(
          response.data.results
            .filter((td: TrailerProps) => td.type === "Trailer")
            .slice(0, 1)
        )
      } catch (error) {
        console.error("Error Fetching Data:", error)
      }
    }
    fetchData()
  }, [id, mediaType])

  return { getTrailer }
}
