// 유튜브 「신성진 · Work by AX」 채널(@workbyax) 2026-10-25 기준 — RSS·채널 검색으로 수집, Shorts 제외
// 같은 회차를 다시 올린 영상은 조회수가 높은 쪽만 남김

export interface Video {
  id: string
  title: string
  ep?: string
  views?: number
}

export interface Series {
  key: string
  label: string
  desc: string
  more: string
  videos: Video[]
}

export const series: Series[] = [
  {
    key: 'agent',
    label: 'AI 에이전트 업무자동화',
    desc: 'ChatGPT·클로드·Antigravity 에이전트로 문서·사이트·데이터 업무를 자동화하는 27강 연재. 지금도 매주 올라갑니다.',
    more: 'https://www.youtube.com/@workbyax/search?query=AI%20%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8%20%EC%97%85%EB%AC%B4%EC%9E%90%EB%8F%99%ED%99%94',
    videos: [
      { ep: '21/27', id: 'rzfqBPxFlTM', title: '클로드로 화면 캡처를 AI 채팅 사이트로 만들기: 오픈 API 승인받고 연결' },
      { ep: '20/27', id: 'fus4Nbd83iY', title: 'ChatGPT로 구글 드라이브에 폴더 만들기: AI가 다른 서비스를 움직이는 API 원리' },
      { ep: '19/27', id: 'qVtvvcPD7yE', title: '클로드 코드로 엑셀 같은 웹 도구 만들기: HTML 파일 하나와 파이썬 로컬 실행' },
      { ep: '18/27', id: '0bDvZKzvp8k', title: 'AI로 한글(HWP)·CSV·RTF 파일 다루기: 업무 자동화 아이디어 30개 뽑기' },
      { ep: '17/27', id: 'YKRhBSOhhLE', title: '클로드로 하던 작업을 Gemini Antigravity로 갈아타서 이어가기' },
      { ep: '16/27', id: 'Otw6lA1GvKg', title: 'AI로 만든 코드 깃허브에 저장·공유하기: 여러 PC에서 쓰고 API 키 유출 막기' },
      { ep: '15/27', id: 'G7rr3kYJeQk', title: 'ChatGPT·클로드 에이전트 구조 총정리: LLM 혼자서는 왜 일을 못 할까' },
      { ep: '14/27', id: 'jenG3mvYakk', title: 'ChatGPT와 클로드는 어떻게 답을 만들까? 단어를 숫자로 바꾸는 AI의 진짜 원리' },
      { ep: '13/27', id: 'VIAvUujjubo', title: 'AI에 내 문서 넣으면 왜 거짓말할까? 문장을 숫자로 바꿔 답 찾는 RAG 원리' },
      { ep: '12/27', id: 'a1bAK0J5CA8', title: '클로드 Cowork로 내 PC 파일 작업하기: 클로드 웹·앱과 뭐가 다를까' },
      { ep: '11/27', id: 'QjmsnaS9JJE', title: '클로드 Code로 GitHub 자동 배포하기: Cowork와 Code 차이' },
      { ep: '10/27', id: 'DPbiFO9vPys', title: '클로드 코드로 주식 분석 챗봇 만들기: 코딩 몰라도 설치·실행까지 자동' },
      { ep: '09/27', id: 'hnNya4LlIMk', title: 'AI로 HTML 업무 입력 도구 만들기: 입력한 데이터가 안 보이는 이유' },
      { ep: '08/27', id: 'flcLWYAl3T8', title: 'AI로 만든 웹페이지 인터넷에 공개하기: API 키를 백엔드에 숨기는 법' },
      { ep: '07/27', id: '46wqHxGWYa8', title: '클로드 토큰이 끊겨도 다른 AI로 이어서 개발하기: 핸드오버 문서와 Vercel·Supabase' },
      { ep: '06/27', id: 'GcvXagplAk8', title: 'AI로 만든 사이트에 로그인·회원 DB 붙이기: Supabase 연결과 API 키 찾기' },
      { ep: '05/27', id: 'p1TH5vsS2kw', title: '클로드로 내 사이트에 AI 챗봇 달기: API 키는 Supabase에 안전하게' },
      { ep: '04/27', id: '7_VHGu6XBMw', title: '클로드로 PDF 디자인 그대로 내 문서 만들기: 양식을 AI 스킬로 저장하는 법' },
      { ep: '03/27', id: 'M70OC1pgqQE', title: 'AI를 외부 서비스에 연결하기: API와 MCP 차이와 활용법' },
      { ep: '02/27', id: '0vfsJwbMC-4', title: 'ChatGPT로 한글(HWP) 문서 자동 작성: AI가 도구를 불러 파일 만드는 원리' },
      { ep: '01/27', id: 'RT8npwoWHCs', title: 'ChatGPT 에이전트로 검색부터 파일 생성까지 자동으로: 복붙 없는 AI 업무 입문' },
    ],
  },
  {
    key: 'instructor',
    label: 'AI챔피언 강사양성과정',
    desc: '공공 AI챔피언을 가르칠 강사를 키우는 44강 전 과정. LLM 원리부터 스킬·에이전트·배포·폐쇄망 실습, 강의 설계법까지 담았습니다.',
    more: 'https://www.youtube.com/@workbyax/search?query=%EA%B0%95%EC%82%AC%EC%96%91%EC%84%B1',
    videos: [
      { ep: '44/44', id: 'zyQ4GWF6iGc', title: 'VS Code에 코덱스·클로드 코드 붙이고 문서 10개를 3D 그래프로 연결하기' },
      { ep: '42/44', id: '0mlh9pYrk1I', title: 'RSS와 API 완전정리: 외부 데이터를 브라우저로 실시간 가져오기' },
      { ep: '39/44', id: 'ko2Gkrz3Ae8', title: '폐쇄망에서 파이썬 설치하기: PATH 체크가 성패를 가른다' },
      { ep: '38/44', id: 'UZ6TacvKOnc', title: '웹과 앱은 다르다, ChatGPT 스킬 설치부터 내 컴퓨터 CSV 분석까지' },
      { ep: '37/44', id: '3MDN4RCxmbM', title: 'ChatGPT 웹과 데스크톱 앱, 결과물 저장 위치가 완전히 다르다' },
      { ep: '36/44', id: 'vp7w9TCKDxU', title: 'AI는 md 파일을 제일 잘 읽는다 — 보도자료 스킬 직접 만들기' },
      { ep: '35/44', id: 'wdp5oIfkKFM', title: '프롬프트 복붙 말고 LLM이 잘하는 것부터: 문서 정리·양식 변환·교차검증' },
      { ep: '32/44', id: 'sCiizEwcV6Q', title: 'AI 강사로 먹고사는 4가지 길, 크롬 F12로 웹페이지 통째로 가져오기' },
      { ep: '31/44', id: 'plEXbrqQl98', title: '현장의 진짜 문제를 AI 과제로 바꾸는 법 — 인터뷰부터 크롬 음성 전사까지' },
      { ep: '30/44', id: 'ALgUrZyxiDY', title: '같은 HTML 파일 하나로 엑셀도 PPT도 만든다, AI 교육이 진짜 가르칠 것' },
      { ep: '29/44', id: 'PLbtYAWs2MY', title: 'AI 강사는 크롬 탭 20개를 켠다 — 도구 조합과 8개 트랙 교육 구성' },
      { ep: '27/44', id: '34IGMorhUAU', title: '프롬프트는 끝났다? 컨텍스트에서 하네스까지 AI의 진짜 변화' },
      { ep: '26/44', id: 'Y4fBbUca0Bo', title: 'OpenAI에 있던 LLM을 내 컴퓨터로 끌어와 에이전트로 돌리는 법' },
      { ep: '25/44', id: 'eKtrDx8EXxg', title: '파인튜닝·RAG·컨텍스트 윈도우, 그리고 AI가 엑셀을 직접 만드는 원리' },
      { ep: '23/44', id: 'INyP0aHCebo', title: 'ShareX 캡처부터 파이썬으로 엑셀 분석 보고서 자동 생성까지' },
      { ep: '22/44', id: 'jKON6ZGWM0k', title: '엑셀·CSV 데이터, AI에게 세 줄만 보여주고 자동 분석하는 법' },
      { ep: '21/44', id: 'QrsVnH3Wm1Y', title: '주피터 노트북 실습, AI가 코드 쏟아낼 때 통제하는 프롬프트' },
      { ep: '20/44', id: 'E10CylaqVEU', title: '드래그 한 번으로 사이트 배포, 그런데 왜 내 입력은 나만 보일까' },
      { ep: '19/44', id: 'G7VymMM1Zjg', title: '코딩 IDE 설치와 API 키 보안: 브라우저에 키 넣으면 털리는 이유' },
      { ep: '18/44', id: '5LzedUYL5Ks', title: 'AI 특화 서비스와 코딩 에이전트, 강사라면 이렇게 프레임워크를 짜라' },
      { ep: '17/44', id: 'abuAxyNwYU0', title: '이미지 프롬프트를 객관식으로 만들고 사진만으로 위치까지 찾아내는 AI 실습' },
      { ep: '16/44', id: 'qzMAWSm6Cg4', title: 'ChatGPT 챗과 워크, 서브 에이전트로 문서 작성이 이렇게 달라진다' },
      { ep: '13/44', id: '4sXylHD83cI', title: '채팅으로 만든 스킬, 앱·웹·클로드에 어떻게 옮기나' },
      { ep: '09/44', id: 'pulk2W9I2c0', title: '누구나 AI 서비스를 만드는 시대, 왜 대부분 서랍 속에서 끝나는가' },
      { ep: '08/44', id: 'IgoWQ7eOvuM', title: '내가 만든 걸 왜 매번 드래그드랍? 버셀 배포를 AI에게 맡기는 법' },
      { ep: '06/44', id: 'IOQDTexRuX8', title: 'AI 기능 붙일 때 플랫폼에 돈 내지 마라, 내 API 키로 붙이는 법' },
      { ep: '05/44', id: 'RCiSZV2m1Tw', title: 'LLM이 코드를 짜서 스스로 실행한다 — 에이전트 반복과 MCP의 정체' },
      { ep: '03/44', id: 'Eh8fig2oX_g', title: '질문할 때마다 학습한다는 착각, LLM은 어떻게 답을 만드나' },
      { ep: '02/44', id: 'aaG4T25WDwI', title: '스킬 파일로 HWPX 표준서식 만들기, AI가 마크다운으로 답하는 이유' },
      { ep: '01/44', id: '3gbDtlQNZEM', title: '에이전트 없이 LLM만으로 서비스 만들기 — 시스템 프롬프트와 메타 프롬프트' },
    ],
  },
  {
    key: 'vibe',
    label: '바이브코딩',
    desc: '비전공자가 코드 없이 앱을 만들고 배포하기까지. 패러다임부터 로컬 AI, 노코드 풀스택, 배포 실습까지 이어집니다.',
    more: 'https://www.youtube.com/playlist?list=PLPtLQ-nU05fnBruiue2NJUIQzN91O8Y-h',
    videos: [
      { id: 'Vs9H3KMv1Ko', title: "이 영상 보기 전엔 '바이브 코딩' 한다는 말, 하지 마세요 — 비전공자가 진짜 앱을 배포하기까지" },
      { ep: 'M1', id: '-ftXAHbNCn8', title: '바이브 코딩 패러다임 — 개발자의 역할이 이렇게 바뀝니다' },
      { ep: 'M4', id: 'Ebwkht0ctBQ', title: "클라이언트 영속성 — 내 자료를 외부에 안 보내고 '브라우저에 저장'하기" },
      { ep: 'M6', id: 'DM0b_iT1Tug', title: 'Ollama로 로컬 AI 구동 — 인터넷 없는 폐쇄망에서도 쓰는 LLM' },
      { ep: 'M7~10', id: '6ROWgfhymPc', title: '클라우드 노코드 풀스택 — Lovable·Cursor·Windsurf·Antigravity 총정리' },
      { ep: 'M11', id: 'N2938j_8QwY', title: 'GitHub·Netlify·Vercel 배포 — 내가 만든 걸 전 세계가 보게 하기' },
      { id: 'BdwHLOrhrdc', title: '챗GPT·제미나이에게 말만 걸었더니 재고관리 앱이 뚝딱 — 바이브코딩 앱스스크립트' },
      { id: 'eaoTLZe0nkM', title: '바이브코딩, 난생처음 파이썬 — 초보자도 따라하는 업무자동화' },
      { id: '3_NzfgZbC9U', title: "코딩, 이제 배우지 마세요. '바이브'로 하세요 — 비전공자 엑셀·PPT 업무 자동화" },
      { id: 'clTItVDsr64', title: "데이터 분석팀 없어도 됩니다 — 혼자서 다 하는 'AI 바이브 코딩'의 시작" },
      { id: '8vCs3NYA6GI', title: "애플 사이트 '스크롤 효과', 코딩 없이 1분 만에 끝내기" },
      { id: 'dz3MUbnduR0', title: '7개 AI에 똑같이 시켰더니 결과가 완전히 달랐습니다 — 누가 코딩을 제일 잘할까' },
    ],
  },
  {
    key: 'popular',
    label: '인기 특강',
    desc: '조회수가 가장 많은 특강 모음. 엑셀·ChatGPT 실무부터 제미나이·GPT 최신 사용법, AI챔피언 명강의까지.',
    more: 'https://www.youtube.com/@workbyax/videos',
    videos: [
      { id: 'goP8AQIGltQ', title: '엑셀GPT, 엑셀이 AI를 만나면 벌어지는 놀라운 일', views: 146724 },
      { id: 'PhdqYl5T3p0', title: '구글 제미나이 & 노트북LM 실무 200% 완벽 활용 가이드 [생방특강]', views: 18896 },
      { id: 'LTpIxc_Y3nU', title: 'GPT-5.6 사용법 — Chat과 Work의 결정적 차이', views: 12065 },
      { id: 'JdwtRzZKlNg', title: '생성형 AI 실무 완벽 마스터 — AI 챔피언 그린 1일차 명강의', views: 11406 },
      { id: 'hP9cZbNa9vM', title: '엑셀과 ChatGPT가 만나면 벌어지는 놀라운 일들', views: 10277 },
      { id: 'NPV9H9MYs5Q', title: '함수 안 배워도 되는 엑셀 — 무조건 배워야 하는 파워쿼리 편집기', views: 8398 },
      { id: 'k5hOwNkBcWQ', title: '국가공인 AI 자격증 AICE Associate 완전 정복 (실시간 특강 요약)', views: 7152 },
      { id: 'aAVthV0DA2k', title: '엑셀로도 멋진 지도맵을 만들 수 있다', views: 6029 },
      { id: 'CRI9hG28moY', title: 'ChatGPT Classic·Work·Codex 사용법 — 1시간 완전정복 강의 공개', views: 2755 },
    ],
  },
]
