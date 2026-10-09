// 우하단 플로팅 스택(관점·인사이트 / 연관 사이트 / 챗 아바타) 조정 버스.
// 패널은 한 번에 하나만 열리고, 다른 패널이 열리면 아바타는 작게 줄어든다.
export type PanelId = 'insights' | 'sites' | 'chat' | null

const EVT = 'cdsa:floating-panel'

export function announcePanel(id: PanelId) {
  window.dispatchEvent(new CustomEvent<PanelId>(EVT, { detail: id }))
}

export function onPanelChange(cb: (id: PanelId) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<PanelId>).detail)
  window.addEventListener(EVT, handler)
  return () => window.removeEventListener(EVT, handler)
}
