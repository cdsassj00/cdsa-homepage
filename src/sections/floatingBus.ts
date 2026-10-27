// 우하단 플로팅 스택(관점·인사이트 / 연관 사이트 / 챗 아바타) 조정 버스.
// 패널은 한 번에 하나만 열리고, 다른 패널이 열리면 아바타는 작게 줄어든다.
export type PanelId = 'insights' | 'sites' | 'chat' | null

const EVT = 'cdsa:floating-panel'

export function announcePanel(id: PanelId) {
  window.dispatchEvent(new CustomEvent<PanelId>(EVT, { detail: id }))
}

const MAIL_EVT = 'cdsa:open-mail'

/** 페이지 어디서든 우하단 챗 패널을 '신성진 대표에게 직접 메일 보내기' 폼으로 연다. */
export function openMailForm() {
  window.dispatchEvent(new Event(MAIL_EVT))
}

export function onOpenMailForm(cb: () => void) {
  window.addEventListener(MAIL_EVT, cb)
  return () => window.removeEventListener(MAIL_EVT, cb)
}

export function onPanelChange(cb: (id: PanelId) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<PanelId>).detail)
  window.addEventListener(EVT, handler)
  return () => window.removeEventListener(EVT, handler)
}
