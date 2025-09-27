import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"

import "video-react/dist/video-react.css"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn1"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  // start as null so we can test presence correctly
  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  // <-- Place the useEffect here (replace your existing one that does the same thing)
  useEffect(() => {
    ;(async () => {
      if (!courseSectionData?.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
        return
      }

      const sec = courseSectionData.find((s) => s._id === sectionId)
      const sub = sec?.subSection?.find((x) => x._id === subSectionId)
      // debugging kept as-is
      console.log("found section", sec)
      console.log("found subSection", sub)

      setVideoData(sub ?? null)
      setPreviewSource(courseEntireData?.thumbnail ?? "")
      setVideoEnded(false)
    })()
    // keep dependencies same as original intent
  }, [courseSectionData, courseEntireData, location.pathname, navigate, courseId, sectionId, subSectionId])

  // Defensive helpers: if courseSectionData isn't ready these functions return booleans safely
  const isFirstVideo = () => {
    if (!courseSectionData?.length) return false

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    if (currentSectionIndx === -1) return false

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    return currentSectionIndx === 0 && currentSubSectionIndx === 0
  }

  const isLastVideo = () => {
    if (!courseSectionData?.length) return false

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    if (currentSectionIndx === -1) return false

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    )
  }

  // navigation helpers
  const goToNextVideo = () => {
    if (!courseSectionData?.length) return

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    if (currentSectionIndx === -1) return

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      // move to first subsection of next section (guard if next section missing)
      const nextSection = courseSectionData[currentSectionIndx + 1]
      if (!nextSection) return
      const nextSubSectionId = nextSection.subSection?.[0]?._id
      if (!nextSubSectionId) return
      navigate(
        `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSubSectionId}`
      )
    }
  }

  const goToPrevVideo = () => {
    if (!courseSectionData?.length) return

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    if (currentSectionIndx === -1) return

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx > 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSection = courseSectionData[currentSectionIndx - 1]
      if (!prevSection) return
      const prevSubSectionLength = prevSection.subSection.length
      const prevSubSectionId =
        prevSection.subSection[prevSubSectionLength - 1]._id
      navigate(
        `/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    try {
      const res = await markLectureAsComplete(
        { courseId: courseId, subsectionId: subSectionId },
        token
      )
      if (res) {
        dispatch(updateCompletedLectures(subSectionId))
      }
    } catch (err) {
      // optionally handle error (toast etc.)
      console.error("Mark lecture complete failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 mt-16 bg-black min-h-screen px-4 py-6">
      {/* Render Player only when we have a valid video URL, otherwise show preview image */}
      {videoData?.videoUrl ? (
        <div className="w-full rounded-lg overflow-hidden shadow-lg bg-black">
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData.videoUrl}
            poster={previewSource}
          >
            <BigPlayButton position="center" />

            {/* Render When Video Ends */}
            {videoEnded && (
              <div
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.7), rgba(0,0,0,0.5))",
                }}
                className="absolute inset-0 z-[100] grid h-full place-content-center"
              >
                {!completedLectures.includes(subSectionId) && (
                  <IconBtn
                    disabled={loading}
                    onclick={() => handleLectureCompletion()}
                    text={!loading ? "Mark As Completed" : "Loading..."}
                    // ensure visible on dark overlay
                    customClasses="text-lg max-w-max px-4 mx-auto bg-white text-black"
                  />
                )}

                <IconBtn
                  disabled={loading}
                  onclick={() => {
                    if (playerRef?.current) {
                      // set the current time of the video to 0
                      // video-react exposes `seek` on the player instance
                      playerRef.current.seek(0)
                      setVideoEnded(false)
                    }
                  }}
                  text="Rewatch"
                  customClasses="text-lg max-w-max px-4 mx-auto mt-3 bg-white text-black"
                />

                <div className="mt-8 flex min-w-[250px] justify-center gap-x-4">
                  {!isFirstVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToPrevVideo}
                      className="rounded-md bg-white text-black px-4 py-2 font-semibold disabled:opacity-60"
                    >
                      Prev
                    </button>
                  )}
                  {!isLastVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToNextVideo}
                      className="rounded-md bg-white text-black px-4 py-2 font-semibold disabled:opacity-60"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </Player>
        </div>
      ) : (
        <div className="w-full rounded-md overflow-hidden shadow-md bg-white">
          <img
            src={previewSource}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <h1 className="mt-4 text-3xl font-semibold text-white">{videoData?.title}</h1>
      <p className="pt-2 pb-6 text-gray-300">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails
