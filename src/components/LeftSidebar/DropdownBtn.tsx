import { MdKeyboardArrowDown } from "react-icons/md"
import { Link } from "react-router-dom"
import { DataContextProps, useDataContext } from "../../contexts/DataContext"

interface DropdownBtnProps {
  name: string
  icon: JSX.Element
  url?: string
  list?: {
    category: string
    url: string
  }[]
  index: number
}

export default function DropdownBtn({ name, icon, list, index }: DropdownBtnProps) {
  const { handleDropDown, dropDown } = useDataContext() as DataContextProps

  return (
    <>
      <button
        className={`font-fig flex items-center justify-between outline-none border-0
        py-[.5rem] px-[.9rem] my-[.5rem] me-[1rem] rounded-full transition-all 
        duration-300 ease-in-out group bg-transparent text-white hover:bg-[#7300FF]`}
        onClick={handleDropDown}
        key={index}
      >
        <div className="flex items-center justify-start">
          <span className="me-[1rem] text-[1rem] md:text-[1.2rem]">{icon}</span>
          <span className="w-max text-[1rem] md:text-[1.2rem] group-hover:text-black capitalize">
            {name}
          </span>
        </div>
        <MdKeyboardArrowDown size={25} />
      </button>
      {dropDown ? (
        <div className="transition-all duration-300 ease-in-out">
          {list?.map((item, index) => (
            <Link
              key={index}
              to={`${item.url}?q=${item.category}`}
              className={`w-[180px] font-fig basis-1 flex items-center justify-start gap-3
          cursor-pointer outline-none border-0 py-[.5rem] px-[.9rem]
          my-[.5rem] mx-[1rem] rounded-full transition-all duration-300 ease-in-out group 
          bg-transparent text-white hover:bg-[#582d95]`}
            >
              <span>{icon}</span>
              <span className="group-hover:text-black capitalize">
                {item.category}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  )
}
