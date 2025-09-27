import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors = {},
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ?? editData ?? ""
  )
  const inputRef = useRef(null)

  // register the field; only required when no existing view/edit data
  useEffect(() => {
    const isRequired = !viewData && !editData
    register(name, { required: isRequired })
  }, [register, name, viewData, editData])

  // keep react-hook-form value in sync (file object or null)
  useEffect(() => {
    setValue(name, selectedFile)
  }, [selectedFile, setValue, name])

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles?.[0]
    if (!file) return
    previewFile(file)
    setSelectedFile(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: !video ? { "image/*": [] } : { "video/*": [] },
  })

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => setPreviewSource(reader.result)
  }

  const handleRemove = () => {
    setPreviewSource("")
    setSelectedFile(null)
    setValue(name, null)
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm uppercase tracking-wide text-gray-300" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-400">*</sup>}
      </label>

      {/* Attach dropzone handlers to the outer container so it's always clickable */}
      <div
        {...getRootProps()}
        className={`group relative flex min-h-[220px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-4 py-6 transition-colors ${
          isDragActive ? "border-white/40 bg-white/6" : "border-white/12 bg-white/3"
        }`}
      >
        {/* Always render the hidden input from getInputProps() (do NOT override its ref) */}
        <input {...getInputProps()}  />

        {/* Preview shown when a source exists */}
        {previewSource ? (
          <div className="flex w-full flex-col items-stretch gap-3">
            {!video ? (
              <img
                src={previewSource}
                alt="preview"
                className="w-full rounded-md object-cover"
                style={{ maxHeight: 320 }}
              />
            ) : (
              <video
                src={previewSource}
                controls
                playsInline
                className="w-full rounded-md object-cover"
                style={{ maxHeight: 320 }}
              />
            )}

            <div className="mt-2 flex gap-3">
              {/* Replace always available — because container is clickable */}
              <button
                type="button"
                onClick={() => {
                  // trigger native file dialog by focusing input (getInputProps already wired)
                  inputRef.current?.click?.()
                }}
                className="rounded-lg bg-white px-3 py-1 text-sm font-semibold text-black shadow-sm hover:opacity-95"
              >
                Replace
              </button>

              {/* Allow remove unless view-only data */}
              {!viewData && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="rounded-lg bg-transparent px-3 py-1 text-sm font-medium text-gray-300 hover:text-red-400"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          // No preview: show the upload hint UI
          <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
            <div className="grid aspect-square w-16 place-items-center rounded-full bg-white/6">
              <FiUploadCloud className="text-3xl text-white" />
            </div>

            <div>
              <p className="text-sm text-gray-200">
                Drag & drop an {!video ? "image" : "video"} here, or click to
                browse
              </p>
              <p className="mt-2 text-xs text-gray-400">Recommended: 1024×576 (16:9)</p>
            </div>
          </div>
        )}
      </div>

      {errors?.[name] && (
        <span className="ml-2 text-xs tracking-wide text-red-400">{label} is required</span>
      )}
    </div>
  )
}
