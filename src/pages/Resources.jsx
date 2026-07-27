import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBookOpen, FaSearch, FaFilter } from 'react-icons/fa'
import ResourceCard from '../components/ResourceCard'

const resourceCategories = ['All', 'Stress Management', 'Anxiety', 'Depression', 'Meditation', 'Study Tips']

const mockResourcesList = [
  {
    title: '5-Minute Guided Box Breathing',
    category: 'Meditation',
    duration: '5 min watch',
    videoUrl: 'https://www.youtube-nocookie.com/embed/tEmt1Znux58', // Box breathing guided video
    description: 'A visual guided breathing exercise using the box technique (inhale 4s, hold 4s, exhale 4s, hold 4s) to reset your nervous system instantly.',
    content: 'Box breathing is a simple yet powerful relaxation technique that can help clear your mind, relax your body, and improve focus. It is widely used by high-stress professionals, athletes, and students alike.\n\nInstructions:\n1. Sit comfortably with your feet flat on the floor.\n2. Inhale slowly through your nose for a count of 4 seconds.\n3. Gently hold your breath for a count of 4 seconds.\n4. Exhale smoothly through your mouth for a count of 4 seconds.\n5. Wait at the bottom of the breath for a count of 4 seconds.\n6. Repeat this cycle 4 to 5 times until you feel a wave of physical calmness.'
  },
  {
    title: 'Managing Academic Anxiety',
    category: 'Anxiety',
    duration: '4 min read',
    description: 'Overcome exam dread and panic. Learn clinical grounding techniques to quiet racing thoughts and regain academic focus.',
    content: 'Academic anxiety is extremely common, especially during midterms and finals. However, when test anxiety blocks your recall, it becomes counterproductive. Here is how to handle it using Cognitive Behavioral Therapy (CBT) exercises.\n\n1. Use the 5-4-3-2-1 Grounding Technique:\nWhen you feel panic rising, name: 5 things you can see, 4 things you can physically feel, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This pulls your mind out of catastrophic future loops and grounds you in the immediate room.\n\n2. Cognitive Reframing:\nInstead of telling yourself "If I fail this exam, my life is ruined," write down a more balanced thought: "This is a single exam that counts for a percentage of my grade. I have prepared to the best of my ability, and there are recovery options if I fall short."\n\n3. Strategic Breathing:\nTake deep diaphragmatic breaths where your exhale is longer than your inhale. This triggers the vagus nerve and shuts down the flight-or-fight response.'
  },
  {
    title: 'Beating College Burnout: Boundaries & Balance',
    category: 'Stress Management',
    duration: '6 min read',
    description: 'Understand the symptoms of physical and cognitive exhaustion. Set healthy academic boundaries without compromising your goals.',
    content: 'Academic burnout is more than just feeling tired; it is a state of chronic stress that leads to emotional exhaustion, cynicism, and a lack of efficacy. Preventing it requires deliberate scheduling modifications.\n\n1. Define Hard Stop Times:\nEstablish a time in the evening (e.g. 8:00 PM) after which all academic tasks cease. Use this time for active rest, hobbies, or social activities. Your brain requires rest to integrate learning.\n\n2. The Pomodoro System:\nDo not study for hours uninterrupted. Work in 25-minute sprints followed by a 5-minute break. After four rounds, take a longer 30-minute break. This prevents mental saturation.\n\n3. Active Restoration:\nWatching social media is passive rest, which often leaves you feeling more depleted. Active restoration includes walks, journaling, hot baths, or listening to music.'
  },
  {
    title: 'Study Habits for High-Stress Weeks',
    category: 'Study Tips',
    duration: '5 min read',
    description: 'Maximize memory retention while minimizing mental overload. Explore active recall and spaced repetition principles.',
    content: 'Studying harder is not always the answer; studying smarter reduces preparation time and anxiety. Cognitive science shows that active recall and spaced repetition are the most efficient study methods.\n\n1. Active Recall:\nInstead of passively highlighting or re-reading textbooks, close the book and write down everything you remember, or answer practice questions. Forcing the brain to retrieve information strengthens neural pathways.\n\n2. Spaced Repetition:\nReview materials at increasing intervals (e.g. 1 day, 3 days, 1 week, 2 weeks) rather than cramming the night before. Cramming loads short-term memory, which quickly decays under exam stress.\n\n3. Teach to Learn (Feynman Technique):\nTry explaining the concept in simple terms to a mock student. If you struggle to explain it simply, you have identified a gap in your understanding.'
  },
  {
    title: 'Recognizing Academic Depression',
    category: 'Depression',
    duration: '7 min read',
    description: 'Learn the difference between temporary sadness and clinical fatigue. Spot warning signs in yourself and classmates, and find support.',
    content: 'College life is transitional and can trigger periods of low mood. It is crucial, however, to identify when low mood shifts into depressive fatigue that requires clinical intervention.\n\nKey Symptoms:\n- Anhedonia: A total loss of interest in activities you normally enjoy.\n- Chronic Lethargy: Feeling physically heavy and fatigued despite getting sleep.\n- Cognitive Fog: Difficulty focusing on simple lecture points or completing basic chores.\n- Isolation: Avoiding friends and class, choosing to stay in bed for extended periods.\n\nIf you or a friend have experienced these symptoms for more than two consecutive weeks, we highly encourage booking a confidential consultation with our campus counseling center.'
  },
  {
    title: 'Mindfulness Meditation for Sleep Rest',
    category: 'Meditation',
    duration: '8 min watch',
    videoUrl: 'https://www.youtube-nocookie.com/embed/1VYzM70_580', // Guided sleep meditation video
    description: 'A calming audio guide for progressive muscle relaxation to combat bedtime racing thoughts and insomnia.',
    content: 'Sleep is the foundation of cognitive functioning and emotional regulation. This Progressive Muscle Relaxation (PMR) guide helps release physical tension so you can fall asleep quickly.\n\nInstructions:\n1. Lie flat in bed, close your eyes, and take three deep breaths.\n2. Focus on your toes. Tense the muscles in your toes tightly for 5 seconds, then release completely. Notice the sensation of relaxation.\n3. Move up to your calves. Tense them for 5 seconds, then release.\n4. Repeat this tensing and releasing pattern for your thighs, glutes, stomach, hands, shoulders, neck, and face.\n5. By the time you reach your face, your body will be physically relaxed, encouraging your mind to drift into sleep.'
  }
]

export default function Resources() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredResources, setFilteredResources] = useState(mockResourcesList)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('studentUser')
    if (!storedUser) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(storedUser))
  }, [navigate])

  useEffect(() => {
    let result = mockResourcesList

    // Filter by tab
    if (activeTab !== 'All') {
      result = result.filter((r) => r.category === activeTab)
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      )
    }

    setFilteredResources(result)
  }, [activeTab, searchQuery])

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 pl-0 md:pl-64 transition-all duration-300">
      {/* Header Panel */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <h2 className="font-poppins text-lg font-bold text-text-custom">Wellness Resource Center</h2>
      </header>

      {/* Main Workspace */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Intro */}
        <div className="space-y-1">
          <h1 className="font-poppins text-2xl font-bold text-text-custom">Guides & Self-Help Media</h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Browse our library of clinician-reviewed guides, breathing exercises, and cognitive reframing handouts. Use tabs to filter by topic.
          </p>
        </div>

        {/* Search and Tabs Panel */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-4">
          
          {/* Search bar */}
          <div className="relative max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <FaSearch size={12} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, topics, or videos..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-xs text-text-custom outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 select-none scrollbar-none">
            <div className="flex items-center text-slate-400 text-xs font-bold mr-1.5 uppercase shrink-0">
              <FaFilter size={10} className="mr-1" />
              <span>Filters:</span>
            </div>
            {resourceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 shrink-0 ${
                  activeTab === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {filteredResources.map((res, index) => (
              <ResourceCard key={index} resource={res} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-200/80 rounded-2xl text-slate-400 text-xs">
            No guides match your search criteria. Try a different topic tab or check your spelling.
          </div>
        )}

      </main>
    </div>
  )
}
