import {
  DocumentData,
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import { deleteObject, listAll, ref, uploadBytes } from "firebase/storage"
import { createContext, useContext, type ReactNode } from "react"
import { v4 } from "uuid"
import { fileDB, textDB } from "../config/firebase"

interface DBProviderProps {
  children: ReactNode
}

export interface DBContextProps {
  addUser: (userId: string, username: string, email: string) => Promise<void>
  getUserData: (userId: string) => Promise<DocumentData | undefined>
  addImage: (userId: string, type: string, imageUpload: File) => void
  addSubcription: (userId: string, type: string, id: string) => Promise<void>
  removeSubscription: (
    userId: string,
    type: string,
    id: string
  ) => Promise<void>
  addSubscribers: (userId: string, id: string) => Promise<void>
  removeSubscribers: (userId: string, id: string) => Promise<void>
  switchHistory: (userId: string) => Promise<void>
  addHistoryOrLibrary: (
    userId: string,
    path: string,
    type: string,
    contentId: string
  ) => Promise<void>
  updateHistoryOrLibrary: (
    userId: string,
    path: string,
    type: string,
    newIds: string[]
  ) => Promise<void>
  clearHistoryOrLibrary: (userId: string, path: string) => Promise<void>
  addUserFeedback: (
    userId: string,
    username: string,
    feedback: string,
    rating: number
  ) => Promise<void>
  addReview: (
    userId: string,
    videoId: string,
    username: string,
    review: string
  ) => Promise<void>
  deleteReview: (userId: string, videoId: string) => Promise<void>
  updateReview: (
    reviewId: string,
    videoId: string,
    review: string
  ) => Promise<void>
  addVideo: (
    userId: string,
    title: string,
    description: string,
    tags: string,
    videoFile: File,
    thumbnail: {
      name: string
    },
    status: boolean
  ) => Promise<void>
}

const DBContext = createContext<DBContextProps | null>(null)

const DBProvider = ({ children }: DBProviderProps) => {
  const addUser = async (userId: string, username: string, email: string) => {
    try {
      const userDocRef = doc(textDB, "Users", userId)
      const docSnap = await getDoc(userDocRef)
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          id: userId,
          email: email,
          username: username,
          storeHistory: true,
          subscribers: [],
          subscriptions: {
            users: [],
            channels: [],
          },
          library: {
            movies: [],
            series: [],
            videos: [],
          },
          history: {
            movies: [],
            series: [],
            videos: [],
          },
        })
      }
    } catch (error) {
      console.error("Error adding user:", error)
    }
  }

  const getUserData = async (userId: string) => {
    const userDocRef = doc(textDB, "Users", userId)

    try {
      const doc = await getDoc(userDocRef)
      return doc.data()
    } catch (e) {
      console.error("Error getting user doc: ", e)
    }
  }

  const addImage = (userId: string, type: string, imageUpload: File) => {
    const imageRef = ref(fileDB, `${userId}/${type}/${imageUpload.name}`)

    const folderRef = ref(fileDB, `${userId}/${type}/`)

    uploadBytes(imageRef, imageUpload).then(() => {
      alert("Image uploaded")
    })

    listAll(folderRef).then((response) => {
      if (response.items.length > 0) {
        deleteObject(ref(fileDB, response.items[0].fullPath))
      }
    })
  }

  const addSubcription = async (userId: string, type: string, id: string) => {
    const userDocRef = doc(textDB, "Users", userId)
    const userDocSnapshot = await getDoc(userDocRef)
    const subscriptions = userDocSnapshot.data()?.subscriptions

    if (!subscriptions[type].includes(id)) {
      const newSub = subscriptions[type].filter((item: string) => item != "")
      newSub.push(id)

      updateDoc(userDocRef, {
        ...userDocSnapshot.data(),
        subscriptions: { ...subscriptions, [type]: newSub },
      })
    }
  }

  const removeSubscription = async (
    userId: string,
    type: string,
    id: string
  ) => {
    const userDocRef = doc(textDB, "Users", userId)
    const userDocSnapshot = await getDoc(userDocRef)
    const subscriptions = userDocSnapshot.data()?.subscriptions

    if (subscriptions[type].includes(id)) {
      const newSub = subscriptions[type].filter((item: string) => item != id)

      updateDoc(userDocRef, {
        ...userDocSnapshot.data(),
        subscriptions: { ...subscriptions, [type]: newSub },
      })
    }
  }

  const addSubscribers = async (userId: string, id: string) => {
    const userDocRef = doc(textDB, "Users", userId)
    const userDocSnapshot = await getDoc(userDocRef)
    const subs = userDocSnapshot.data()?.subscribers

    if (!subs.includes(id)) {
      subs.push(id)
    }

    updateDoc(userDocRef, {
      ...userDocSnapshot.data(),
      subscribers: subs,
    })
  }

  const removeSubscribers = async (userId: string, id: string) => {
    const userDocRef = doc(textDB, "Users", userId)
    const userDocSnapshot = await getDoc(userDocRef)
    const subs = userDocSnapshot.data()?.subscribers

    if (subs.includes(id)) {
      const newSub = subs.filter((item: string) => item != id)

      updateDoc(userDocRef, {
        ...userDocSnapshot.data(),
        subscribers: newSub,
      })
    }
  }

  const switchHistory = async (userId: string) => {
    const userDocRef = doc(textDB, "Users", userId)
    const userDocSnapshot = await getDoc(userDocRef)
    const storeHistory = userDocSnapshot.data()?.storeHistory
    let newStatus
    if (storeHistory) {
      newStatus = false
    } else {
      newStatus = true
    }

    updateDoc(userDocRef, {
      ...userDocSnapshot.data(),
      storeHistory: newStatus,
    })
  }

  const addHistoryOrLibrary = async (
    userId: string,
    path: string,
    type: string,
    contentId: string
  ) => {
    const userDocRef = doc(textDB, "Users", userId)
    const userDocSnapshot = await getDoc(userDocRef)
    const userData = userDocSnapshot.data()
    if (!userData || !userData[path] || !userData[path][type]) {
      console.error(`Invalid type: ${type}`)
      return
    }

    const currentTypeData = userData[path][type] || []

    const updatedArray = [...new Set([...currentTypeData, contentId])]

    updateDoc(userDocRef, {
      ...userDocSnapshot.data(),
      [path]: { ...userDocSnapshot.data()?.[path], [type]: updatedArray },
    })
  }

  const updateHistoryOrLibrary = async (
    userId: string,
    path: string,
    type: string,
    newIds: string[]
  ) => {
    const userDocRef = doc(textDB, "Users", userId)
    const userDocSnapshot = await getDoc(userDocRef)

    updateDoc(userDocRef, {
      ...userDocSnapshot.data(),
      [path]: { ...userDocSnapshot.data()?.[path], [type]: newIds },
    })
  }

  const clearHistoryOrLibrary = async (userId: string, path: string) => {
    const userDocRef = doc(textDB, "Users", userId)
    const userDocSnapshot = await getDoc(userDocRef)
    updateDoc(userDocRef, {
      ...userDocSnapshot.data(),
      [path]: {
        movies: [],
        series: [],
        videos: [],
      },
    })
  }

  const addUserFeedback = async (
    userId: string,
    username: string,
    feedback: string,
    rating: number
  ) => {
    try {
      const feedbackDocRef = doc(textDB, "Feedbacks", userId)
      const id = v4()
      const item = {
        [id]: {
          id: userId,
          username: username || "anonymous",
          feedback: feedback,
          rating: rating,
          createdAt: serverTimestamp(),
        },
      }
      await setDoc(feedbackDocRef, item, { merge: true })
    } catch (err) {
      console.log(err)
    }
  }

  const addReview = async (
    userId: string,
    videoId: string,
    username: string,
    review: string
  ) => {
    try {
      const reviewDocRef = doc(textDB, "Reviews", videoId)
      const id = v4()
      const item = {
        [id]: {
          id: userId,
          username: username || "User",
          review: review,
          createdAt: serverTimestamp(),
          isEdited: false,
        },
      }

      await setDoc(reviewDocRef, item, { merge: true })
    } catch (err) {
      console.log(err)
    }
  }

  const deleteReview = async (reviewId: string, videoId: string) => {
    try {
      const reviewDocRef = doc(textDB, "Reviews", videoId)
      await updateDoc(reviewDocRef, {
        [reviewId]: deleteField(),
      })
    } catch (err) {
      console.log(err)
    }
  }

  const updateReview = async (
    reviewId: string,
    videoId: string,
    review: string
  ) => {
    try {
      const reviewDocRef = doc(textDB, "Reviews", videoId)
      const reviewSnapshot = await getDoc(reviewDocRef)
      await updateDoc(reviewDocRef, {
        ...reviewSnapshot.data(),
        [reviewId]: {
          ...reviewSnapshot.data()?.[reviewId],
          review,
          isEdited: true,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  const addVideo = async (
    userId: string,
    title: string,
    description: string,
    tags: string,
    videoFile: File,
    thumbnail: {
      name: string
    },
    status: boolean
  ) => {
    const videoRef = ref(fileDB, `${userId}/videos/${videoFile.name}`)
    const isPrivateString = status.toString()

    const metadata = {
      customMetadata: {
        title: title,
        description: description,
        tags: tags,
        thumbnail: thumbnail.name,
        isPrivate: isPrivateString,
      },
    }

    //upload the video in the videoRef with the metadata
    uploadBytes(videoRef, videoFile, metadata).then(() => {
      alert("Upload successful!")
    })
  }

  return (
    <DBContext.Provider
      value={{
        addUser,
        getUserData,
        addImage,
        addSubcription,
        removeSubscription,
        addSubscribers,
        switchHistory,
        addHistoryOrLibrary,
        updateHistoryOrLibrary,
        clearHistoryOrLibrary,
        addUserFeedback,
        removeSubscribers,
        addReview,
        deleteReview,
        updateReview,
        addVideo,
      }}
    >
      {children}
    </DBContext.Provider>
  )
}

function useDBContext() {
  const context = useContext(DBContext)
  if (context === undefined) {
    throw new Error("useDBContext must be used within a DBProvider")
  }
  return context
}

export { DBProvider, useDBContext }
