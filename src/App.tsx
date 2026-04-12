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

function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Mission />
      <Alleyway />
      <Tracks />
      <CurriculumSheet />
      <Showcase />
      <Videos />
      <Tutors />
      <Institutions />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
