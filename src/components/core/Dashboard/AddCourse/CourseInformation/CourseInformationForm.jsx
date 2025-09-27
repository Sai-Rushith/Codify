import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../util/constants"
import IconBtn from "../../../../common/IconBtn1"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories()
      if (categories) {
        setCourseCategories(categories)
      } else {
        console.log("failed to fetch categories")
      }
      setLoading(false)
    }

    if (editCourse) {
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }
    getCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues()
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true
    }
    return false
  }

  
  
   const onSubmit = async (data) => {
  console.log("onSubmit called. editCourse:", editCourse, "form data:", data);
  setLoading(true);

  try {
    // normalize current values before comparison
    const currentValues = getValues();

    // ---------- EDIT FLOW ----------
    if (editCourse) {
      // make isFormUpdated safe (in case of missing course)
      try {
        if (!isFormUpdated()) {
          toast.error("No changes made to the form");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("isFormUpdated error", err);
        toast.error("Error checking form changes");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("courseId", course?._id);

      if ((currentValues.courseTitle ?? "") !== (course?.courseName ?? "")) {
        formData.append("courseName", data.courseTitle ?? "");
      }
      if ((currentValues.courseShortDesc ?? "") !== (course?.courseDescription ?? "")) {
        formData.append("courseDescription", data.courseShortDesc ?? "");
      }
      if (String(currentValues.coursePrice ?? "") !== String(course?.price ?? "")) {
        formData.append("price", data.coursePrice ?? "");
      }
      // tags array
      if (((currentValues.courseTags ?? [])?.toString() ?? "") !== ((course?.tag ?? [])?.toString() ?? "")) {
        formData.append("tag", JSON.stringify(data.courseTags ?? []));
      }
      if ((currentValues.courseBenefits ?? "") !== (course?.whatYouWillLearn ?? "")) {
        formData.append("whatYouWillLearn", data.courseBenefits ?? "");
      }

      // normalize category: select returns string id; original may be object
      const currCatId = currentValues.courseCategory?._id ?? currentValues.courseCategory ?? "";
      const origCatId = course?.category?._id ?? "";
      if (currCatId && currCatId !== origCatId) {
        formData.append("category", currCatId);
      }

      if (((currentValues.courseRequirements ?? [])?.toString() ?? "") !== ((course?.instructions ?? [])?.toString() ?? "")) {
        formData.append("instructions", JSON.stringify(data.courseRequirements ?? []));
      }

      // thumbnail only if a File (user uploaded a new file)
      if (data.courseImage instanceof File) {
        formData.append("thumbnailImage", data.courseImage);
      } else {
        console.log("Edit: no new thumbnail file provided (keeping existing)", data.courseImage);
      }

      // Call the edit API (FIXED: use editCourseDetails)
      const result = await editCourseDetails(formData, token);
      console.log("editCourseDetails result:", result);

      if (result) {
        // update store then go to next step
        dispatch(setCourse(result));
        dispatch(setStep(2));
      } else {
        // service returns null if server responded with success=false
        toast.error("Failed to update course (server returned falsy). Check console/network tab for details.");
      }

      setLoading(false);
      return;
    }

    // ---------- CREATE FLOW ----------
    const formData = new FormData();
    formData.append("courseName", data.courseTitle ?? "");
    formData.append("courseDescription", data.courseShortDesc ?? "");
    formData.append("price", data.coursePrice ?? "");
    formData.append("tag", JSON.stringify(data.courseTags ?? []));
    formData.append("whatYouWillLearn", data.courseBenefits ?? "");
    formData.append("category", data.courseCategory ?? "");
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("instructions", JSON.stringify(data.courseRequirements ?? []));

    // create requires a file
    if (data.courseImage instanceof File) {
      formData.append("thumbnailImage", data.courseImage);
    } else {
      console.warn("Create: no thumbnail File provided. Backend may reject this.");
    }

    const result = await addCourseDetails(formData, token);
    console.log("addCourseDetails result:", result);

    if (result) {
      dispatch(setCourse(result));
      dispatch(setStep(2));
    } else {
      toast.error("Failed to save changes (server returned falsy)");
    }

  } catch (err) {
    console.error("onSubmit error:", err);
    toast.error("Something went wrong. Check console and network tab.");
  } finally {
    setLoading(false);
  }
};


  /*
    UI notes:
    - This component uses a high-contrast black & white visual language.
    - Make sure Tailwind CSS is configured in your project.
    - If other inner components (Upload / ChipInput / RequirementsField)
      need theme updates, pass className props to them or update their styles.
  */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-2xl bg-gradient-to-b from-black to-gray-900 p-8 shadow-xl"
    >
      {/* Header (optional) */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-wide text-white">
          Course Information
        </h2>
        <p className="text-sm text-gray-300">{editCourse ? "Edit mode" : "Create new"}</p>
      </div>

      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm uppercase tracking-wider text-gray-300" htmlFor="courseTitle">
          Course Title <sup className="text-white">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-red-400">Course title is required</span>
        )}
      </div>

      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm uppercase tracking-wider text-gray-300" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-white">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 placeholder-gray-400 text-white min-h-[120px] focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-red-400">Course Description is required</span>
        )}
      </div>

      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm uppercase tracking-wider text-gray-300" htmlFor="coursePrice">
          Course Price <sup className="text-white">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 pl-12 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <HiOutlineCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-300" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-red-400">Course Price is required</span>
        )}
      </div>

      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm uppercase tracking-wider text-gray-300" htmlFor="courseCategory">
          Course Category <sup className="text-white">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" disabled className="text-gray-400">Choose a Category</option>
          {!loading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id} className="text-black">
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-red-400">Course Category is required</span>
        )}
      </div>

      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm uppercase tracking-wider text-gray-300" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-white">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 placeholder-gray-400 text-white min-h-[120px] focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-red-400">Benefits of the course is required</span>
        )}
      </div>

      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className="flex cursor-pointer items-center gap-x-2 rounded-lg border border-white/20 bg-transparent py-2 px-4 font-semibold text-white hover:bg-white/5"
          >
            Continue Without Saving
          </button>
        )}
      {/* replace IconBtn with a native submit button so handleSubmit runs */}
<button
  type="submit"
  disabled={loading}
  className="rounded-lg bg-white text-black px-4 py-2 font-semibold hover:opacity-95"
>
  {!editCourse ? "Next" : "Save Changes"} <MdNavigateNext className="inline-block ml-1" />
</button>

      </div>
    </form>
  )
}
