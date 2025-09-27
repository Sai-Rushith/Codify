import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function RequirementsField({
  name,
  label = "Requirements/Instructions",
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [requirement, setRequirement] = useState("")
  const [requirementsList, setRequirementsList] = useState([])

  useEffect(() => {
    // populate from course when editing (safely handle undefined)
    if (editCourse && Array.isArray(course?.instructions)) {
      setRequirementsList(course.instructions)
    }

    // register the field with react-hook-form (validate non-empty array)
    register(name, {
      required: true,
      validate: (value) => Array.isArray(value) && value.length > 0,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // sync with RHF whenever list changes
    setValue(name, requirementsList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementsList])

  const handleAddRequirement = () => {
    const trimmed = requirement.trim()
    if (!trimmed) return
    setRequirementsList((prev) => [...prev, trimmed])
    setRequirement("")
  }

  const handleRemoveRequirement = (index) => {
    setRequirementsList((prev) => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddRequirement()
    }
  }

  return (
    <div className="flex flex-col space-y-3">
      <label className="text-sm uppercase tracking-wide text-gray-300" htmlFor={name}>
        {label} <sup className="text-pink-400">*</sup>
      </label>

      <div className="flex items-center gap-3">
        <input
          id={name}
          type="text"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a requirement and press Enter or click Add"
          className="flex-1 rounded-2xl bg-white/5 border border-white/8 px-4 py-2 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/10"
          aria-label="Add requirement"
        />

        <button
          type="button"
          onClick={handleAddRequirement}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm hover:opacity-95 transition"
        >
          Add
        </button>
      </div>

      {requirementsList.length > 0 && (
        <ul className="mt-2 space-y-2">
          {requirementsList.map((req, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-4 rounded-lg bg-white/6 px-3 py-2 text-gray-200"
            >
              <span className="break-words">{req}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="text-xs text-pink-400 hover:underline"
                aria-label={`Remove requirement ${index + 1}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors?.[name] && (
        <span className="ml-2 text-xs tracking-wide text-red-400">{label} is required</span>
      )}
    </div>
  )
}
