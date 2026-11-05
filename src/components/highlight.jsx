// Tiny syntax highlighter (Kotlin / Gradle / XML). No extra library needed.
const KEYWORDS = new Set([
  'package','import','class','object','interface','fun','val','var','if','else','when','return',
  'override','private','public','data','sealed','abstract','suspend','companion','is','in','for',
  'while','try','catch','null','true','false','this','by','as','enum','const','lateinit','init',
  'plugins','dependencies','implementation','ksp','id','version','apply','testImplementation',
  'androidTestImplementation','debugImplementation','platform',
])

const KOTLIN_RE =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(@\w+)|(\b\d+(?:\.\d+)?[fL]?\b)|(\b[A-Za-z_]\w*\b)|([\s\S])/g

const XML_RE = /(<!--.*?-->)|(<\/?[\w.]+)|([\w:.]+)(=)("[^"]*")|(\/?>)|([\s\S])/g

const C = {
  comment: '#7A7E85', string: '#6AAB73', anno: '#B3AE60', num: '#2AACB8',
  kw: '#CF8E6D', type: '#4B9CD3', tag: '#D5B778', attr: '#9876AA',
}

function kotlinLine(line) {
  const out = []
  let m, i = 0
  KOTLIN_RE.lastIndex = 0
  while ((m = KOTLIN_RE.exec(line)) !== null) {
    const [t, com, str, anno, num, word] = m
    let color
    if (com) color = C.comment
    else if (str) color = C.string
    else if (anno) color = C.anno
    else if (num) color = C.num
    else if (word) color = KEYWORDS.has(word) ? C.kw : /^[A-Z]/.test(word) ? C.type : undefined
    out.push(color ? <span key={i++} style={{ color }}>{t}</span> : t)
  }
  return out
}

function xmlLine(line) {
  const out = []
  let m, i = 0
  XML_RE.lastIndex = 0
  while ((m = XML_RE.exec(line)) !== null) {
    if (m[1]) out.push(<span key={i++} style={{ color: C.comment }}>{m[1]}</span>)
    else if (m[2] || m[6]) out.push(<span key={i++} style={{ color: C.tag }}>{m[0]}</span>)
    else if (m[3]) {
      out.push(<span key={i++} style={{ color: C.attr }}>{m[3]}</span>)
      out.push('=')
      out.push(<span key={i++} style={{ color: C.string }}>{m[5]}</span>)
    } else out.push(m[0])
  }
  return out
}

export function highlightLine(line, lang) {
  return lang === 'xml' ? xmlLine(line) : kotlinLine(line)
}
