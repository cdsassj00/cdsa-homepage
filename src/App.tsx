import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Mission from './sections/Mission'
import Alleyway from './sections/Alleyway'
import CurriculumMatrix from './sections/CurriculumMatrix'
import Showcase from './sections/Showcase'
import Videos from './sections/Videos'
import Tutors from './sections/Tutors'
import Institutions from './sections/Institutions'
import CTA from './sections/CTA'
import Footer from './sections/Footer'
import FloatingInsights from './sections/FloatingInsights'
import FloatingSites from './sections/FloatingSites'
import FloatingChat from './sections/FloatingChat'
import ExecutiveLoungeStrip from './sections/FloatingLounge'

function SectionDots() {
  return <div className="section-dots"><span /></div>
}

function App() {
  return (
    <div className="min-h-screen">
      <ExecutiveLoungeStrip />
      <Nav />
      <Hero />
      <SectionDots />
      <Mission />
      <SectionDots />
      <Alleyway />
      <SectionDots />
      <CurriculumMatrix />
      <SectionDots />
      <Showcase />
      <SectionDots />
      <Videos />
      <SectionDots />
      <Tutors />
      <Institutions />
      <CTA />
      <Footer />
      <FloatingInsights />
      <FloatingSites />
      <FloatingChat />
    </div>
  )
}

export default App
