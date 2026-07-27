import { Link } from 'react-router-dom'
import { FaSmile, FaCalendarCheck, FaBookOpen, FaPhoneAlt, FaBrain, FaQuoteLeft, FaLock, FaUniversalAccess, FaStar, FaUserCheck } from 'react-icons/fa'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-slate-50 flex flex-col justify-between overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-blue-50/70 via-white to-slate-50">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] h-[550px] w-[550px] rounded-full bg-primary/10 blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-[5%] right-[-10%] h-[450px] w-[450px] rounded-full bg-secondary/10 blur-3xl animate-pulse-glow"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy Column */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-6">
              <span className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-sm border border-primary/10">
                <FaBrain className="animate-pulse text-sm" />
                <span>CONFIDENTIAL STUDENT WELLNESS PORTAL</span>
              </span>

              <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-custom leading-[1.15]">
                Your Mental Wellness Matters. <br />
                <span className="bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent">
                  MindConnect is Here.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                A safe, confidential space for university students to track daily mood patterns, access evidence-based guides, and schedule sessions with campus counselors.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-primary px-7 py-4 text-sm font-bold text-white shadow-xl shadow-primary/25 hover:bg-primary/95 hover:shadow-primary/35 hover:-translate-y-1 transition-all duration-300"
                >
                  Get Started (Sign Up)
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md px-7 py-4 text-sm font-bold text-slate-700 hover:bg-white hover:border-slate-300 hover:-translate-y-1 shadow-sm transition-all duration-300"
                >
                  Student Login
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex items-center justify-center lg:justify-start space-x-6 text-slate-500 text-xs font-medium">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Active Campus Portal</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <FaStar className="text-amber-400" />
                  <span className="font-bold text-slate-700">4.9/5</span>
                  <span>Student Rating</span>
                </div>
              </div>
            </div>

            {/* Right Visual Image & Floating Badges Column */}
            <div className="lg:col-span-6 relative flex justify-center">
              
              {/* Main Realistic Hero Image Box with Glass Border */}
              <div className="relative rounded-3xl p-3 bg-white/60 glass shadow-2xl max-w-md lg:max-w-none group">
                <img
                  src="/images/hero_students.jpg"
                  alt="University students collaborating cheerfully"
                  className="rounded-2xl object-cover w-full h-[380px] sm:h-[420px] shadow-md group-hover:scale-[1.01] transition-transform duration-500"
                />

                {/* Overlay gradient for depth */}
                <div className="absolute inset-3 rounded-2xl bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>

                {/* FLOATING BADGE 1 (Top Left) */}
                <div className="absolute -top-6 -left-4 sm:-left-6 glass p-3.5 rounded-2xl shadow-xl border border-white/80 flex items-center space-x-3 animate-float backdrop-blur-xl">
                  <div className="h-10 w-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl shadow-sm">
                    😀
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today's Check-In</div>
                    <div className="text-xs font-bold text-slate-800">Mood: Feeling Great!</div>
                  </div>
                </div>

                {/* FLOATING BADGE 2 (Top Right) */}
                <div className="absolute top-12 -right-4 sm:-right-6 glass p-3.5 rounded-2xl shadow-xl border border-white/80 flex items-center space-x-3 animate-float-reverse backdrop-blur-xl">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg shadow-sm">
                    <FaCalendarCheck />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary">Confidential Session</div>
                    <div className="text-xs font-bold text-slate-800">Dr. Jane • Wed 2 PM</div>
                  </div>
                </div>

                {/* FLOATING BADGE 3 (Bottom Left) */}
                <div className="absolute -bottom-6 -left-2 sm:-left-4 glass p-3.5 rounded-2xl shadow-xl border border-white/80 flex items-center space-x-3 animate-float backdrop-blur-xl">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg shadow-sm">
                    <FaLock />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                      <span>100% Encrypted</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <div className="text-[10px] text-slate-500">Device Local Cache</div>
                  </div>
                </div>

                {/* FLOATING BADGE 4 (Bottom Right) */}
                <div className="absolute bottom-8 -right-4 sm:-right-6 glass px-4 py-2.5 rounded-2xl shadow-xl border border-white/80 flex items-center space-x-2 animate-float-reverse backdrop-blur-xl">
                  <FaUserCheck className="text-secondary text-sm" />
                  <span className="text-xs font-bold text-slate-800">Free for Students</span>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-y border-slate-100 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-poppins text-3xl font-bold tracking-tight text-text-custom sm:text-4xl">
              Designed for Total Mental Support
            </h2>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              Engineered using Human-Computer Interaction (HCI) best practices for intuitive navigation and instant calm.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all duration-300 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <FaSmile className="text-xl" />
              </div>
              <h3 className="font-poppins font-bold text-text-custom text-base mb-2">Mood Logging</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Log how you feel daily using interactive emojis and notes. Track patterns with automated weekly charts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all duration-300 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <FaCalendarCheck className="text-xl" />
              </div>
              <h3 className="font-poppins font-bold text-text-custom text-base mb-2">Counseling Booking</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Choose a clinical counselor and reserve a confidential slot in three simple steps.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all duration-300 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-amber-500 mb-5 shadow-sm border border-yellow-100 group-hover:scale-110 transition-transform">
                <FaBookOpen className="text-xl" />
              </div>
              <h3 className="font-poppins font-bold text-text-custom text-base mb-2">Wellness Library</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Access guided meditation videos, study tips, and anxiety reduction handouts written by psychologists.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-red-100 bg-red-50/20 hover:bg-red-50/40 hover:shadow-xl transition-all duration-300 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-5 shadow-sm border border-red-200 animate-pulse group-hover:scale-110 transition-transform">
                <FaPhoneAlt className="text-xl" />
              </div>
              <h3 className="font-poppins font-bold text-red-600 text-base mb-2">Crisis Assistance</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                One-click access to campus security, emergency clinic coordinators, and 24/7 national helplines.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Realistic Student Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full border border-primary/10">Real Student Experiences</span>
            <h2 className="font-poppins text-3xl font-bold tracking-tight text-text-custom mt-3">
              Trusted by Students Across Campus
            </h2>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Here is how MindConnect helps university students balance mental health with academic demands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Student 1 */}
            <div className="p-8 rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between">
              <FaQuoteLeft className="text-slate-100 text-6xl absolute top-6 right-6 pointer-events-none" />
              <p className="text-slate-600 text-sm italic leading-relaxed relative z-10 mb-6">
                "Exam weeks used to trigger overwhelming panic. Logging my daily stress on the Mood Tracker helped me spot triggers early, and booking a confidential session with Dr. Jane was so effortless."
              </p>
              <div className="flex items-center space-x-4 border-t border-slate-100 pt-4">
                <img
                  src="/images/student_portrait_1.jpg"
                  alt="Student portrait"
                  className="h-12 w-12 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold text-text-custom">Sarah Jenkins</h4>
                  <p className="text-xs text-slate-500">Computer Science, Year 3</p>
                </div>
              </div>
            </div>

            {/* Student 2 */}
            <div className="p-8 rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between">
              <FaQuoteLeft className="text-slate-100 text-6xl absolute top-6 right-6 pointer-events-none" />
              <p className="text-slate-600 text-sm italic leading-relaxed relative z-10 mb-6">
                "The Wellness Library's guided box-breathing videos and study tips were a lifesaver during finals. The design is calm, responsive, and makes seeking help completely stress-free."
              </p>
              <div className="flex items-center space-x-4 border-t border-slate-100 pt-4">
                <img
                  src="/images/student_portrait_2.jpg"
                  alt="Student portrait"
                  className="h-12 w-12 rounded-full object-cover border-2 border-secondary/20 shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold text-text-custom">Marcus Vance</h4>
                  <p className="text-xs text-slate-500">Business Administration, Year 2</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900 text-slate-100 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-6">
          <h2 className="font-poppins text-3xl font-bold tracking-tight text-white">About the Initiative</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            MindConnect is a student wellness portal developed as part of the University Human-Computer Interaction (HCI) project. Our objective is to prove that calm visual aesthetics and low-friction navigation significantly increase student engagement with mental health support.
          </p>
          <div className="pt-6 flex justify-center gap-8 text-slate-400 text-xs">
            <div className="glass-dark p-4 rounded-2xl min-w-[120px]">
              <span className="block font-bold text-white text-2xl">100%</span>
              <span className="text-slate-400 text-[10px]">Confidential</span>
            </div>
            <div className="glass-dark p-4 rounded-2xl min-w-[120px]">
              <span className="block font-bold text-white text-2xl">&lt; 3 Clicks</span>
              <span className="text-slate-400 text-[10px]">Counselor Booking</span>
            </div>
            <div className="glass-dark p-4 rounded-2xl min-w-[120px]">
              <span className="block font-bold text-white text-2xl">24/7</span>
              <span className="text-slate-400 text-[10px]">Self-Help Library</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
