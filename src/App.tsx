import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Mission from './sections/Mission'
import Alleyway from './sections/Alleyway'
import Tracks from './sections/Tracks'
import CurriculumSheet from './sections/CurriculumSheet'
import Showcase from './sections/Showcase'
import Videos from './sections/Videos'
import Tutors from './sections/Tutors'
import Institutions from './sections/Institutions'
import CTA from './sections/CTA'
import Footer from './sections/Footer'
import FloatingInsights from './sections/FloatingInsights'

function SectionDots() {
  return <div className="section-dots"><span /></div>
}

function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <SectionDots />
      <Mission />
      <SectionDots />
      <Alleyway />
      <SectionDots />
      <Tracks />
      <CurriculumSheet />
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
    </div>
  )
}

export default App
