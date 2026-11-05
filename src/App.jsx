import { useState } from 'react'
import { Menu, PanelRight, FolderOpen, FileText, ChevronDown, ChevronRight, X } from 'lucide-react'
import experiments from './data/experiments.js'
import CodeBlock from './components/CodeBlock.jsx'
import CopyButton from './components/CopyButton.jsx'

// Build the text used by "Copy All Code"
function buildAll(exp) {
  const parts = []
  exp.gradle.forEach((g) => parts.push('// ===== ' + g.name + ' =====\n' + g.code))
  if (exp.manifest) parts.push('<!-- ===== AndroidManifest.xml ===== -->\n' + exp.manifest)
  exp.files.forEach((f) => parts.push('// ===== ' + f.path + f.name + ' =====\n' + f.code))
  return parts.join('\n\n')
}

function Label({ children }) {
  return <div className="mb-2 mt-1 text-xs font-semibold uppercase tracking-wider text-fg/50">{children}</div>
}

function Experiment({ exp }) {
  const [qOpen, setQOpen] = useState(false)
  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-4 rounded border border-line bg-side">
        <button
          onClick={() => setQOpen(!qOpen)}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-fg/80 hover:text-fg"
        >
          {qOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          Original Question
        </button>
        {qOpen && (
          <div className="whitespace-pre-line border-t border-line px-4 py-3 text-sm text-fg/80">
            {exp.question}
          </div>
        )}
      </div>

      <Label>Required Dependencies</Label>
      {exp.gradle.map((g) => (
        <CodeBlock key={g.name} name={g.name} code={g.code} lang="kotlin" />
      ))}
      {exp.manifest ? (
        <CodeBlock name="AndroidManifest.xml" path="app/src/main/" code={exp.manifest} lang="xml" />
      ) : (
        <div className="mb-5 rounded border border-line px-3 py-2 text-sm text-fg/60">
          AndroidManifest.xml: no change needed for this experiment.
        </div>
      )}

      <Label>Kotlin Code</Label>
      {exp.files.map((f) => (
        <CodeBlock key={f.path + f.name} name={f.name} path={f.path} code={f.code} />
      ))}
    </div>
  )
}

export default function App() {
  const [index, setIndex] = useState(0)
  const [sideOpen, setSideOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(true)
  const exp = experiments[index]

  return (
    <div className="flex h-full bg-bg text-fg">
      {/* LEFT SIDEBAR */}
      {sideOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSideOpen(false)} />}
      <aside
        className={
          'fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-line bg-side lg:static ' +
          (sideOpen ? '' : 'hidden lg:flex')
        }
      >
        <div className="flex items-center justify-between border-b border-line px-3 py-3">
          <div className="text-sm font-bold tracking-wide text-blue">MAD LAB CODE STUDIO</div>
          <button className="lg:hidden" onClick={() => setSideOpen(false)}><X size={16} /></button>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-fg/50">
          <FolderOpen size={14} /> Experiments
        </div>
        <nav className="flex-1 overflow-y-auto pb-3">
          {experiments.map((e, i) => (
            <button
              key={e.id}
              onClick={() => { setIndex(i); setSideOpen(false) }}
              className={
                'flex w-full items-center gap-2 px-5 py-1.5 text-left text-sm ' +
                (i === index ? 'bg-blue/20 text-white' : 'text-fg/80 hover:bg-line/50')
              }
            >
              <FileText size={14} className={i === index ? 'text-blue' : 'text-fg/40'} />
              Experiment {e.id}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN EDITOR */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-line bg-side px-3 py-2">
          <button className="lg:hidden" onClick={() => setSideOpen(true)}><Menu size={18} /></button>
          <div className="min-w-0 flex-1 truncate text-sm">
            <span className="text-blue">Experiment {exp.id}</span>
            <span className="text-fg/40"> — </span>
            <span className="font-medium">{exp.title}</span>
          </div>
          <CopyButton getText={() => buildAll(exp)} label="Copy All Code" className="!border-blue/60" />
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            title="Explanation"
            className={'rounded border border-line p-1 hover:bg-line/60 ' + (panelOpen ? 'text-blue' : '')}
          >
            <PanelRight size={15} />
          </button>
        </header>

        <div className="flex min-h-0 flex-1">
          <main key={exp.id} className="min-w-0 flex-1 overflow-y-auto">
            <Experiment exp={exp} />
          </main>

          {/* RIGHT PANEL: explanation */}
          {panelOpen && (
            <aside className="fixed inset-y-0 right-0 z-30 w-80 overflow-y-auto border-l border-line bg-side p-4 lg:static lg:z-auto">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-green">Explanation</div>
                <button className="lg:hidden" onClick={() => setPanelOpen(false)}><X size={16} /></button>
              </div>
              <ul className="space-y-3 text-sm text-fg/85">
                {exp.explain.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green">›</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
