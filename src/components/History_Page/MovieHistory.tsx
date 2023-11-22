import axios from "axios"
import { useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { useLocation } from "react-router"
import { doc, onSnapshot } from "firebase/firestore"
import { TOKEN_AUTH } from "../../config/TMDB_API"
import { textDB } from "../../config/firebase"
import { AuthContextProps, useAuthContext } from "../../contexts/AuthContext"
import { DBContextProps, useDBContext } from "../../contexts/DBContext"
import { CategoryProps } from "../../interface/Global_Interface"
import CategoryCard from "../Common/CategoryCard"

export default function MovieHistory() {
  const { user } = useAuthContext() as AuthContextProps
  const { updateHistoryOrLibrary } = useDBContext() as DBContextProps

  const [movieIds, setMovieIds] = useState<string[]>([])
  const [movieDetails, setMovieDetails] = useState<CategoryProps[]>()
  const location = useLocation().pathname.split("/")[2]

  useEffect(() => {
    if (!user?.uid) return
    const unsubscribe = onSnapshot(doc(textDB, "Users", user?.uid), (doc) =>
      setMovieIds(doc?.data()?.[location]?.movies)
    )

    return () => unsubscribe()
  }, [location, user?.uid])

  useEffect(() => {
    //create an array of promises for fetching movie details
    const fetchMovieDetailsPromises = movieIds.map((movieId) => {
      const options = {
        method: "GET",
        url: `https://api.themoviedb.org/3/movie/${movieId}`,
        params: { language: "en-US" },
        headers: {
          accept: "application/json",
          Authorization: TOKEN_AUTH,
        },
      }
      return axios.request(options)
    })

    //use Promise.all to fetch all movie details in parallel
    Promise.all(fetchMovieDetailsPromises)
      .then((responses) => {
        //responses will be an array of movie details based on the movie ids
        const movieDetails = responses.map((response) => response.data)
        setMovieDetails(movieDetails)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [movieIds])

  const handleDelete = (idToDelete: string) => {
    const newIds: string[] = [...movieIds]

    const indexToRemove = newIds.indexOf(idToDelete)
    if (indexToRemove !== -1) {
      newIds.splice(indexToRemove, 1)
      updateHistoryOrLibrary(String(user?.uid), location, "movies", newIds)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {movieIds.length < 1 ? "" : <h2>Movies</h2>}
      <div className="flex gap-5 flex-wrap">
        {movieDetails?.map((movieDetail, index) => (
          <div key={movieDetail?.id} className="w-[200px] relative group">
            <CategoryCard
              key={movieDetail.id}
              index={index}
              id={movieDetail.id}
              poster={movieDetail.poster_path}
              title={movieDetail.original_title}
              name={movieDetail.original_name}
              releaseDate={movieDetail.release_date}
              firstAirDate={movieDetail.first_air_date}
              mediaType={"movie"}
              rating={Number(movieDetail.vote_average.toFixed(1))}
            />
            <button
              onClick={() => handleDelete(movieDetail?.id)}
              className="absolute top-0 right-0 bg-[#0d0d0d40] p-[.5rem] rounded-full
              z-50 opacity-0 group-hover:opacity-100 duration-300"
            >
              <AiOutlineClose size={25} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
