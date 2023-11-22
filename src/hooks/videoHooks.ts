import { useEffect, useState } from "react"
import { UseFetchSubProps } from "../interface/Global_Interface.ts"
import { useFetchRapid } from "./useFetchRapid.ts"

export const useFetchVideoDetails = (param: string) => {
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await useFetchRapid(`search?part=snippet&q=${param}`)
        setDetail(data.items)
      } catch (error) {
        console.error("Error fetching video details:", error)
      }
    }

    fetchData()
  }, [param])

  return detail
}
export const useFetchStats = (param: string) => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await useFetchRapid(
          `videos?part=snippet,statistics&id=${param}`
        )
        setStats(data.items[0])
      } catch (error) {
        console.error("Error fetching video details:", error)
      }
    }

    fetchData()
  }, [param])

  return stats
}

export const useFetchRelatedVideos = (param: string) => {
  const [videos, setVideos] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await useFetchRapid(
          `search?part=snippet&relatedToVideoId=${param}&type=video`
        )
        setVideos(data.items)
      } catch (error) {
        console.error("Error fetching video details:", error)
      }
    }

    fetchData()
  }, [param])

  return videos
}

export const useFetchChannelDetails = (param: string) => {
  const [channelDetail, setChannelDetail] = useState(null)
  const [, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await useFetchRapid(`channels?part=snippet&id=${param}`)

        if (data.items && data.items.length > 0) {
          setChannelDetail(data.items[0])
        } else {
          setChannelDetail(null)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [param])
  return { channelDetail }
}

//this custom hook will get channel contents on the URL query paramenter
//this will be mainly used on the profile page to generate all the video contents of that channel
export const useFetchChannelVideos = (param: string) => {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await useFetchRapid(
        `search?channelId=${param}&part=snippet&order=date`
      )
      setVideos(data?.items)
    }

    fetchData()
  }, [param])

  return videos
}

//this custom hook will get the user's comments based on the URL query paramenter
//this will be used in the watch page for the review section
export const useFetchVideoComments = (param: string) => {
  const [comments, setComments] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      const data = await useFetchRapid(
        `commentThreads?part=snippet&videoId=${param}`
      )
      setComments(data?.items)
    }

    fetchData()
  }, [param])

  return comments
}

export const useFetchSubsVideos = (subChannels: string[]) => {
  const [data, setData] = useState<UseFetchSubProps[]>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          subChannels.map((channelId) =>
            useFetchRapid(
              `search?channelId=${channelId}&part=snippet,id&order=date&`
            )
          )
        )

        const flattenedData = responses.flatMap(
          (response) => response?.items || []
        )

        setData(() => [...flattenedData])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [subChannels])

  return data
}

export const useFetchSubChannels = (subChannels: string[]) => {
  const [data, setData] = useState<UseFetchSubProps[]>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          subChannels.map((channelId) =>
            useFetchRapid(`channels?part=snippet&id=${channelId}`)
          )
        )

        const flattenedData = responses.flatMap(
          (response) => response?.items || []
        )

        setData(() => [...flattenedData])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [subChannels])

  return data
}

export const useFetchVideoDetail = (videoIds: string[]) => {
  const [data, setData] = useState<UseFetchSubProps[]>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          videoIds.map((videoId) =>
            useFetchRapid(`videos?part=snippet&id=${videoId}`)
          )
        )

        const flattenedData = responses.flatMap(
          (response) => response?.items || []
        )

        setData(() => [...flattenedData])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [videoIds])

  return data
}
