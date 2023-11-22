import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import useFetchTMDB from "../../hooks/useFetchTMDB"

export default function PagingButton() {
  const [category, setCategory] = useState<string>()
  const { data, pathname } = useFetchTMDB()
  const { page } = useParams()
  const currentPage = Number(page)

  useEffect(() => {
    if (pathname.includes("popular")) setCategory("popular")
    if (pathname.includes("trending")) setCategory("trending")
    if (pathname.includes("toprated")) setCategory("toprated")
    if (pathname.includes("latest")) setCategory("latest")
  }, [pathname])

  return (
    <div className="flex gap-2 text-white">
      <Link
        className="py-1 px-2 rounded-md hover:bg-[#ffffff30] duration-300"
        to={`/home/${category}/${
          currentPage === 1 ? currentPage : currentPage - 1
        }`}
      >
        Previous
      </Link>
      <Link
        className="py-1 px-2 rounded-md hover:bg-[#ffffff30] duration-300"
        to={`/home/${category}/${currentPage + 1}`}
      >
        Next
      </Link>
    </div>
  )
}
