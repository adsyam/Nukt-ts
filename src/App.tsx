import { createBrowserRouter } from "react-router-dom"
import { Suspense } from "react"
import { Player } from "@lottiefiles/react-lottie-player"
import { loader_Geometric } from "./assets"
import '@stripe/stripe-js'

import {
  Pricing,
  ProfileAbout,
  ProfileContents,
  ProfileDownloads,
  ProfileHome,
  ProfilePlaylist,
  ProtectedRoute,
  RedirectRoute,
} from "./components"

import {
  AllCategory,
  Dashboard,
  Feed,
  ForgotPassword,
  History,
  Home,
  Library,
  Report,
  SearchMedia,
  SignIn,
  SignUp,
  Subscriptions,
  Success,
  UserProfile,
  WatchMovie,
  WatchSeries,
  WatchVideo,
} from "./pages"
import AppLayout from "./AppLayout"

// const Pricing = lazy(() => import('./components/NoUser/Pricing'))
// const ProfileAbout = lazy(() => import("./components/UserProfile/Profile_About"))
// const ProfileContents = lazy(() => import("./components/UserProfile/Profile_Contents"))
// const ProfileDownloads = lazy(() => import("./components/UserProfile/Profile_Downloads"))
// const ProfileHome = lazy(() => import("./components/UserProfile/Profile_Home"))
// const ProfilePlaylist = lazy(() => import("./components/UserProfile/Profile_Playlist"))
// const ProtectedRoute = lazy(() => import("./components/Route_Protection/ProtectedRoute"))
// const RedirectRoute = lazy(() => import("./components/Route_Protection/RedirectRoute"))

// const AllCategory = lazy(() => import("./pages/AllCategory"))
// const Dashboard = lazy(() => import("./pages/Dashboard"))
// const Feed = lazy(() => import("./pages/Feed"))
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
// const History = lazy(() => import("./pages/History"))
// const Home = lazy(() => import("./pages/Home"))
// const Library = lazy(() => import("./pages/Library"))
// const Report = lazy(() => import("./pages/Report"))
// const SearchMedia = lazy(() => import("./pages/Search_Media"))
// const SignIn = lazy(() => import("./pages/SignIn"))
// const SignUp = lazy(() => import("./pages/SignUp"))
// const Subscriptions = lazy(() => import("./pages/Subscriptions"))
// const Success = lazy(() => import("./pages/Success"))
// const UserProfile = lazy(() => import("./pages/UserProfile"))
// const WatchMovie = lazy(() => import("./pages/Watch_Movie"))
// const WatchSeries = lazy(() => import("./pages/Watch_Series"))
// const WatchVideo = lazy(() => import("./pages/Watch_Video"))

// const AppLayout = lazy(() => import("./AppLayout"))

export const AppRouter = createBrowserRouter([
  {
    element: (
      <Suspense
        fallback={
          <Player autoplay loop src={loader_Geometric} className="h-[35vh]" />
        }
      >
        <AppLayout />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <RedirectRoute>
            <Dashboard />
          </RedirectRoute>
        ),
      },
      {
        path: "/login",
        children: [
          {
            path: "/login",
            element: (
              <RedirectRoute>
                <SignIn />
              </RedirectRoute>
            ),
          },
          {
            path: "forgot-password",
            element: (
              <RedirectRoute>
                <ForgotPassword />
              </RedirectRoute>
            ),
          },
        ],
      },
      {
        path: "/signup",
        children: [
          {
            path: "/signup",
            element: (
              <RedirectRoute>
                <SignUp />
              </RedirectRoute>
            ),
          },
          {
            path: "pricing",
            element: <Pricing />,
          },
          {
            path: "success",
            element: <Success />,
          },
        ],
      },
      {
        path: "/home",
        children: [
          {
            path: "/home",
            element: (
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            ),
          },
          {
            path: "popular/:page",
            element: (
              <ProtectedRoute>
                <AllCategory />
              </ProtectedRoute>
            ),
          },
          {
            path: "trending/:page",
            element: (
              <ProtectedRoute>
                <AllCategory />
              </ProtectedRoute>
            ),
          },
          {
            path: "toprated/:page",
            element: (
              <ProtectedRoute>
                <AllCategory />
              </ProtectedRoute>
            ),
          },
          {
            path: "latest/:page",
            element: (
              <ProtectedRoute>
                <AllCategory />
              </ProtectedRoute>
            ),
          },
          {
            path: "cinema/:page",
            element: (
              <ProtectedRoute>
                <AllCategory />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/feed",
        children: [
          {
            path: "/feed",
            element: (
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            ),
          },
          {
            path: "history",
            element: (
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            ),
          },
          {
            path: "subscriptions",
            element: (
              <ProtectedRoute>
                <Subscriptions />
              </ProtectedRoute>
            ),
          },
          {
            path: "library",
            element: (
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/report",
        element: (
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        ),
      },
      {
        path: "/search",
        children: [
          {
            path: "/search",
            element: (
              <ProtectedRoute>
                <SearchMedia />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/movie",
        children: [
          {
            path: "/movie",
            element: (
              <ProtectedRoute>
                <WatchMovie />
              </ProtectedRoute>
            ),
          },
          {
            path: ":id",
            element: (
              <ProtectedRoute>
                <WatchMovie />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/TVSeries",
        children: [
          {
            path: "/TVSeries",
            element: (
              <ProtectedRoute>
                <WatchSeries />
              </ProtectedRoute>
            ),
          },
          {
            path: ":id/:season/:episode",
            element: (
              <ProtectedRoute>
                <WatchSeries />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/watch",
        element: (
          <ProtectedRoute>
            <WatchVideo />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "home",
            element: <ProfileHome />,
          },
          {
            path: "contents",
            element: <ProfileContents />,
          },
          {
            path: "playlist",
            element: <ProfilePlaylist />,
          },
          {
            path: "downloads",
            element: <ProfileDownloads />,
          },
          {
            path: "about",
            element: <ProfileAbout />,
          },
        ],
      },
    ],
  },
])
