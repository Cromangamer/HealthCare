import React from "react"


function App() {
  return (
    <main className="care24-page min-h-screen bg-transparent px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="care24-card care24-card--elevated overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="care24-badge">Care24 Design System</span>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Premium healthcare UI, grounded in one trusted visual language.
                </h1>
                <p className="max-w-xl text-base text-slate-600 sm:text-lg">
                  This foundation keeps buttons, cards, forms, badges, and motion consistent across the entire Care24 experience.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="care24-btn care24-btn--primary">Launch dashboard</button>
              <button className="care24-btn care24-btn--ghost">View system</button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="care24-card p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Core tokens</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">Design primitives ready to reuse</h2>
              </div>
              <span className="care24-badge care24-badge--success">Consistent</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="care24-widget p-4">
                <p className="text-sm font-semibold text-slate-700">Buttons</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="care24-btn care24-btn--primary">Primary</button>
                  <button className="care24-btn care24-btn--secondary">Secondary</button>
                </div>
              </article>
              <article className="care24-widget p-4">
                <p className="text-sm font-semibold text-slate-700">Badges & alerts</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="care24-badge">New</span>
                  <span className="care24-badge care24-badge--success">Stable</span>
                </div>
                <div className="care24-alert care24-alert--success mt-3">
                  Care24 states remain calm, readable, and trustworthy.
                </div>
              </article>
            </div>
          </div>

          <aside className="care24-card p-6 sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">System overview</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">Colors</p>
                <p className="mt-1">Trusted medical palette with premium contrast.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">Motion</p>
                <p className="mt-1">Soft transitions, hover lift, and modal motion.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">Spacing</p>
                <p className="mt-1">Consistent rhythm for every component surface.</p>
              </div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  )

}

export default App
