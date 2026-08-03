function Blog(){
  const articles = [["Planning care after a hospital stay","A simple checklist for arranging practical, calm support at home."],["How to involve an older loved one in care decisions","Small conversations that help everyone feel heard and respected."],["What to look for in home-care support","A clear guide to matching care needs with the right professional."]];
  return <main className="care24-page mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><section className="care24-card care24-card--elevated rounded-[2rem] p-7 sm:p-10"><span className="care24-badge">Care guide</span><h1 className="mt-4 text-4xl font-semibold text-slate-900">Helpful notes for healthier care decisions</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Practical guidance for patients, families, and caregivers navigating support at home.</p></section><section className="mt-6 grid gap-5 md:grid-cols-3">{articles.map(([title, summary])=><article key={title} className="care24-card p-6"><p className="text-xs font-semibold uppercase tracking-[.16em] text-secondary">Care24 guide</p><h2 className="mt-3 text-xl font-semibold text-slate-900">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{summary}</p><button className="mt-5 text-sm font-semibold text-primary">Read article →</button></article>)}</section></main>
}

export default Blog;

