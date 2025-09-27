import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../util/constants"

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/8 bg-black/60 p-5 text-white shadow-xl">
      {/* Image */}
      <div className="overflow-hidden rounded-xl border border-white/6">
        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-105"
        />
      </div>

      {/* Price & Buttons */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-extrabold">Rs. {CurrentPrice}</div>
          <div className="text-xs text-white/70">30-Day Money-Back Guarantee</div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            onClick={
              user && course?.studentsEnrolled.includes(user?._id)
                ? () => navigate("/dashboard/enrolled-courses")
                : handleBuyCourse
            }
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-black font-semibold shadow-md hover:shadow-lg transition"
          >
            {user && course?.studentsEnrolled.includes(user?._id)
              ? "Go To Course"
              : "Buy Now"}
          </button>

          {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
            <button
              onClick={handleAddToCart}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm text-white/90 hover:bg-white/5 transition"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Includes */}
      <div className="mt-5 border-t border-white/6 pt-4">
        <p className="text-lg font-semibold">This Course Includes :</p>
        <div className="mt-3 flex flex-col gap-2 text-sm text-white/80">
          {course?.instructions?.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 text-white/80">
                <BsFillCaretRightFill />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Share */}
      <div className="mt-6 flex items-center justify-center">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white/90 hover:bg-white/5 transition"
        >
          <FaShareSquare size={14} /> Share
        </button>
      </div>
    </div>
  )
}

export default CourseDetailsCard
