import { site } from '../data/content'
import { useInquiry } from './InquiryModal'

export default function Footer() {
  const { openInquiry } = useInquiry()
  return (
    <footer className="py-14 border-t border-ink-700/15">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="font-serif text-2xl text-ink-900">CDSA</div>
            <p className="mt-2 text-sm text-ink-500">{site.name}</p>
            <p className="mt-1 text-sm text-ink-500">{site.address}</p>
            <p className="mt-1 text-sm text-ink-500">{site.email}</p>
          </div>
          <div className="flex gap-8 text-sm">
            <button onClick={openInquiry} className="text-ink-700 hover:text-clay-700">
              교육 문의
            </button>
            <a href={site.builderUrl} target="_blank" rel="noopener noreferrer" className="text-ink-700 hover:text-clay-700">
              커리큘럼 빌더
            </a>
            <a href={site.marketUrl} target="_blank" rel="noopener noreferrer" className="text-ink-700 hover:text-clay-700">
              바이브마켓
            </a>
            <a href={site.youtubeChannel} target="_blank" rel="noopener noreferrer" className="text-ink-700 hover:text-clay-700">
              YouTube
            </a>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-ink-700/10 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-500">
          <span>© 2026 한국데이터사이언티스트협회. All rights reserved.</span>
          <span className="font-mono">Built with 바이브 코딩.</span>
        </div>
      </div>
    </footer>
  )
}
