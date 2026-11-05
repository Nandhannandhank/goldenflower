import { FileCode2 } from 'lucide-react'
import CopyButton from './CopyButton.jsx'
import { highlightLine } from './highlight.jsx'

export default function CodeBlock({ name, path, code, lang = 'kotlin' }) {
  const lines = code.replace(/\n$/, '').split('\n')

  return (
    <div className="mb-5 overflow-hidden rounded border border-line bg-bg">
      <div className="flex items-center justify-between border-b border-line bg-side px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <FileCode2 size={15} className="shrink-0 text-blue" />
          <span className="font-medium text-fg">{name}</span>
          {path && <span className="hidden truncate text-xs text-fg/40 sm:inline">{path}</span>}
        </div>
        <CopyButton getText={() => code} />
      </div>
      <div className="flex overflow-x-auto py-2 font-mono text-[13px] leading-5">
        <pre className="select-none border-r border-line px-3 text-right text-fg/30">
          {lines.map((_, i) => i + 1).join('\n')}
        </pre>
        <pre className="px-4 text-fg">
          {lines.map((l, i) => (
            <div key={i}>{l === '' ? ' ' : highlightLine(l, lang)}</div>
          ))}
        </pre>
      </div>
    </div>
  )
}
