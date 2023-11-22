import {
  createContext,
  useContext,
  useReducer,
  Dispatch,
  type ReactNode,
} from "react"
import { v4 } from "uuid"
import { fileDB, textDB } from "../config/firebase"
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

interface DBProviderProps {
  children: ReactNode
}

interface DBState {
  // Define your state properties here
}

type DBAction =
  | { type: "ADD_USER"; userId: string; username: string; email: string }
  | { type: "ADD_USER_SUCCESS" }
  | { type: "GET_USER_DATA"; userId: string }
  | { type: "GET_USER_DATA_SUCCESS"; data: DocumentData | undefined }
  | { type: "ADD_IMAGE"; userId: string; imageType: string; imageUpload: File }
// Add more action types as needed

const initialState: DBState = {
  // Initialize your state properties here
}

const dbReducer = (state: DBState, action: DBAction): DBState => {
  switch (action.type) {
    case "ADD_USER":
      // Implement logic for adding user
      return state

    case "ADD_USER_SUCCESS":
      // Implement logic for successful user addition
      return state

    case "GET_USER_DATA":
      // Implement logic for getting user data
      return state

    case "GET_USER_DATA_SUCCESS":
      // Implement logic for successful user data retrieval
      return state

    case "ADD_IMAGE":
      // Implement logic for adding image
      return state

    // Add more cases for other action types

    default:
      return state
  }
}

export interface DBContextProps {
  state: DBState
  dispatch: Dispatch<DBAction>
}

const DBContext = createContext<DBContextProps | null>(null)

const DBProvider = ({ children }: DBProviderProps) => {
  const [state, dispatch] = useReducer(dbReducer, initialState)

  const addUser = async (userId: string, username: string, email: string) => {
    // Dispatch action to add user
    dispatch({ type: "ADD_USER", userId, username, email })

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

        // Dispatch action for successful user addition
        dispatch({ type: "ADD_USER_SUCCESS" })
      }
    } catch (error) {
      console.error("Error adding user:", error)
    }
  }

  // Implement other functions using a similar pattern

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
