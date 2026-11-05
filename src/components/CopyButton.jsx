import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { copyText } from './copy.js'

export default function CopyButton({ getText, label = 'Copy', className = '' }) {
  const [done, setDone] = useState(false)

  const onClick = async () => {
    const ok = await copyText(getText())
    if (ok) {
      setDone(true)
      setTimeout(() => setDone(false), 1500)
    }
  }

  return (
    <button
      onClick={onClick}
      className={
        'flex items-center gap-1.5 rounded border border-line px-2 py-1 text-xs hover:bg-line/60 ' +
        (done ? 'text-green' : 'text-fg') + ' ' + className
      }
    >
      {done ? <Check size={13} /> : <Copy size={13} />}
      {done ? 'Copied!' : label}
    </button>
  )
}
