import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../util/dateFormatter"
import IconBtn from "../../common/IconBtn1"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
console.log("user:",user);
  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-white mt-20">My Profile</h1>

      {/* Profile header */}
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black p-8">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover ring-2 ring-white/6"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-white">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-gray-300">{user?.email}</p>
          </div>
        </div>

        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings")
          }}
          // keep IconBtn usage — styling is expected inside IconBtn1
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* About */}
      <div className="my-10 rounded-lg border border-white/10 bg-black p-8">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-white">About</p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <p
          className={`mt-4 text-sm font-medium ${
            user?.additionalDetails?.about ? "text-white" : "text-gray-400"
          }`}
        >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>

      {/* Personal details */}
      <div className="my-10 rounded-lg border border-white/10 bg-black p-8">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-white">Personal Details</p>

          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="mt-6 flex max-w-[900px] flex-col gap-y-6 md:flex-row md:justify-between">
          <div className="flex flex-1 flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-gray-400">First Name</p>
              <p className="text-sm font-medium text-white">
                {user?.firstName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">Email</p>
              <p className="text-sm font-medium text-white">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">Gender</p>
              <p className="text-sm font-medium text-white">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-gray-400">Last Name</p>
              <p className="text-sm font-medium text-white">
                {user?.lastName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">Phone Number</p>
              <p className="text-sm font-medium text-white">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">Date Of Birth</p>
              <p className="text-sm font-medium text-white">
               <p className="text-sm font-medium text-white">
   {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
</p>

              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
