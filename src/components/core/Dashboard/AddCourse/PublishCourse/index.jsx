import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../util/constants";
import IconBtn from "../../../../common/IconBtn1";

export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  // keep setValue in deps and run when course loads
  useEffect(() => {
    if (!course) return;
    setValue("public", course.status === COURSE_STATUS.PUBLISHED);
  }, [course, setValue]);

  const goBack = () => {
    dispatch(setStep(2));
  };

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-course");
  };

  const handleCoursePublish = async () => {
    // check if form has been updated or not
    if (
      (course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      // form has not been updated
      goToCourses();
      return;
    }

    const formData = new FormData();
    formData.append("courseId", course._id);
    const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
    formData.append("status", courseStatus);
    setLoading(true);
    const result = await editCourseDetails(formData, token);
    if (result) {
      goToCourses();
    }
    setLoading(false);
  };

  const onSubmit = (data) => {
    handleCoursePublish();
  };

  return (
    <div className="max-w-3xl mx-auto rounded-xl border border-white/10 bg-black/70 p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Publish Settings</h2>
          <p className="text-sm text-white/70 mt-1">Control who can see this course</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/50">Final Step</p>
          <p className="text-sm font-medium text-white">Ready to publish</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        {/* Checkbox */}
        <div className="my-6 flex items-center gap-4 rounded-md bg-white/3 p-4">
          <label htmlFor="public" className="inline-flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="h-5 w-5 rounded bg-black/10 text-black focus:ring-2 focus:ring-white/30"
            />
            <div className="flex flex-col">
              <span className="text-white font-medium">Make this course public</span>
              <span className="text-sm text-white/60">Students will be able to discover and enroll</span>
            </div>
          </label>
        </div>

        {/* Next Prev Button */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-white text-black py-2 px-4 font-semibold"
          >
            Back
          </button>
          <IconBtn disabled={loading} text={loading ? "Saving..." : "Save Changes"} />
        </div>
      </form>

      <div className="mt-4 text-xs text-white/50">Published courses are visible to all users. Unpublish anytime.</div>
    </div>
  );
}
