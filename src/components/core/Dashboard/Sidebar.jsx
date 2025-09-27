import React, { useState } from 'react'
import {  BookOpen, ShoppingCart, Bookmark, Settings, LogOut, User, Layers,Gauge,Airplay,CopyPlus } from 'lucide-react'

import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../common/ConfirmationModal"



// Sidebar.jsx
// TailwindCSS + React single-file sidebar component in a black & white theme.
// - Responsive (collapses to icons)
// - Active item highlight, subtle gradients & dividers
// - Copy this file into your project and render <Sidebar /> alongside your main content

export default function Sidebar({ onNavigate = () => {} }) {
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState('profile')
  const [modalData, setModalData] = useState(null);
    const { user } = useSelector((state) => state.profile)

   const dispatch = useDispatch()
  const navigate = useNavigate()
 
 
const nav = user.accountType === "Student"
  ? [
      { id: 'my-profile', label: 'My Profile', icon: User },
      { id: 'enrolled-courses',    label: 'Enrolled Courses', icon: BookOpen },
      { id: 'cart',       label: 'Cart', icon: ShoppingCart },
    ]
  : [
      { id: 'my-profile', label: 'My Profile', icon: User },
      { id: 'dashboard',  label: 'Dashboard', icon: Gauge },
      { id: 'my-course',  label: 'My Course', icon: Airplay },
      { id: 'add-course', label: 'Add Course', icon: CopyPlus },
    ];  


  function handleNav(id) {
    setActive(id)
    onNavigate(id)
       const path = `/dashboard/${encodeURIComponent(id)}`; // encode to be safe
    navigate(path);  
  }

  function openLogoutModal() {
    setModalData({
      text1: "Are you sure?",
      text2: "You will be logged out of your account.",
      btn1Handler:  () => dispatch(logout(navigate)),
      btn1Text:"Logout",
      btn2Handler:  () => setModalData(null),
      btn2Text: "Cancel",
    });
  }

  return (
    <aside className={`flex flex-col h-screen ${collapsed ? 'w-20' : 'w-64'} transition-all duration-200 bg-gradient-to-b from-black to-slate-900 text-white shrink-0 mt-20`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center rounded-md ${collapsed ? 'w-10 h-10' : 'w-12 h-12'} bg-white/5 border border-white/10`}>
            <span className="font-bold text-lg">C</span>
          </div>
          {!collapsed && (
            <div>
              <div className="text-sm font-semibold">Codify</div>
              <div className="text-xs text-white/70">Learn fast — learn well</div>
            </div>
          )}
        </div>

        <button
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed((s) => !s)}
          className="p-2 rounded-md bg-white/6 hover:bg-white/10"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {collapsed ? (
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            ) : (
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {nav.map((n) => {
            const Icon = n.icon
            const isActive = active === n.id
            return (
              <li key={n.id}>
                <button
                  onClick={() => handleNav(n.id)}
                  className={`group flex items-center gap-3 w-full text-sm rounded-md px-3 py-2 transition-colors duration-150 ${
                    isActive
                      ? 'bg-white/8 ring-1 ring-white/15 text-white'
                      : 'text-white/80 hover:bg-white/4 hover:text-white'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center rounded-md p-2 ${isActive ? 'bg-white/10' : 'bg-transparent'}`}>
                    <Icon className="w-5 h-5" />
                  </span>

                  {!collapsed && (
                    <span className="flex-1 text-left">{n.label}</span>
                  )}

                  {!collapsed && (
                    <span className="text-xs text-white/60">{n.id === 'courses' ? '4' : ''}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="my-4 border-t border-white/6" />

        <div className="px-1">
          {!collapsed && <div className="text-xs text-white/60 uppercase px-3 mb-2">Quick links</div>}
          <div className="grid gap-2">
          

            <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-white/4 transition-colors"
                onClick={() => handleNav("settings")}     
            >
              <Settings className="w-4 h-4 opacity-90" />
              {!collapsed && <span className="text-white/90">Settings</span>}
            </button>
          </div>
        </div>
      </nav>

      <div className="p-3 mb-20">
        <div className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${collapsed ? 'justify-center' : ''} bg-white/3`}>
          <div className="flex items-center gap-3">
           <div>
              <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[50px] rounded-full object-cover ring-2 ring-white/6"
          />
           </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-medium">  {user?.firstName + " " + user?.lastName}</div>
                <div className="text-xs text-white/60">{user?.accountType}</div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button className="ml-auto px-3 py-1 rounded-md bg-white/6 hover:bg-white/10 text-sm" onClick={() => alert('Open profile')}>
              View
            </button>
          )}
        </div>

        <button
           onClick={openLogoutModal}
          className="mt-3 w-full flex items-center gap-3 justify-center py-2 rounded-md bg-white text-black hover:opacity-95 transition"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="font-medium">Logout</span>}
            <ConfirmationModal modalData={modalData} />
        </button>
      </div>
    </aside>
  )
}

/* ---------------- small helper icons (fallback) ---------------- */
function AwardIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
      <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8M12 2l2 4h-4l2-4z" />
    </svg>
  )
}
