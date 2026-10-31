// 핵심 전문가 5인 — 출처: 어사이드 전달 「전문가 5인 이력서 최종본」(2026-10-25), docs/experts/*.md
// 공개용: 휴대폰 번호는 넣지 않는다.

export interface Expert {
  slug: string
  name: string
  en: string
  role: string
  word: string
  heightCm: number
  line: string
  thesis: string
  fields: string[]
  stats: { n: string; label: string }[]
  career: string[]
  public: string[]
  books: string[]
  email: string
  links?: { label: string; href: string }[]
}

export const experts: Expert[] = [
  {
    slug: 'shin-sungjin',
    name: '신성진',
    en: 'SHIN SUNG JIN',
    role: '대표이사 · AI·AX 전략 / 경영기획',
    word: 'AX',
    heightCm: 174,
    line: '공공·기업의 AX를 설계하고, 직접 만들어 보인다',
    thesis: '기업 경영·재무·마케팅 실무와 공공 데이터기반행정, 생성형 AI 교육·컨설팅을 연결한다. 비개발자용 업무도구와 교육 플랫폼을 직접 설계·배포한다.',
    fields: ['생성형 AI · AX', '바이브코딩 · 자동화', '데이터분석', '경영 · 기획'],
    stats: [
      { n: '137+', label: '출강 기관' },
      { n: '63', label: '2025년 과정' },
      { n: '5권', label: '저서·공저' },
    ],
    career: [
      '㈜한국데이터사이언티스트협회 대표이사 (2023~)',
      '행정안전부·NIA AI데이터분석 전문인재 양성과정 주임교수 (2023~2026)',
      '국민권익위원회 인공지능·데이터심의위원회 위원 (2026~2028)',
      '과학기술정보통신부 데이터 활용 활성화 자문위원 · 행정안전부 공공데이터 전문위원',
      '前 유한건강생활 경영지원실장 CFO · 명지대 겸임교수',
    ],
    public: ['행정안전부', '식품의약품안전처', '인사혁신처', '과학기술정보통신부', 'NIA', '삼성전자 인재개발원', 'SK텔레콤', 'LG에너지솔루션', 'KCC', 'KAIST'],
    books: ['『AI, 지금부터 따라잡으면 됩니다』', '『매일 하던 일을 AI에게 맡겼습니다』', '『2026 이패스 AICE Associate』(공저)'],
    email: 'sjshin@cdsa.kr',
    links: [{ label: '유튜브 Work by AX', href: 'https://www.youtube.com/@workbyax' }],
  },
  {
    slug: 'hyun-jungkyun',
    name: '현중균',
    en: 'JUNGKYUN HYUN',
    role: '이사 · 디브릿지 대표',
    word: 'DATA',
    heightCm: 184,
    line: '데이터 시각화에서 AI 서비스 구현까지',
    thesis: '데이터 시각화부터 AI 서비스 구현까지, 현업의 문제를 교육 과정으로 설계한다.',
    fields: ['생성형 AI 활용', '데이터 분석 · 시각화', '바이브코딩 · AI Agent', 'Power BI'],
    stats: [
      { n: '2023~', label: 'AI챔피언 과정 교수' },
      { n: '3곳', label: '대학 겸임교수' },
      { n: 'Ph.D.', label: '의료AI 박사과정 수료' },
    ],
    career: [
      '디브릿지 대표 / 한국데이터사이언티스트협회 이사',
      '행정안전부·NIA AI챔피언 그린·블루·블랙 과정 교수 (2023~)',
      '명지대 융합ICT학부 · 연성대 겸임교수',
      '前 ㈜슈파스 이사·미래사업총괄',
      '가톨릭대 의료인공지능대학원 박사과정 수료 · AI 빅데이터 MBA',
    ],
    public: ['행정안전부·NIA', '기후에너지환경부', '인사혁신처', '국가데이터처', '서울시 인재개발원', '한화첨단소재', 'BC카드', 'LS미래원', '마이크로소프트'],
    books: [],
    email: 'jkhyun@cdsa.kr',
  },
  {
    slug: 'lee-jungkyun',
    name: '이중균',
    en: 'JOONG KYOON LEE',
    role: '파트너이사 · 데이터·AX·CRM',
    word: 'CRM',
    heightCm: 172,
    line: '데이터 조직 운영 경험을 공공 AX로',
    thesis: '데이터 조직 운영 경험을 공공 AX 실행과 연결한다. 도입에서 내재화까지.',
    fields: ['공공 AX · 데이터 기반 행정', 'AI 리더십', 'CRM · 추천 시스템', '바이브코딩 · 노코드 분석'],
    stats: [
      { n: '15년', label: 'hy 데이터센터장' },
      { n: '2권', label: '저서' },
      { n: 'CRM', label: 'LG텔레콤 기획·운영팀장' },
    ],
    career: [
      '한국데이터사이언티스트협회 파트너이사',
      '데이터기반 지능행정 역량강화 컨설팅 사업 컨설턴트 (2024~)',
      '경상북도 의성군 정책자문위원 · 한국식품안전관리인증원 자문위원',
      '前 hy(한국야쿠르트) 데이터센터 센터장·인재개발원장',
      '前 LG텔레콤 CRM 기획·운영팀장 · 연세대 IT경영전략 석사',
    ],
    public: ['행정안전부', '한국사회보장정보원', '경상남도청', '방위사업청', '산림청', '서울경찰청', '식품의약품안전처', '질병관리청', 'CJ AI Wave'],
    books: ['『AI 노예인가, AI 군주인가』', '『AI 시대, 인간이 닳는다』'],
    email: 'jklee@cdsa.kr',
    links: [{ label: 'joongkyoonlee.org', href: 'https://joongkyoonlee.org' }],
  },
  {
    slug: 'kim-taeyou',
    name: '김태유',
    en: 'TAE YOU KIM',
    role: 'AI 전문교수 · AX 리드 컨설턴트',
    word: 'AGENT',
    heightCm: 174,
    line: '연구의 엄밀함을 에이전트 설계로',
    thesis: '연구의 엄밀함과 현장의 실행을 AI 에이전트 설계로 잇는다.',
    fields: ['AI 에이전트 · MCP', '데이터 엔지니어링', '바이브코딩', 'AI Design Thinking'],
    stats: [
      { n: '3편', label: 'AI·핀테크 논문' },
      { n: 'KPMG', label: 'Canada · US 컨설팅' },
      { n: '3단계', label: 'AI챔피언 그린·블루·블랙' },
    ],
    career: [
      '한국데이터사이언티스트협회 AI 전문교수 · AX 리드 컨설턴트',
      '글로벌 컨설팅펌 AI 팀 리드(Director)',
      '前 KPMG Canada(Toronto) · KPMG US(New York)',
      'Swiss School of Management 대학원 박사과정 겸임교수',
      '공학 박사 · Business School Lausanne MBA · DBA 연구',
    ],
    public: ['행정안전부', '국가공무원인재개발원', '기후에너지환경부', '해양수산부', '보건복지인재원', 'KISA', '삼성전자', '포스코이앤씨', '한화첨단소재'],
    books: ['『보안걱정없이 LLM과 AI를 사용할 수 있는 가장 쉬운 방법』(공저)'],
    email: 'tykim@cdsa.kr',
  },
  {
    slug: 'kim-yongjae',
    name: '김용재',
    en: 'YONG JAE KIM',
    role: '컨설턴트 · 데이터 분석 교육',
    word: 'AICE',
    heightCm: 185,
    line: '분석 도구에서 AI 업무 적용까지',
    thesis: '분석 도구를 가르치는 데서 AI를 업무에 적용하는 단계까지.',
    fields: ['데이터 분석 · R · Python', '머신러닝 · 시계열', 'LLM · RAG · AI Agent', 'AICE 자격'],
    stats: [
      { n: '3권', label: 'AICE 수험서' },
      { n: 'AICE', label: '국가공인 전문강사' },
      { n: '행안부', label: '데이터분석 과정 교수' },
    ],
    career: [
      '한국데이터사이언티스트협회 컨설턴트 · 이패스코리아 AICE 강사',
      '국가공인 AICE 자격증 전문강사',
      '前 CJ올리브네트웍스·한국경제 DT 과정 주임교수',
      '前 서일대 AI 겸임교수 · 이글루코퍼레이션 AI연구원',
      '국민대 BIT대학원 석사 · 비즈니스IT 박사과정',
    ],
    public: ['행정안전부', '국가인재개발원', '식품의약품안전처', '병무청', '서울경찰청', '한국서부발전', 'KCC', '올리브영', '한솔그룹'],
    books: ['『2026 이패스 AICE BASIC』', '『2026 이패스 AICE Associate』(공저)', '『AICE Associate 실전모의고사 10』(공저)'],
    email: 'yjkim@cdsa.kr',
  },
]
