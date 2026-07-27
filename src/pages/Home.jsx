import { Link } from 'react-router-dom'
import { FaSmile, FaCalendarCheck, FaBookOpen, FaPhoneAlt, FaBrain, FaQuoteLeft, FaLock, FaStar, FaUserCheck, FaHeartbeat } from 'react-icons/fa'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-mesh-light bg-dot-pattern flex flex-col justify-between overflow-x-hidden page-transition-enter text-slate-900">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        
        {/* Ambient Light Orbs */}
        <div className="absolute top-[-5%] left-[-5%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-blue-400/25 via-sky-300/20 to-primary/15 blur-3xl animate-orb-1 pointer-events-none"></div>
        <div className="absolute bottom-[0%] right-[-5%] h-[550px] w-[550px] rounded-full bg-gradient-to-br from-emerald-400/25 via-teal-300/20 to-secondary/15 blur-3xl animate-orb-2 pointer-events-none"></div>
        <div className="absolute top-[40%] left-[35%] h-[350px] w-[350px] rounded-full bg-purple-400/15 blur-3xl animate-pulse-glow pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-6">
              <span className="inline-flex items-center space-x-2 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold text-primary shadow-sm border border-primary/20">
                <FaHeartbeat className="animate-pulse text-sm text-secondary" />
                <span>CONFIDENTIAL STUDENT WELLNESS PORTAL</span>
              </span>

              <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]">
                Your Mental Wellness Matters. <br />
                <span className="bg-gradient-to-r from-blue-600 via-primary to-emerald-600 bg-clip-text text-transparent">
                  MindConnect is Here.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                A safe, confidential space for university students to track daily mood patterns, access evidence-based guides, and schedule sessions with campus counselors.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-blue-700 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
                >
                  Get Started (Sign Up)
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white border border-slate-200 px-8 py-4 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:-translate-y-1 shadow-md transition-all duration-300"
                >
                  Student Login
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex items-center justify-center lg:justify-start space-x-6 text-slate-700 text-xs font-semibold">
                <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-full border border-slate-200 shadow-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="font-bold text-slate-900">Active Campus Portal</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white px-3.5 py-2 rounded-full border border-slate-200 shadow-xs">
                  <FaStar className="text-amber-500" />
                  <span className="font-extrabold text-slate-900">4.9/5</span>
                  <span className="text-slate-600">Student Rating</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-6 relative flex justify-center">
              
              <div className="relative rounded-3xl p-3 bg-white/80 border border-slate-200 shadow-2xl max-w-md lg:max-w-none group">
                <img
                  src="/images/hero_students.jpg"
                  alt="University students collaborating cheerfully"
                  className="rounded-2xl object-cover w-full h-[380px] sm:h-[430px] shadow-md group-hover:scale-[1.01] transition-transform duration-500"
                />

                <div className="absolute inset-3 rounded-2xl bg-gradient-to-t from-slate-900/35 via-transparent to-transparent pointer-events-none"></div>

                {/* FLOATING BADGE 1 */}
                <div className="absolute -top-6 -left-4 sm:-left-6 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 flex items-center space-x-3 animate-float">
                  <div className="h-10 w-10 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center text-2xl shadow-sm">
                    😀
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Today's Check-In</div>
                    <div className="text-xs font-extrabold text-slate-900">Mood: Feeling Great!</div>
                  </div>
                </div>

                {/* FLOATING BADGE 2 */}
                <div className="absolute top-12 -right-4 sm:-right-6 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 flex items-center space-x-3 animate-float-reverse">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center text-lg shadow-sm">
                    <FaCalendarCheck />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-primary">Confidential Session</div>
                    <div className="text-xs font-extrabold text-slate-900">Dr. Jane • Wed 2 PM</div>
                  </div>
                </div>

                {/* FLOATING BADGE 3 */}
                <div className="absolute -bottom-6 -left-2 sm:-left-4 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 flex items-center space-x-3 animate-float">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-sm">
                    <FaLock />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 flex items-center space-x-1">
                      <span>100% Encrypted</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold">Device Local Cache</div>
                  </div>
                </div>

                {/* FLOATING BADGE 4 */}
                <div className="absolute bottom-8 -right-4 sm:-right-6 bg-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center space-x-2 animate-float-reverse">
                  <FaUserCheck className="text-secondary text-base" />
                  <span className="text-xs font-extrabold text-slate-900">Free for Students</span>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Features Grid - HIGH CONTRAST SECTION */}
      <section id="features" className="py-20 relative bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest bg-cyan-950/80 px-4 py-1.5 rounded-full border border-cyan-800/80">
              Core Capabilities
            </span>
            <h2 className="font-poppins text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Designed for Total Mental Support
            </h2>
            <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-2xl mx-auto">
              Engineered using Human-Computer Interaction (HCI) best practices for intuitive navigation, high contrast readability, and instant calm.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="p-7 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-xl group hover:border-primary transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <FaSmile className="text-2xl" />
              </div>
              <h3 className="font-poppins font-extrabold text-white text-lg mb-2">Mood Logging</h3>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                Log how you feel daily using interactive emojis and notes. Track patterns with automated weekly charts.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-xl group hover:border-emerald-500 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <FaCalendarCheck className="text-2xl" />
              </div>
              <h3 className="font-poppins font-extrabold text-white text-lg mb-2">Counseling Booking</h3>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                Choose a clinical counselor and reserve a confidential slot in three simple steps.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-xl group hover:border-amber-400 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <FaBookOpen className="text-2xl" />
              </div>
              <h3 className="font-poppins font-extrabold text-white text-lg mb-2">Wellness Library</h3>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                Access guided meditation videos, study tips, and anxiety reduction handouts written by psychologists.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-red-950/40 border border-red-800/80 shadow-xl group hover:border-red-500 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 mb-5 shadow-sm border border-red-500/30 animate-pulse group-hover:scale-110 transition-transform">
                <FaPhoneAlt className="text-2xl" />
              </div>
              <h3 className="font-poppins font-extrabold text-red-400 text-lg mb-2">Crisis Assistance</h3>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                One-click access to campus security, emergency clinic coordinators, and 24/7 national helplines.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Realistic Student Testimonials - HIGH CONTRAST LIGHT SECTION */}
      <section id="testimonials" className="py-20 relative bg-slate-100/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-primary uppercase tracking-widest bg-blue-100 border border-blue-200 px-4 py-1.5 rounded-full shadow-2xs">
              Real Student Experiences
            </span>
            <h2 className="font-poppins text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Trusted by Students Across Campus
            </h2>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed max-w-xl mx-auto">
              Here is how MindConnect helps university students balance mental health with academic demands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Student 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl relative flex flex-col justify-between hover:border-primary/50 transition-all">
              <FaQuoteLeft className="text-slate-300 text-6xl absolute top-6 right-6 pointer-events-none" />
              <p className="text-slate-800 text-sm font-medium italic leading-relaxed relative z-10 mb-6">
                "Exam weeks used to trigger overwhelming panic. Logging my daily stress on the Mood Tracker helped me spot triggers early, and booking a confidential session with Dr. Jane was so effortless."
              </p>
              <div className="flex items-center space-x-4 border-t border-slate-100 pt-4">
                <img
                  src="/images/student_portrait_1.jpg"
                  alt="Student portrait"
                  className="h-12 w-12 rounded-full object-cover border-2 border-primary shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Sarah Jenkins</h4>
                  <p className="text-xs font-bold text-slate-600">Computer Science, Year 3</p>
                </div>
              </div>
            </div>

            {/* Student 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl relative flex flex-col justify-between hover:border-secondary/50 transition-all">
              <FaQuoteLeft className="text-slate-300 text-6xl absolute top-6 right-6 pointer-events-none" />
              <p className="text-slate-800 text-sm font-medium italic leading-relaxed relative z-10 mb-6">
                "The Wellness Library's guided box-breathing videos and study tips were a lifesaver during finals. The design is calm, responsive, and makes seeking help completely stress-free."
              </p>
              <div className="flex items-center space-x-4 border-t border-slate-100 pt-4">
                <img
                  src="/images/student_portrait_2.jpg"
                  alt="Student portrait"
                  className="h-12 w-12 rounded-full object-cover border-2 border-secondary shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Marcus Vance</h4>
                  <p className="text-xs font-bold text-slate-600">Business Administration, Year 2</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-950 text-slate-100 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-6">
          <h2 className="font-poppins text-3xl font-extrabold tracking-tight text-white">About the Initiative</h2>
          <p className="text-slate-300 text-sm font-medium leading-relaxed">
            MindConnect is a student wellness portal developed as part of the University Human-Computer Interaction (HCI) project. Our objective is to prove that calm visual aesthetics and low-friction navigation significantly increase student engagement with mental health support.
          </p>
          <div className="pt-6 flex justify-center gap-8 text-slate-300 text-xs font-bold">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl min-w-[130px] shadow-md">
              <span className="block font-extrabold text-white text-3xl">100%</span>
              <span className="text-slate-400 text-[11px] uppercase tracking-wider">Confidential</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl min-w-[130px] shadow-md">
              <span className="block font-extrabold text-white text-3xl">&lt; 3 Clicks</span>
              <span className="text-slate-400 text-[11px] uppercase tracking-wider">Booking</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl min-w-[130px] shadow-md">
              <span className="block font-extrabold text-white text-3xl">24/7</span>
              <span className="text-slate-400 text-[11px] uppercase tracking-wider">Self-Help</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
