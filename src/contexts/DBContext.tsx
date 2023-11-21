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
    newIds: string
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
    review: number
  ) => Promise<void>
  deleteReview: (userId: string, videoId: string) => Promise<void>
  updateReview: (
    reviewId: string,
    videoId: string,
    review: number
  ) => Promise<void>
}

const DBContext = createContext<DBContextProps | null>(null)

const DBProvider = ({ children }: DBProviderProps) => {
  const addUser = async (userId: string, username: string, email: string) => {
    try {
      const userDocRef = doc(textDB, "Users", userId) //user document reference
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

  //function call for getting the user data in the database
  const getUserData = async (userId: string) => {
    const userDocRef = doc(textDB, "Users", userId) //user document reference

    //try catch block..
    try {
      //get the user document using the user document reference
      const doc = await getDoc(userDocRef)
      return doc.data() //return the document data in json
    } catch (e) {
      //for debugging purposes i added an error message
      console.log("Error getting user doc: ", e)
    }
  }

  //this function will upload the either cover or profile image uploaded by the user in our storage database
  const addImage = (userId: string, type: string, imageUpload: File) => {
    //this line will create a reference to where the image will be uploaded
    //since storage database in firebase is like a folder base structure
    const imageRef = ref(
      fileDB,
      `${userId}/${type}/${imageUpload.name}` //e.g. userId/coverImage/filename.jpg
    )

    //reference of the folder where the image is stored
    const folderRef = ref(fileDB, `${userId}/${type}/`)

    //this function from storage database will upload the image
    //in the file location specified in the imageRef
    uploadBytes(imageRef, imageUpload).then(() => {
      alert("Image uploaded")
    })

    //this line will just insure that the image folder is updated
    //and only one image file will be in the folder of cover and profile image
    listAll(folderRef).then((response) => {
      if (response.items.length > 0) {
        deleteObject(ref(fileDB, response.items[0].fullPath))
      }
    })
  }

  //this function is for the subscription feature.
  //this will add the channel id that the user is subscribed at
  const addSubcription = async (userId: string, type: string, id: string) => {
    const userDocRef = doc(textDB, "Users", userId)
    const userDocSnapshot = await getDoc(userDocRef)
    const subscriptions = userDocSnapshot.data()?.subscriptions

    //this will check if the channel id is not yet in the array
    if (!subscriptions[type].includes(id)) {
      //insures that there are no empty array in the list
      const newSub = subscriptions[type].filter((item: string) => item != "")
      newSub.push(id) //add the channel id in the list

      //update the document in the database with the new lists of subscriptions
      updateDoc(userDocRef, {
        ...userDocSnapshot.data(),
        subscriptions: { ...subscriptions, [type]: newSub },
      })
    }
  }

  //this function is for unsubscribing the profile or channel
  const removeSubscription = async (
    userId: string,
    type: string,
    id: string
  ) => {
    const userDocRef = doc(textDB, "Users", userId)
    const userDocSnapshot = await getDoc(userDocRef)
    const subscriptions = userDocSnapshot.data()?.subscriptions

    //check if the channel id that user want to unsubscribe is in the list
    if (subscriptions[type].includes(id)) {
      //filter the old list with the channel id that user want to unsubscribe
      const newSub = subscriptions[type].filter((item: string) => item != id)

      //update the document in the database with the new lists of subscriptions
      updateDoc(userDocRef, {
        ...userDocSnapshot.data(),
        subscriptions: { ...subscriptions, [type]: newSub },
      })
    }
  }

  const addSubscribers = async (userId: string, id: string) => {
    const userDocRef = doc(textDB, "Users", userId) //user doc reference
    const userDocSnapshot = await getDoc(userDocRef) //snapshot of the document
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
    const userDocRef = doc(textDB, "Users", userId) //user doc reference
    const userDocSnapshot = await getDoc(userDocRef) //snapshot of the document
    const subs = userDocSnapshot.data()?.subscribers

    if (subs.includes(id)) {
      const newSub = subs.filter((item: string) => item != id)

      updateDoc(userDocRef, {
        ...userDocSnapshot.data(),
        subscribers: newSub,
      })
    }
  }

  //this is for toggling the history status
  //the function will update the value be true or false depending if user
  //wants to store the watch history or not
  const switchHistory = async (userId: string) => {
    const userDocRef = doc(textDB, "Users", userId) //user doc reference
    const userDocSnapshot = await getDoc(userDocRef) //snapshot of the document
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

  //this function will be incharge of the adding of watch history or library contents in the database
  const addHistoryOrLibrary = async (
    userId: string,
    path: string,
    type: string,
    contentId: string
  ) => {
    const userDocRef = doc(textDB, "Users", userId) //user doc reference
    const userDocSnapshot = await getDoc(userDocRef) //snapshot of the document
    //check if the type passed in the function is correct
    const userData = userDocSnapshot.data()
    if (!userData || !userData[path] || !userData[path][type]) {
      console.error(`Invalid type: ${type}`)
      return
    }
    //add the new id to the path value using Set that will insure a unique set of ids in the array
    const currentTypeData = userData[path][type] || []

    const updatedArray = [...new Set([...currentTypeData, contentId])]
    //pass the update array in the updateDoc function of firestore to add it in the database
    updateDoc(userDocRef, {
      ...userDocSnapshot.data(),
      [path]: { ...userDocSnapshot.data()?.[path], [type]: updatedArray },
    })
  }

  //this function will update the watch history or library base on the path
  //for the user that wants to delete a single value
  const updateHistoryOrLibrary = async (
    userId: string,
    path: string,
    type: string,
    newIds: string
  ) => {
    const userDocRef = doc(textDB, "Users", userId)
    const userDocSnapshot = await getDoc(userDocRef)

    //pass the update array in the updateDoc function of firestore to add it in the database
    updateDoc(userDocRef, {
      ...userDocSnapshot.data(),
      [path]: { ...userDocSnapshot.data()?.[path], [type]: newIds },
    })
  }

  //this function will clear the watch history or library base on the path
  const clearHistoryOrLibrary = async (userId: string, path: string) => {
    const userDocRef = doc(textDB, "Users", userId)
    const userDocSnapshot = await getDoc(userDocRef)
    //reset the values of movies, series and videos
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
    review: number
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
    review: number
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

  //------------ THIS IS NOT YET TESTED -----------------//
  //function to add video in the firebase storage
  //   const addVideo = async (
  //     userId,
  //     title,
  //     description,
  //     tags,
  //     video,
  //     thumbnail,
  //     status
  //   ) => {
  //     //a video reference folder where the video will be uploaded
  //     const videoRef = ref(fileDB, `${userId}/videos/${video.name}`)

  //     //metadata that will be filled out by user when uploading the video
  //     const metadata = {
  //       customMetadata: {
  //         title: title,
  //         description: description,
  //         tags: tags,
  //         thumbnail: thumbnail.name,
  //         isPrivate: status,
  //       },
  //     }

  //     //upload the video in the videoRef with the metadata
  //     uploadBytes(videoRef, video, metadata).then(() => {
  //       alert("Upload successful!")
  //     })
  //   }

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
        // addVideo,
        addUserFeedback,
        removeSubscribers,
        addReview,
        deleteReview,
        updateReview,
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
