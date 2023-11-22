//custom hooks for fetching different kinds of video queries and parameters

import { useEffect, useState } from "react"
import { useFetchRapid } from "./useFetchRapid.ts"

//this custom hook will get video details based on the URL query paramenter
//this will be used through out the pages where we display all videos and channels
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

//this custom hook will get video details with stats based on the URL query paramenter
//this will be used in the watch page for the video description
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

//this custom hook will get related videos based on the URL query paramenter
//this will be used in the watch page for the related videos section
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

//this custom hook will get channel data on the URL query paramenter
//this will be used through out the pages where we display all videos and channels
export const useFetchChannelDetails = (param: string) => {
  const [channelDetail, setChannelDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const fetchChannelDetails = useFetchRapid(`channels?part=snippet&id=${param}`)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChannelDetails

        // if (data.items && data.items.length > 0) {
        //   setChannelDetail(data.items[0])
        // } else {
        //   setChannelDetail(null)
        // }

        setChannelDetail( data.items && data.items.length > 0 ? data.items[0] : null)
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

//this custom hook will get channel contents on the URL query paramenter
//this will be mainly used on the profile page to generate all the video contents of that channel
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

//this custom hook will get the user's comments based on the URL query paramenter
//this will be used in the watch page for the review section
export const useFetchVideoComments = (param: string) => {
  const [comments, setComments] = useState(null)
  const fetchVideoComments = useFetchRapid(`commentThreads?part=snippet&videoId=${param}`).then((data) =>
      setComments(data?.items)
    )
  useEffect(() => {
    fetchVideoComments
  }, [fetchVideoComments, param])

  return comments
}

export const useFetchSubsVideos = (subChannels) => {
  const [data, setData] = useState([])
  const fetchSubsVideos = 

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

        setData((prevData) => [...flattenedData])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [subChannels])

  return data
}

export const useFetchSubChannels = (subChannels) => {
  const [data, setData] = useState([])

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

        setData((prevData) => [...flattenedData])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [subChannels])

  return data
}

export const useFetchVideoDetail = (videoIds) => {
  const [data, setData] = useState([])

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

        setData((prevData) => [...flattenedData])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [videoIds])

  return data
}
