import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const { register, handleSubmit, setValue, formState: { errors }, getValues } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true;
    }
    return false;
  };

  const handleEditSubsection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    if (currentValues.lectureTitle !== modalData.title) formData.append("title", currentValues.lectureTitle);
    if (currentValues.lectureDesc !== modalData.description) formData.append("description", currentValues.lectureDesc);
    if (currentValues.lectureVideo !== modalData.videoUrl) formData.append("video", currentValues.lectureVideo);

    setLoading(true);
    const result = await updateSubSection(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        handleEditSubsection();
      }
      return;
    }

    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("video", data.lectureVideo);

    setLoading(true);
    const result = await createSubSection(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-black/60 backdrop-blur-sm">
      <div className="my-8 w-11/12 max-w-3xl rounded-2xl border border-white/10 bg-white text-black shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-black text-white px-6 py-4">
          <h3 className="text-lg font-semibold">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </h3>
          <button
            onClick={() => (!loading ? setModalData(null) : null)}
            aria-label="Close modal"
            className="rounded-md p-2 hover:bg-white/10"
          >
            <RxCross2 className="text-white text-xl" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-6 py-6">
          <div className="space-y-4">
            <Upload
              name="lectureVideo"
              label="Lecture Video"
              register={register}
              setValue={setValue}
              errors={errors}
              video={true}
              viewData={view ? modalData.videoUrl : null}
              editData={edit ? modalData.videoUrl : null}
            />

            <div className="flex flex-col">
              <label htmlFor="lectureTitle" className="mb-2 text-sm font-medium text-gray-700">
                Lecture Title {!view && <span className="text-red-500">*</span>}
              </label>
              <input
                id="lectureTitle"
                disabled={view || loading}
                placeholder="Enter Lecture Title"
                {...register("lectureTitle", { required: true })}
                className="rounded-md border border-black/10 bg-black/5 px-4 py-3 text-black placeholder-black/40 focus:outline-none"
              />
              {errors.lectureTitle && <span className="mt-2 text-xs text-red-500">Lecture title is required</span>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="lectureDesc" className="mb-2 text-sm font-medium text-gray-700">
                Lecture Description {!view && <span className="text-red-500">*</span>}
              </label>
              <textarea
                id="lectureDesc"
                disabled={view || loading}
                placeholder="Enter Lecture Description"
                {...register("lectureDesc", { required: true })}
                className="min-h-[140px] rounded-md border border-black/10 bg-black/5 p-4 text-black placeholder-black/40 focus:outline-none"
              />
              {errors.lectureDesc && <span className="mt-2 text-xs text-red-500">Lecture description is required</span>}
            </div>
          </div>

          {!view && (
            <div className="flex justify-end">
              <IconBtn disabled={loading} text={loading ? "Loading..." : edit ? "Save Changes" : "Save"} />
            </div>
          )}
        </form>
      </div>

      <div className="mt-4 text-sm text-white/70">Black & White modal — clean and minimal</div>
    </div>
  );
}
