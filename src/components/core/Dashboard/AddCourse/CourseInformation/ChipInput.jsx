import { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

export default function ChipInput({
  label = "Tags",
  name,
  placeholder = "Enter tags and press Enter",
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [chips, setChips] = useState([])
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (editCourse && Array.isArray(course?.tag)) {
      setChips(course.tag)
    }

    register(name, {
      required: true,
      validate: (value) => Array.isArray(value) && value.length > 0,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, chips)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])

  const addChip = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    if (chips.includes(trimmed)) {
      setInputValue("")
      return
    }
    setChips((prev) => [...prev, trimmed])
    setInputValue("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addChip()
    }
  }

  const removeChip = (index) => {
    setChips((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm uppercase tracking-wide text-gray-300" htmlFor={name}>
        {label} <sup className="text-pink-400">*</sup>
      </label>

      <div className="flex w-full flex-wrap gap-2">
        {chips.map((chip, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-sm text-white"
          >
            <span className="break-words">{chip}</span>
            <button
              type="button"
              onClick={() => removeChip(index)}
              aria-label={`Remove ${chip}`}
              className="rounded-full p-1 hover:bg-white/8 focus:outline-none"
            >
              <MdClose className="text-xs text-gray-200" />
            </button>
          </span>
        ))}

        <input
          id={name}
          name={name}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 min-w-[160px] rounded-2xl bg-white/5 border border-white/8 px-4 py-2 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/10"
          aria-label="Add tag"
        />

        <button
          type="button"
          onClick={addChip}
          className="ml-2 rounded-lg bg-white px-3 py-1 text-sm font-semibold text-black shadow-sm hover:opacity-95 transition"
          aria-label="Add tag button"
        >
          Add
        </button>
      </div>

      {errors?.[name] && (
        <span className="ml-2 text-xs tracking-wide text-red-400">{label} is required</span>
      )}
    </div>
  )
}
