function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-3xl rounded-lg border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-wider text-cyan-300">
          React + Vite + Tailwind CSS + TypeScript
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-6xl">
          Rian App
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Proyecto listo para desarrollar con componentes React, tipado con
          TypeScript y estilos usando utilidades de Tailwind CSS.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950">
            Vite
          </span>
          <span className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-950">
            React
          </span>
          <span className="rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-950">
            Tailwind
          </span>
          <span className="rounded-md bg-amber-300 px-3 py-2 text-sm font-semibold text-slate-950">
            TypeScript
          </span>
        </div>
      </section>
    </main>
  )
}

export default App
