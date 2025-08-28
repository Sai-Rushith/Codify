import React from "react";

import { Link } from "react-router-dom"
// Codify - About Us (React + Tailwind) - JavaScript (JSX)
// Drop this file into your React project (e.g. src/components/AboutUs.jsx)

export default function AboutUs() {
  const stats = [
    { label: "Students", value: "25K+" },
    { label: "Courses", value: "120+" },
    { label: "Avg. Rating", value: "4.8/5" },
  ];

  const features = [
    {
      title: "Affordable Learning",
      desc: "High-quality courses at prices students can actually afford.",
    },
    {
      title: "Expert Instructors",
      desc: "Practising engineers and educators who teach with clarity.",
    },
    {
      title: "Practical Projects",
      desc: "Hands-on assignments and real-world projects to build your portfolio.",
    },
  ];

  const team = [
    { name: "Asha Rao", role: "Founder & CEO", bio: "Ex‑software engineer turned educator. Passionate about teaching clean code." },
    { name: "Rahul Verma", role: "Head of Curriculum", bio: "CS researcher who builds concise and effective learning paths." },
    { name: "Meera Joshi", role: "Community Lead", bio: "Connects students to mentors and tracks outcomes." },
  ];

  const testimonials = [
    {
      name: "Udit Aren",
      text: "Codify helped me land my first developer job — the projects and mentorship were game changers.",
    },
    {
      name: "N. Priya",
      text: "Clear explanations, friendly instructors and extremely affordable. Highly recommend!",
    },
      {
      name: "M. Ruchitha",
      text: "Started from Scratch to Advanced ,Fablous Teaching!...",
    },
      {
      name: "K. Patel",
      text: "Very Affordable and Worth every Penny",
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-black font-bold rounded-md flex items-center justify-center">C</div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Codify</h1>
              <p className="text-xs text-white/60">Learn every tech — small price, big impact</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#courses" className="hover:text-white">Courses</a>
            <a href="#team" className="hover:text-white">Team</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <button className="ml-2 px-4 py-2 rounded-lg bg-white text-black font-medium shadow-sm">Join Now</button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">About Codify</h2>
            <p className="mt-4 text-white/80 max-w-2xl">
              Codify was created to make high-quality tech education accessible to everyone. We combine clear teaching,
              practical projects, and community mentorship — all at a price students can afford. Our focus is on results:
              real skills, proven outcomes, and confidence to build.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 text-sm font-semibold hover:bg-white/5"
              >
                Explore Courses
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 text-sm font-semibold hover:bg-white/10"
              >
                Get in Touch
              </Link>
            </div>

            <div className="mt-10 flex gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-sm text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: mock card */}
          <div className="">
            <div className="rounded-2xl p-6 border border-white/6 shadow-lg bg-gradient-to-b from-white/3 to-white/2">
              <h3 className="text-xl font-semibold">Our teaching approach</h3>
              <p className="mt-3 text-white/80">
                Short focused lessons, weekly projects, and regular feedback. We encourage learning by building — each
                module ends with a project you can show in your portfolio.
              </p>

              <ul className="mt-6 space-y-4">
                {features.map((f) => (
                  <li key={f.title} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg font-semibold">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold">{f.title}</div>
                      <div className="text-sm text-white/70">{f.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-3">
                <div className="text-sm text-white/70">Trusted by students across the globe</div>
                <div className="h-1 bg-white/10 rounded-full flex-1" />
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="mt-16">
          <h3 className="text-2xl font-bold">Meet the Team</h3>
          <p className="mt-2 text-white/70 max-w-2xl">A small team of builders, teachers and community leaders — focused on your success.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((m) => (
              <div key={m.name} className="p-6 rounded-2xl bg-white/3 border border-white/6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white text-black flex items-center justify-center font-bold">{m.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}</div>
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-sm text-white/70">{m.role}</div>
                  </div>
                </div>
                <p className="mt-4 text-white/80 text-sm">{m.bio}</p>
                {/* <div className="mt-4 flex gap-3">
                  <button className="px-3 py-1 rounded-md bg-white/6 text-sm">View profile</button>
                  <button className="px-3 py-1 rounded-md border border-white/6 text-sm">Message</button>
                </div> */}
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold">What students say</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="p-6 rounded-2xl bg-white/4 border border-white/6">
                <p className="text-white/90">"{t.text}"</p>
                <footer className="mt-4 text-sm text-white/70">— {t.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="mt-16 mb-24 rounded-2xl p-8 bg-gradient-to-r from-white/3 to-white/2 border border-white/6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold">Ready to start learning?</h3>
              <p className="mt-2 text-white/70">Join Codify and get access to curated courses and mentorship.</p>
            </div>

            <form className="mt-4 sm:mt-0 sm:flex items-center gap-3">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Your email"
                className="px-4 py-3 rounded-lg bg-black/70 border border-white/6 placeholder-white/40 text-white focus:outline-none"
              />
              <button type="submit" className="px-5 py-3 rounded-lg bg-white text-black font-semibold">Notify me</button>
            </form>
          </div>
        </section>
      </main>

    
    </div>
  );
}
