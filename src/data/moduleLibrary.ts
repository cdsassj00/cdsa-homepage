// 「AI 커리큘럼·실습모듈 라이브러리」 시트를 scripts/build_module_library.py 로 변환한 데이터.
// 첫 화면 용량을 늘리지 않도록 번들에 넣지 않고 빌더를 열 때 내려받는다.
export type Grade = 'g' | 'b' | 'k'
export type Usage = [role: string, how: string]

export interface LibraryModule {
  id: string
  t: number
  name: string
  desc: string
  out: string
  g: Grade
  tools: string
  inner: boolean
  parent: string
  pub: Usage[]
  biz: Usage[]
  tasks: string[]
  /** 검색용 소문자 묶음. 내려받은 뒤 만든다. */
  blob: string
}

export interface ModuleLibrary {
  themes: { name: string; desc: string }[]
  modules: LibraryModule[]
}

export const MODULE_COUNT = 189

let pending: Promise<ModuleLibrary> | null = null

export function loadLibrary(): Promise<ModuleLibrary> {
  if (pending) return pending
  pending = fetch('/data/module-library.json')
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status))
      return r.json() as Promise<ModuleLibrary>
    })
    .then((lib) => {
      for (const m of lib.modules) {
        m.blob = [m.id, m.name, m.desc, m.out, m.tools, ...m.pub.flat(), ...m.biz.flat(), ...m.tasks]
          .join(' ')
          .toLowerCase()
      }
      return lib
    })
    .catch((e) => {
      pending = null
      throw e
    })
  return pending
}
