import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"

import { createRating } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/IconBtn1"

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue("courseExperience", "")
    setValue("courseRating", 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating)
  }

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    )
    setReviewModal(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/40 backdrop-blur-sm">
      <div className="w-11/12 max-w-xl rounded-lg border border-black/10 bg-white text-black shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg border-b border-black/10 px-6 py-4">
          <p className="text-lg font-semibold">Add Review</p>
          <button
            onClick={() => setReviewModal(false)}
            aria-label="Close review modal"
            className="inline-flex items-center justify-center rounded-md p-1 hover:bg-black/5"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.image}
              alt={user?.firstName + " profile"}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-600">Posting Publicly</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col">
            <div className="flex flex-col items-center">
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
                activeColor="#000"
                value={0}
              />
            </div>

            <div className="mt-4 w-full">
              <label className="text-sm font-medium" htmlFor="courseExperience">
                Add Your Experience <sup className="text-red-500">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Add Your Experience"
                {...register("courseExperience", { required: true })}
                className="mt-2 block w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                rows={6}
              />
              {errors.courseExperience && (
                <span className="mt-2 text-xs text-red-500">
                  Please Add Your Experience
                </span>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="rounded-md border border-black/10 bg-black/5 px-4 py-2 text-sm font-semibold hover:bg-black/10"
              >
                Cancel
              </button>

              {/* IconBtn preserved; you can pass customClasses if needed */}
              <IconBtn text="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
