import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { logout } from "../../../services/operations/authAPI"

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  if (!user) return null

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase()

  return (
    <div className="relative">
      <button
        className="inline-flex items-center gap-3 rounded-full bg-white px-3 py-1 transition-shadow duration-150 hover:shadow-md"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="flex items-center gap-x-2">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
            {user?.image ? (
              <img
                src={user.image}
                alt={`profile-${user?.firstName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-gray-800 text-sm font-semibold text-white">{initials}</span>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-white bg-green-500" />
          </div>
          <AiOutlineCaretDown className={`text-sm text-black transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
        </div>
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-[118%] z-[1000] w-72 overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-2xl"
          ref={ref}
        >
          {/* header - user info (dark) */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={`profile-${user?.firstName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-gray-700 text-sm font-semibold text-white">{initials}</span>
                )}
              </div>

              <div className="truncate">
                <div className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</div>
                {user?.email && (
                  <div className="text-xs text-gray-300 truncate">{user.email}</div>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-800" />

          <div className="flex flex-col py-2">
            <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-x-3 px-4 py-2 text-sm text-white hover:bg-gray-800">
                <VscDashboard className="text-lg text-white" />
                <span>Dashboard</span>
              </div>
            </Link>

            <div
              onClick={() => {
                dispatch(logout(navigate))
                setOpen(false)
              }}
              className="flex cursor-pointer items-center gap-x-3 px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              <VscSignOut className="text-lg text-white" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
