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

  const [activeTab, setActiveTab] = useState('Overview')
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

  // Department Stress Breakdown Chart
  const departmentChartData = {
    labels: ['Comp Sci', 'Engineering', 'Business', 'Medicine', 'Law', 'Arts'],
    datasets: [
      {
        label: 'Average Stress Index (%)',
        data: [72, 68, 55, 84, 76, 48],
        backgroundColor: [
          'rgba(59, 130, 246, 0.75)',
          'rgba(16, 185, 129, 0.75)',
          'rgba(250, 204, 21, 0.75)',
          'rgba(239, 68, 68, 0.75)',
          'rgba(168, 85, 247, 0.75)',
          'rgba(14, 165, 233, 0.75)'
        ],
        borderRadius: 8
      }
    ]
  }

  // Monthly Booking Volume Chart
  const bookingVolumeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Counseling Reservations',
        data: [65, 89, 142, 195, 240, 110, 128],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
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
    <div className="min-h-screen bg-slate-50 pl-0 md:pl-64 transition-all duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <FaUserShield />
          </div>
          <div>
            <h2 className="font-poppins text-sm font-bold text-text-custom leading-tight">{user.name}</h2>
            <p className="text-[10px] text-slate-500">Director of Student Wellness & HCI Analytics</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
          <FaCheckCircle />
          <span>System Healthy</span>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 p-6 text-white shadow-md space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Campus Oversight & HCI Research</span>
          <h1 className="font-poppins text-2xl font-bold">University Wellness Administration</h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Monitor campus stress metrics, manage clinical counselor capacities, review emergency crisis dispatch logs, and inspect student engagement analytics.
          </p>
        </div>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">Total Registered Students</span>
              <FaUsers className="text-primary" />
            </div>
            <div className="text-3xl font-extrabold text-text-custom">1,482</div>
            <span className="text-[10px] font-semibold text-emerald-600">↑ +12% this semester</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">Active Consultations</span>
              <FaUserMd className="text-secondary" />
            </div>
            <div className="text-3xl font-extrabold text-secondary">128</div>
            <span className="text-[10px] font-semibold text-slate-500">Across 3 faculty advisors</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">Campus Wellness Index</span>
              <FaChartLine className="text-purple-600" />
            </div>
            <div className="text-3xl font-extrabold text-purple-600">78%</div>
            <span className="text-[10px] font-semibold text-emerald-600">Stable psychological balance</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-red-100 bg-red-50/10 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-red-500">
              <span className="text-[10px] font-bold uppercase">Crisis Dispatches</span>
              <FaExclamationTriangle className="animate-pulse" />
            </div>
            <div className="text-3xl font-extrabold text-red-600">3</div>
            <span className="text-[10px] font-semibold text-slate-500">All handled & stabilized</span>
          </div>
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Department Stress Breakdown */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2">
                <FaBuilding className="text-primary" />
                <span>Stress Breakdown by Academic Department</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">HCI Research</span>
            </div>
            <div className="h-64 relative">
              <Bar data={departmentChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Chart 2: Monthly Booking Trend */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2">
                <FaChartLine className="text-secondary" />
                <span>Monthly Counseling Booking Volume</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">2026 Trend</span>
            </div>
            <div className="h-64 relative">
              <Line data={bookingVolumeData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

        </div>

        {/* Counselor Roster Management */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2">
              <FaUserMd className="text-primary" />
              <span>Campus Counselor Roster & Workload</span>
            </h3>
            <button
              onClick={() => setAddCounselorModal(true)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/95 transition-all"
            >
              <FaPlus size={10} />
              <span>Add Counselor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {counselors.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <FaUserMd />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-text-custom">{c.name}</h4>
                    <p className="text-[10px] text-slate-500">{c.specialty}</p>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1 pt-1 border-t border-slate-100">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                    <span>Workload Capacity</span>
                    <span>{c.activeSlots} / {c.capacity} slots</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
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
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2 border-b border-slate-100 pb-3">
            <FaShieldAlt className="text-red-500" />
            <span>Emergency Dispatch & Crisis Logs</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Log ID</th>
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Incident / Trigger</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {crisisLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-text-custom">{log.id}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{log.studentId}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{log.type}</td>
                    <td className="py-3 px-3 text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                        <FaCheckCircle />
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
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-poppins font-bold text-text-custom text-sm">Add New Clinical Counselor</h3>
              <button onClick={() => setAddCounselorModal(false)} className="text-slate-400 hover:text-slate-600">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddCounselor} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Counselor Name</label>
                <input
                  type="text"
                  value={newCounselorName}
                  onChange={(e) => setNewCounselorName(e.target.value)}
                  placeholder="e.g. Dr. Emily Watson"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-text-custom outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Specialty Path</label>
                <input
                  type="text"
                  value={newCounselorSpecialty}
                  onChange={(e) => setNewCounselorSpecialty(e.target.value)}
                  placeholder="e.g. Cognitive Behavioral Therapy"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-text-custom outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Email Address</label>
                <input
                  type="email"
                  value={newCounselorEmail}
                  onChange={(e) => setNewCounselorEmail(e.target.value)}
                  placeholder="counselor@university.edu"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-text-custom outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddCounselorModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
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
