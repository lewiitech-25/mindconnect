import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPhoneAlt, FaExclamationTriangle, FaHospital, FaShieldAlt, FaComments, FaRegBell } from 'react-icons/fa'

export default function Emergency() {
  const [user, setUser] = useState(null)
  const [triggeredAction, setTriggeredAction] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('studentUser')
    if (!storedUser) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(storedUser))
  }, [navigate])

  const handleMockCall = (label, number) => {
    setTriggeredAction(`Calling ${label} (${number}) in demo mode... Call successfully simulated.`)
    setTimeout(() => setTriggeredAction(''), 5000)
  }

  const contacts = [
    {
      title: 'National Crisis Line',
      number: '988',
      desc: 'Free, confidential 24/7 suicide and mental health crisis assistance.',
      icon: FaExclamationTriangle,
      colorClass: 'border-red-200 bg-red-50 text-red-700',
      btnColor: 'bg-red-600 hover:bg-red-700 shadow-red-500/10'
    },
    {
      title: 'Campus Police & Security',
      number: '(555) 019-9999',
      desc: 'Immediate dispatch for campus incidents, medical concerns, or security escort.',
      icon: FaShieldAlt,
      colorClass: 'border-slate-200 bg-slate-50 text-slate-700',
      btnColor: 'bg-slate-800 hover:bg-slate-900 shadow-slate-500/10'
    },
    {
      title: 'University Clinic Coordinator',
      number: '(555) 019-2834',
      desc: 'Urgent medical bookings, counselor scheduling, and nurse assistance.',
      icon: FaHospital,
      colorClass: 'border-blue-200 bg-blue-50 text-blue-700',
      btnColor: 'bg-primary hover:bg-primary/95 shadow-primary/10'
    },
    {
      title: 'Student Peer Support Network',
      number: '(555) 019-3810',
      desc: 'Talk with trained student advisors for stress relief, study pressure, or general support.',
      icon: FaComments,
      colorClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      btnColor: 'bg-secondary hover:bg-secondary/90 shadow-secondary/10'
    }
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-mesh-light bg-dot-pattern pl-0 md:pl-64 transition-all duration-300 page-transition-enter">
      {/* Header Panel */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <h2 className="font-poppins text-lg font-bold text-red-600 flex items-center space-x-1.5">
          <FaExclamationTriangle className="animate-pulse" />
          <span>Emergency Assistance</span>
        </h2>
      </header>

      {/* Main Workspace */}
      <main className="p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Urgent header warning */}
        <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white shadow-lg shadow-red-500/25">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 text-xl border border-white/20">
              <FaExclamationTriangle className="animate-bounce" />
            </div>
            <div className="space-y-1.5">
              <h1 className="font-poppins text-lg font-bold tracking-tight">Are you experiencing a severe crisis?</h1>
              <p className="text-xs text-red-100 leading-relaxed max-w-2xl">
                If you are in immediate physical danger, are planning to hurt yourself or others, or need urgent medical attention, please do not wait. Call <strong>911</strong> or visit the nearest emergency clinic right away.
              </p>
            </div>
          </div>
        </div>

        {triggeredAction && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700 text-center animate-pulse">
            {triggeredAction}
          </div>
        )}

        {/* Contact list grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {contacts.map((contact, index) => {
            const Icon = contact.icon
            return (
              <div
                key={index}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all duration-300 ${contact.colorClass}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="text-lg shrink-0" />
                    <h3 className="font-poppins font-bold text-sm tracking-wide">{contact.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">{contact.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
                  <span className="font-mono font-bold text-xs">{contact.number}</span>
                  <button
                    onClick={() => handleMockCall(contact.title, contact.number)}
                    className={`inline-flex items-center justify-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${contact.btnColor}`}
                  >
                    <FaPhoneAlt size={10} />
                    <span>Call Now</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* What to do guide */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-poppins font-bold text-sm text-text-custom border-b border-slate-50 pb-3 flex items-center space-x-2">
            <FaRegBell className="text-primary text-base" />
            <span>Recommended Crisis Steps</span>
          </h3>

          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <div className="flex items-start space-x-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">1</span>
              <p>
                <strong>Breathe & Slow Down:</strong> Take three deep breaths, releasing air slowly to down-regulate your flight-or-fight response.
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">2</span>
              <p>
                <strong>Contact Support:</strong> Dial the National Crisis Line (988) or text HOME to 741741 to chat with a certified crisis advisor immediately.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">3</span>
              <p>
                <strong>Tell Someone:</strong> Reach out to campus clinic coordinators or dial campus security if you are on university grounds so a duty officer can assist you.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
