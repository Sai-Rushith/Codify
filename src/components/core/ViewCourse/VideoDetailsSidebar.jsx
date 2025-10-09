import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import IconBtn from "../../common/IconBtn1"

export default function VideoDetailsSidebar({ setReviewModal }) { 
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()

  // initialize from URL so right items are active on first render
  const [activeStatus, setActiveStatus] = useState(sectionId ?? "")
  const [videoBarActive, setVideoBarActive] = useState(subSectionId ?? "")

  const {
    courseSectionData = [],
    courseEntireData = {},
    totalNoOfLectures = 0,
    completedLectures = [],
  } = useSelector((state) => state.viewCourse || {})

  useEffect(() => {
    // when courseSectionData loads or URL changes, ensure active ids match params
    if (!courseSectionData?.length) return

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    if (currentSectionIndx === -1) {
      // if sectionId from URL is invalid, keep the first section as active
      setActiveStatus((prev) => prev || courseSectionData[0]?._id)
      setVideoBarActive((prev) => prev || courseSectionData[0]?.subSection?.[0]?._id)
      return
    }

    const currentSubSectionIndx = courseSectionData?.[currentSectionIndx]?.subSection?.findIndex(
      (data) => data._id === subSectionId
    )

    const activeSubSectionId =
      courseSectionData?.[currentSectionIndx]?.subSection?.[currentSubSectionIndx]?._id

    // set active using found ids or fallback to URL params
    setActiveStatus(courseSectionData?.[currentSectionIndx]?._id ?? sectionId ?? "")
    setVideoBarActive(activeSubSectionId ?? subSectionId ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, location.pathname, sectionId, subSectionId])

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r border-white/10 bg-black mt-20 text-white">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-white/10 py-5 text-lg font-bold">
          <div className="flex w-full items-center justify-between">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`)
              }}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white p-1 text-black hover:scale-95 transition-transform"
              title="back"
            >
              <IoIosArrowBack size={22} />
            </div>

            {/* IconBtn is preserved; it can be adjusted via its customClasses prop */}
            <IconBtn
              text="Add Review"
              customClasses="ml-auto bg-white text-black hover:opacity-95"
              onclick={() => setReviewModal(true)}
            />
          </div>

          <div className="flex flex-col w-full">
            <p className="text-sm font-semibold line-clamp-2">{courseEntireData?.courseName}</p>
            <p className="text-xs font-medium text-gray-300 mt-1">
              {completedLectures?.length ?? 0} / {totalNoOfLectures ?? 0}
            </p>
          </div>
        </div>

        <div className="h-[calc(100vh - 5rem)] overflow-y-auto pr-2">
          {courseSectionData.map((course) => (
            <div
              className="mt-2 cursor-pointer text-sm"
              key={course._id}
            >
              {/* Section */}
              <div
                className={`flex flex-row justify-between px-5 py-4 ${
                  activeStatus === course._id ? "bg-white text-black" : "bg-white/3 text-white"
                }`}
                onClick={() => {
                  // toggle open/close
                  setActiveStatus((prev) => (prev === course._id ? "" : course._id))
                }}
              >
                <div className="w-[70%] font-semibold truncate">
                  {course?.sectionName}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-all duration-500 ${
                      activeStatus === course?._id ? "rotate-0" : "rotate-180"
                    }`}
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* Sub Sections */}
              {activeStatus === course?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {course.subSection?.map((topic) => (
                    <div
                      className={`flex gap-3 px-5 py-2 items-center ${
                        videoBarActive === topic._id
                          ? "bg-white text-black font-semibold"
                          : "hover:bg-white/5 text-white"
                      }`}
                      key={topic._id}
                      onClick={() => {
                        // guard: only navigate if we have a valid course id
                        const courseId = courseEntireData?._id
                        if (!courseId) return
                        navigate(
                          `/view-course/${courseId}/section/${course?._id}/sub-section/${topic?._id}`
                        )
                        setVideoBarActive(topic._id)
                      }}
                    >
                      <input
                        type="checkbox"
                        // avoid crash if completedLectures undefined
                        checked={(completedLectures ?? []).includes(topic?._id)}
                        onChange={() => {
                          /* noop or dispatch toggle action if desired */
                        }}
                        className="h-4 w-4 rounded border-gray-300 bg-white text-black"
                      />
                      <span className="truncate">{topic.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
