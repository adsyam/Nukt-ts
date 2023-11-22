import { motion } from "framer-motion"
import { Link, useNavigate, useParams } from "react-router-dom"
import useFetchDetails from "../../hooks/useFetchDetails"
import useResponsive from "../../hooks/useResponsive"

export default function EpisodeList() {
  const { id, season, episode } = useParams<string>()
  const { data } = useFetchDetails()
  const { responsiveEpisodeList } = useResponsive()
  const navigate = useNavigate()



  return (
    <div className={`${responsiveEpisodeList}`}>
      {data?.seasons &&
        data.seasons
          .filter((ep) => ep.season_number === Number(season))
          .map((ep, i) =>
            Number(season) > ep.season_number ? (
              <div key={i} className="text-white">
                No episode available
              </div>
            ) : (
              Array.from({ length: ep.episode_count }, (_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/TVSeries/${id}/${season}/${i + 1}`)}
                  className={`w-12 text-center border-2 rounded-md  ${
                    Number(episode) === i + 1
                      ? "border-[2px] border-[#7300FF90]"
                      : "border-[#868686] text-[#868686]"
                  }`}
                >
                  <Link
                    to={`/TVSeries/${id}/${season}/${i + 1}`}
                    className={`font-thin `}
                  >
                    {i + 1}
                  </Link>
                </motion.div>
              ))
            )
          )}
    </div>
  )
}
