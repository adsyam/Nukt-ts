import { useEffect, useState } from "react"
import { useFetchRapid } from "./useFetchRapid.ts"
import { UseFetchSubProps } from "../interface/Global_Interface.ts"

export const useFetchVideoDetails = (param: string) => {
  const [detail, setDetail] = useState(null)
  const fetchDetails = useFetchRapid(`search?part=snippet&q=${param}`).then(
    (data) => setDetail(data.items)
  )

  useEffect(() => {
    fetchDetails
  }, [fetchDetails, param])

  return detail
}

export const useFetchStats = (param: string) => {
  const [stats, setStats] = useState(null)
  const fetchStats = useFetchRapid(
    `videos?part=snippet,statistics&id=${param}`
  ).then((data) => setStats(data.items[0]))
  useEffect(() => {
    fetchStats
  }, [fetchStats, param])

  return stats
}

export const useFetchRelatedVideos = (param: string) => {
  const [videos, setVideos] = useState(null)
  const fetchStats = useFetchRapid(
    `search?part=snippet&relatedToVideoId=${param}&type=video`
  ).then((data) => setVideos(data.items))

  useEffect(() => {
    fetchStats
  }, [fetchStats, param])

  return videos
}

export const useFetchChannelDetails = (param: string) => {
  const [channelDetail, setChannelDetail] = useState(null)
  const [, setIsLoading] = useState(true)
  const fetchChannelDetails = useFetchRapid(`channels?part=snippet&id=${param}`)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChannelDetails

        setChannelDetail(
          data.items && data.items.length > 0 ? data.items[0] : null
        )
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [fetchChannelDetails, param])
  return { channelDetail }
}

export const useFetchChannelVideos = (param: string) => {
  const [videos, setVideos] = useState([])
  const fetchChannelVideos = useFetchRapid(
    `search?channelId=${param}&part=snippet&order=date`
  ).then((data) => setVideos(data?.items))
  useEffect(() => {
    fetchChannelVideos
  }, [fetchChannelVideos, param])

  return videos
}

export const useFetchVideoComments = (param: string) => {
  const [comments, setComments] = useState(null)
  const fetchVideoComments = useFetchRapid(
    `commentThreads?part=snippet&videoId=${param}`
  ).then((data) => setComments(data?.items))
  useEffect(() => {
    fetchVideoComments
  }, [fetchVideoComments, param])

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
