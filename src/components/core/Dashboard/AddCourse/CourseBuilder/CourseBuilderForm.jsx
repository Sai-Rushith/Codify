import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn1";
import NestedView from "./NestedView";

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(null);
  const dispatch = useDispatch();

  // handle form submission
  const onSubmit = async (data) => {
    setLoading(true);

    let result;

    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
    }
    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one section");
      return;
    }
    if (course.courseContent.some((section) => section.subSection.length === 0)) {
      toast.error("Please add atleast one lecture in each section");
      return;
    }
    dispatch(setStep(3));
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="rounded-xl bg-black border border-white/10 shadow-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Course Builder</h2>
            <p className="text-sm text-white/70 mt-1">Organize sections & lectures for your course</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-white/60">Progress</p>
              <p className="text-sm font-semibold text-white">Step 2 of 3</p>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
              <MdNavigateNext className="text-white" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="sectionName" className="block text-sm font-medium text-white">
                Section Name <span className="text-pink-400">*</span>
              </label>
              <input
                id="sectionName"
                disabled={loading}
                placeholder="Add a section to build your course"
                {...register("sectionName", { required: true })}
                className="mt-2 w-full rounded-md bg-white/5 border border-white/10 placeholder-white/40 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              {errors.sectionName && (
                <span className="text-xs text-pink-400 mt-2 block">Section name is required</span>
              )}
            </div>

            <div className="flex gap-3">
              <IconBtn
                type="submit"
                disabled={loading}
                text={editSectionName ? "Edit Section" : "Create Section"}
                outline={true}
              >
                <IoAddCircleOutline size={18} className="text-white" />
              </IconBtn>

              {editSectionName && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="inline-flex items-center rounded-md px-4 py-2 bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {course.courseContent.length > 0 && (
          <div className="mt-6">
            <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-white/60">Tip: Keep section names short and descriptive</div>

          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="flex cursor-pointer items-center gap-x-2 rounded-md bg-white text-black py-2 px-4 font-semibold"
            >
              Back
            </button>

            <IconBtn disabled={loading} text="Next" onclick={goToNext}>
              <MdNavigateNext />
            </IconBtn>
          </div>
        </div>
      </div>

      {/* subtle footer */}
      <div className="mt-6 text-center text-xs text-white/50">Designed with ♥ — Black & White theme</div>
    </div>
  );
}
