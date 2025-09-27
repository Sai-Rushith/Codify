import React, { useState, useMemo } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses = [] }) {
  const [currChart, setCurrChart] = useState("students")

  // Memoize colors so they don't re-generate on every render (avoids flicker)
  const chartColors = useMemo(() => {
    const num = courses?.length || 0
    const colors = []
    for (let i = 0; i < num; i++) {
      // generate slightly saturated colors for good contrast on white background
      const r = Math.floor(80 + Math.random() * 140)
      const g = Math.floor(80 + Math.random() * 140)
      const b = Math.floor(80 + Math.random() * 140)
      colors.push(`rgb(${r}, ${g}, ${b})`)
    }
    return colors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses?.length])

  // Guard for empty courses
  const labels = (courses || []).map((c) => c.courseName || "Untitled")
  const studentsData = (courses || []).map((c) => Number(c.totalStudentsEnrolled) || 0)
  const incomeData = (courses || []).map((c) => Number(c.totalAmountGenerated) || 0)

  const chartDataStudents = {
    labels,
    datasets: [
      {
        data: studentsData,
        backgroundColor: chartColors,
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  }

  const chartIncomeData = {
    labels,
    datasets: [
      {
        data: incomeData,
        backgroundColor: chartColors,
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          // dark text for visibility on white card
          color: "#0f172a",
          boxWidth: 12,
          boxHeight: 12,
          padding: 12,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: currChart === "students" ? "Students per course" : "Income per course",
        color: "#0f172a",
        font: {
          size: 16,
          weight: "600",
        },
        padding: {
          top: 6,
          bottom: 12,
        },
      },
      tooltip: {
        // default tooltip is fine; this ensures good contrast
        bodyColor: "#0f172a",
        titleColor: "#0f172a",
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
      },
    },
  }

  return (
    <div className="bg-white text-black rounded-xl shadow-md p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-lg font-semibold">Visualize</p>
          <p className="text-xs text-gray-500">Toggle between students and income</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrChart("students")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-all ${
              currChart === "students"
                ? "bg-black text-white shadow"
                : "bg-gray-100 text-black hover:bg-gray-200"
            }`}
          >
            Students
          </button>

          <button
            onClick={() => setCurrChart("income")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-all ${
              currChart === "income"
                ? "bg-black text-white shadow"
                : "bg-gray-100 text-black hover:bg-gray-200"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <div className="h-72 md:h-96">
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  )
}
