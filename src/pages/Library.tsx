import { MovieHistory, SeriesHistory, VideoHistory } from "../components/index"
import { DataContextProps, useDataContext } from "../contexts/DataContext"

export default function History() {
  //   const [reload, setReload] = useState(false)
  //   const location = useLocation().pathname.split("/")[2]
  const { sidebar } = useDataContext() as DataContextProps
  //   const { clearHistoryOrLibrary } = useDBContext() as DBContextProps
  //   const { user } = useAuthContext() as AuthContextProps

  //   const handleClear = () => {
  //     clearHistoryOrLibrary(String(user?.uid), location)
  //     setReload(true) //update reload value to rerender the component
  //   }

  return (
    <section
      className={`min-h-[100vh] bg-[#0d0d0d] text-white px-[3rem] mb-[5rem] ${
        sidebar
          ? "translate-x-[14rem] origin-left duration-300 w-[89%]"
          : "w-full origin-right duration-300"
      }`}
    >
      <div className="w-full flex justify-between items-center translate-y-[8rem]">
        <h1 className="text-[1.5rem] font-medium">Library Feed</h1>
        <div className="flex gap-3 items-center">
          <button className="capitalize font-medium bg-white/20 p-[.5rem] rounded-lg hover:bg-[#7300FF]">
            Manage Library
          </button>
        </div>
      </div>
      <hr className="border-white/20 translate-y-[10rem]" />
      <div className="translate-y-[12rem] flex items-center gap-[2rem] mb-[2rem]">
        <MovieHistory />
      </div>
      <div className="translate-y-[12rem] flex items-center gap-[2rem] mb-[2rem]">
        <SeriesHistory />
      </div>
      <div className="translate-y-[12rem] flex items-center gap-[2rem] mb-[2rem]">
        <VideoHistory />
      </div>
    </section>
  )
}
