import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import {
  FaUserShield,
  FaUsers,
  FaUserMd,
  FaExclamationTriangle,
  FaChartLine,
  FaPlus,
  FaTimes,
  FaBuilding,
  FaShieldAlt,
  FaCheckCircle
} from 'react-icons/fa'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [counselors, setCounselors] = useState([
    { id: 1, name: 'Dr. Jane Smith', specialty: 'Clinical Psychologist', activeSlots: 14, capacity: 20 },
    { id: 2, name: 'Dr. John Doe', specialty: 'Stress & Burnout Advisor', activeSlots: 18, capacity: 20 },
    { id: 3, name: 'Dr. Karen Vance', specialty: 'Academic Adjustment', activeSlots: 10, capacity: 15 }
  ])

  const [addCounselorModal, setAddCounselorModal] = useState(false)
  const [newCounselorName, setNewCounselorName] = useState('')
  const [newCounselorSpecialty, setNewCounselorSpecialty] = useState('')
  const [newCounselorEmail, setNewCounselorEmail] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('studentUser')
    if (!storedUser) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(storedUser)
    if (parsed.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    setUser(parsed)
  }, [navigate])

  const handleAddCounselor = (e) => {
    e.preventDefault()
    if (!newCounselorName || !newCounselorSpecialty) return

    const newObj = {
      id: Date.now(),
      name: newCounselorName,
      specialty: newCounselorSpecialty,
      activeSlots: 0,
      capacity: 15
    }

    setCounselors([...counselors, newObj])
    setNewCounselorName('')
    setNewCounselorSpecialty('')
    setNewCounselorEmail('')
    setAddCounselorModal(false)
  }

  const departmentChartData = {
    labels: ['Comp Sci', 'Engineering', 'Business', 'Medicine', 'Law', 'Arts'],
    datasets: [
      {
        label: 'Average Stress Index (%)',
        data: [72, 68, 55, 84, 76, 48],
        backgroundColor: [
          'rgba(37, 99, 235, 0.85)',
          'rgba(5, 150, 105, 0.85)',
          'rgba(234, 179, 8, 0.85)',
          'rgba(225, 29, 72, 0.85)',
          'rgba(147, 51, 234, 0.85)',
          'rgba(2, 132, 199, 0.85)'
        ],
        borderRadius: 8
      }
    ]
  }

  const bookingVolumeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Counseling Reservations',
        data: [65, 89, 142, 195, 240, 110, 128],
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.12)',
        borderWidth: 3,
        tension: 0.35,
        fill: true
      }
    ]
  }

  const crisisLogs = [
    { id: 'LOG-948', studentId: 'ST-94821', type: '988 National Crisis Hotline Trigger', timestamp: '2026-07-27 14:22', status: 'Dispatched & Resolved' },
    { id: 'LOG-942', studentId: 'ST-39102', type: 'Campus Security Medical Escort', timestamp: '2026-07-26 19:05', status: 'Attended by Nurse' },
    { id: 'LOG-910', studentId: 'ST-10928', type: 'High Stress Alert Flag', timestamp: '2026-07-24 11:30', status: 'Counselor Reassigned' }
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-mesh-light bg-dot-pattern pl-0 md:pl-64 transition-all duration-300 page-transition-enter text-slate-900">
      
      {/* Header */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg border border-purple-200">
            <FaUserShield />
          </div>
          <div>
            <h2 className="font-poppins text-sm font-extrabold text-slate-900 leading-tight">{user.name}</h2>
            <p className="text-[11px] font-bold text-slate-600">Director of Student Wellness & HCI Analytics</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
          <FaCheckCircle className="text-emerald-600" />
          <span>System Healthy</span>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Dark Banner with High-Contrast White Text */}
        <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl space-y-2 border border-slate-800">
          <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">Campus Oversight & HCI Research</span>
          <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold">University Wellness Administration</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            Monitor campus stress metrics, manage clinical counselor capacities, review emergency crisis dispatch logs, and inspect student engagement analytics.
          </p>
        </div>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Total Registered Students</span>
              <FaUsers className="text-primary text-base" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">1,482</div>
            <span className="text-[11px] font-bold text-emerald-700">↑ +12% this semester</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Active Consultations</span>
              <FaUserMd className="text-secondary text-base" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">128</div>
            <span className="text-[11px] font-bold text-slate-600">Across 3 faculty advisors</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Campus Wellness Index</span>
              <FaChartLine className="text-purple-600 text-base" />
            </div>
            <div className="text-3xl font-extrabold text-purple-700">78%</div>
            <span className="text-[11px] font-bold text-emerald-700">Stable psychological balance</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-red-200 shadow-md space-y-1">
            <div className="flex items-center justify-between text-red-600">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">Crisis Dispatches</span>
              <FaExclamationTriangle className="animate-pulse text-base" />
            </div>
            <div className="text-3xl font-extrabold text-red-600">3</div>
            <span className="text-[11px] font-bold text-slate-600">All handled & stabilized</span>
          </div>
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Department Stress Breakdown */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-poppins font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <FaBuilding className="text-primary" />
                <span>Stress Breakdown by Academic Department</span>
              </h3>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">HCI RESEARCH</span>
            </div>
            <div className="h-64 relative">
              <Bar data={departmentChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Chart 2: Monthly Booking Trend */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-poppins font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <FaChartLine className="text-secondary" />
                <span>Monthly Counseling Booking Volume</span>
              </h3>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">2026 TREND</span>
            </div>
            <div className="h-64 relative">
              <Line data={bookingVolumeData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

        </div>

        {/* Counselor Roster Management */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-poppins font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <FaUserMd className="text-primary" />
              <span>Campus Counselor Roster & Workload</span>
            </h3>
            <button
              onClick={() => setAddCounselorModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/95 transition-all"
            >
              <FaPlus size={10} />
              <span>Add Counselor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {counselors.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                    <FaUserMd />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{c.name}</h4>
                    <p className="text-xs font-semibold text-slate-600">{c.specialty}</p>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span>Workload Capacity</span>
                    <span>{c.activeSlots} / {c.capacity} slots</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(c.activeSlots / c.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crisis Dispatch & Safety Logs */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
          <h3 className="font-poppins font-extrabold text-sm text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <FaShieldAlt className="text-red-600" />
            <span>Emergency Dispatch & Crisis Logs</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 text-[11px] font-extrabold text-slate-700 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Incident / Trigger</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {crisisLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{log.id}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{log.studentId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.type}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{log.timestamp}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        <FaCheckCircle className="text-emerald-600" />
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Modal: Add Counselor */}
      {addCounselorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-poppins font-extrabold text-slate-900 text-sm">Add New Clinical Counselor</h3>
              <button onClick={() => setAddCounselorModal(false)} className="text-slate-400 hover:text-slate-600">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddCounselor} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-700">Counselor Name</label>
                <input
                  type="text"
                  value={newCounselorName}
                  onChange={(e) => setNewCounselorName(e.target.value)}
                  placeholder="e.g. Dr. Emily Watson"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-700">Specialty Path</label>
                <input
                  type="text"
                  value={newCounselorSpecialty}
                  onChange={(e) => setNewCounselorSpecialty(e.target.value)}
                  placeholder="e.g. Cognitive Behavioral Therapy"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={newCounselorEmail}
                  onChange={(e) => setNewCounselorEmail(e.target.value)}
                  placeholder="counselor@university.edu"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddCounselorModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/95 shadow-sm"
                >
                  Save Counselor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
