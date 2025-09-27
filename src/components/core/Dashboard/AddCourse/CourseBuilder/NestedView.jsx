import React, { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import SubSectionModal from "./SubSectionModal";

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // States to keep track of mode of modal [add, view, edit]
  const [addSubSection, setAddSubsection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleleSection = async (sectionId) => {
    const result = await deleteSection({ sectionId, courseId: course._id, token });
    if (result) {
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token });
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setConfirmationModal(null);
  };

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-black/60 p-6 shadow-lg">
        {course?.courseContent?.map((section) => (
          <details key={section._id} open className="group mb-4 rounded-lg overflow-hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-4 bg-white/3 px-5 py-4 hover:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/5 border border-white/8">
                  <RxDropdownMenu className="text-lg text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-base">{section.sectionName}</p>
                  <p className="text-xs text-white/60 mt-0.5">{section.subSection.length} lectures</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangeEditSectionName(section._id, section.sectionName);
                  }}
                  title="Edit section"
                  className="rounded-md p-2 hover:bg-white/5"
                >
                  <MdEdit className="text-white/80 text-lg" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleleSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    });
                  }}
                  title="Delete section"
                  className="rounded-md p-2 hover:bg-white/5"
                >
                  <RiDeleteBin6Line className="text-white/80 text-lg" />
                </button>

                <div className="text-white/60">|</div>
                <AiFillCaretDown className="text-white/70 text-xl" />
              </div>
            </summary>

            <div className="bg-white/2 px-6 py-4">
              {section.subSection.map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between gap-3 border-b border-white/6 py-3 hover:bg-white/5 px-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/4 border border-white/8">
                      <RxDropdownMenu className="text-white text-base" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{data.title}</p>
                      <p className="text-xs text-white/60 mt-0.5">{data.duration ? data.duration : "No video"}</p>
                    </div>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-3"
                  >
                    <button
                      onClick={() => setEditSubSection({ ...data, sectionId: section._id })}
                      title="Edit lecture"
                      className="rounded-md p-2 hover:bg-white/5"
                    >
                      <MdEdit className="text-white/80 text-lg" />
                    </button>

                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Sub-Section?",
                          text2: "This lecture will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                      title="Delete lecture"
                      className="rounded-md p-2 hover:bg-white/5"
                    >
                      <RiDeleteBin6Line className="text-white/80 text-lg" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-3 flex items-center">
                <button
                  onClick={() => setAddSubsection(section._id)}
                  className="inline-flex items-center gap-2 rounded-md bg-white text-black px-3 py-2 text-sm font-semibold shadow-sm"
                >
                  <FaPlus className="text-sm" />
                  <span>Add Lecture</span>
                </button>
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* Modal Display */}
      {addSubSection ? (
        <SubSectionModal modalData={addSubSection} setModalData={setAddSubsection} add={true} />
      ) : viewSubSection ? (
        <SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true} />
      ) : editSubSection ? (
        <SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true} />
      ) : (
        <></>
      )}

      {/* Confirmation Modal */}
      {confirmationModal ? <ConfirmationModal modalData={confirmationModal} /> : <></>}
    </>
  );
}
