export interface CategoryProps {
  id: string
  poster_path: string
  backdrop_path: string
  original_name: string
  original_title: string
  release_date: string
  first_air_date: string
  vote_average: number
  overview: string
  media_type: string
  vote_count: number
  total_pages?: number
}

export interface CategoryCardProps {
  id: string
  index: number
  poster: string
  name: string
  backdrop?: string
  title: string
  date1?: string
  date2?: string
  animation?: {
    hidden: { opacity: number }
    visible: { opacity: number }
  }
  rating?: number
  mediaType?: string
  releaseDate: string
  firstAirDate: string
}
