import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import {
  FaFilter,
  FaSearch,
  FaBookOpen
} from 'react-icons/fa'

import ResourceCard from '../components/ResourceCard'
import { auth } from '../firebase/config'

const resourceCategories = [
  'All',
  'Stress Management',
  'Anxiety',
  'Depression',
  'Meditation',
  'Study Tips'
]

const resources = [
  {
    id: 'box-breathing',
    title: '5-Minute Guided Box Breathing',
    category: 'Meditation',
    duration: '5 min watch',
    videoUrl:
      'https://www.youtube-nocookie.com/embed/tEmt1Znux58',
    description:
      'A visual guided breathing exercise using the box technique to help calm the nervous system and improve focus.',
    content:
      `Box breathing is a simple relaxation technique that can help clear your mind, relax your body, and improve concentration.

Instructions:

1. Sit comfortably with your feet flat on the floor.
2. Inhale slowly through your nose for 4 seconds.
3. Hold your breath gently for 4 seconds.
4. Exhale smoothly through your mouth for 4 seconds.
5. Wait for 4 seconds before inhaling again.
6. Repeat the cycle 4 to 5 times.`
  },
  {
    id: 'academic-anxiety',
    title: 'Managing Academic Anxiety',
    category: 'Anxiety',
    duration: '4 min read',
    description:
      'Learn grounding, reframing, and breathing techniques that may help reduce exam-related anxiety.',
    content:
      `Academic anxiety is common during tests, assignments, and examination periods.

1. Use the 5-4-3-2-1 grounding technique:

Name 5 things you can see, 4 things you can feel, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.

2. Practise cognitive reframing:

Replace catastrophic thoughts with more balanced statements. For example, instead of thinking that one poor result will ruin everything, remind yourself that one assessment is only part of your overall academic progress.

3. Use controlled breathing:

Take slow breaths and allow your exhale to last slightly longer than your inhale.`
  },
  {
    id: 'college-burnout',
    title: 'Beating College Burnout: Boundaries & Balance',
    category: 'Stress Management',
    duration: '6 min read',
    description:
      'Recognise burnout symptoms and establish healthier academic boundaries without abandoning your goals.',
    content:
      `Academic burnout may involve emotional exhaustion, reduced motivation, irritability, and difficulty completing ordinary tasks.

1. Define a stopping time:

Choose a reasonable time in the evening when academic work ends.

2. Use structured study intervals:

Work for 25 minutes, take a 5-minute break, and take a longer break after four sessions.

3. Practise active restoration:

Choose restorative activities such as walking, journaling, stretching, music, hobbies, or meaningful social interaction.`
  },
  {
    id: 'study-habits',
    title: 'Study Habits for High-Stress Weeks',
    category: 'Study Tips',
    duration: '5 min read',
    description:
      'Improve memory retention while reducing overload through active recall and spaced repetition.',
    content:
      `Studying more hours is not always the same as studying effectively.

1. Active recall:

Close your notes and try to explain or write down what you remember.

2. Spaced repetition:

Review material at increasing intervals instead of cramming everything in one session.

3. Teach to learn:

Explain the concept in simple language. Difficulty explaining an idea may reveal a gap in your understanding.`
  },
  {
    id: 'academic-depression',
    title: 'Recognising Academic Depression',
    category: 'Depression',
    duration: '7 min read',
    description:
      'Learn common warning signs of persistent low mood and understand when professional support may be helpful.',
    content:
      `Temporary sadness and stress can happen during university life. However, persistent symptoms may require professional attention.

Possible warning signs include:

- Loss of interest in activities you normally enjoy
- Persistent fatigue despite adequate rest
- Difficulty concentrating
- Withdrawal from friends, classes, or normal responsibilities
- Ongoing feelings of hopelessness

If these symptoms continue for more than two weeks or interfere with daily life, consider speaking with a qualified counsellor or healthcare professional.`
  },
  {
    id: 'sleep-meditation',
    title: 'Mindfulness Meditation for Sleep Rest',
    category: 'Meditation',
    duration: '8 min watch',
    videoUrl:
      'https://www.youtube-nocookie.com/embed/1VYzM70_580',
    description:
      'A calming progressive muscle relaxation exercise for bedtime tension and racing thoughts.',
    content:
      `Progressive muscle relaxation can help reduce physical tension before sleep.

Instructions:

1. Lie down comfortably and take three slow breaths.
2. Tense the muscles in your toes for 5 seconds.
3. Release them and notice the difference.
4. Repeat with your calves, thighs, stomach, hands, shoulders, neck, and face.
5. Keep your breathing slow and relaxed throughout the exercise.`
  }
]

export default function Resources() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (!currentUser) {
          setUser(null)
          setAuthLoading(false)
          navigate('/login', { replace: true })
          return
        }

        setUser(currentUser)
        setAuthLoading(false)
      }
    )

    return () => unsubscribe()
  }, [navigate])

  const filteredResources = useMemo(() => {
    const normalisedQuery = searchQuery
      .trim()
      .toLowerCase()

    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === 'All' ||
        resource.category === activeCategory

      const matchesSearch =
        !normalisedQuery ||
        resource.title
          .toLowerCase()
          .includes(normalisedQuery) ||
        resource.description
          .toLowerCase()
          .includes(normalisedQuery) ||
        resource.category
          .toLowerCase()
          .includes(normalisedQuery) ||
        resource.content
          .toLowerCase()
          .includes(normalisedQuery)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const clearFilters = () => {
    setActiveCategory('All')
    setSearchQuery('')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-mesh-light bg-dot-pattern flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 mx-auto rounded-full border-4 border-slate-200 border-t-primary animate-spin" />

          <p className="text-xs font-semibold text-slate-500">
            Loading resources...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-mesh-light bg-dot-pattern transition-all duration-300 page-transition-enter">
      {/* Header Panel */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <div>
          <h2 className="font-poppins text-lg font-bold text-text-custom">
            Wellness Resource Centre
          </h2>

          <p className="hidden sm:block text-[10px] text-slate-400">
            Self-help guides and wellness media
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-slate-500">
          <FaBookOpen className="text-secondary" />
          <span>{resources.length} resources available</span>
        </div>
      </header>

      <main className="px-6 py-6 max-w-7xl mx-auto space-y-6">
        {/* Introduction */}
        <div className="space-y-1">
          <h1 className="font-poppins text-2xl font-bold text-text-custom">
            Guides & Self-Help Media
          </h1>

          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Browse practical guides, breathing exercises,
            study support material, and wellness resources.
            Use the search field or topic filters to find
            relevant content.
          </p>
        </div>

        {/* Search and Filters */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-xl">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <FaSearch size={12} />
              </span>

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search guides, topics, or videos..."
                aria-label="Search wellness resources"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-xs text-text-custom outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            {(searchQuery || activeCategory !== 'All') && (
              <button
                type="button"
                onClick={clearFilters}
                className="self-start sm:self-auto rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 select-none scrollbar-none">
            <div className="flex items-center text-slate-400 text-xs font-bold mr-1.5 uppercase shrink-0">
              <FaFilter size={10} className="mr-1" />
              <span>Filters:</span>
            </div>

            {resourceCategories.map((category) => {
              const active = activeCategory === category

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  aria-pressed={active}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 shrink-0 ${
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100 hover:text-primary'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </section>

        {/* Result Summary */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Showing{' '}
            <span className="font-bold text-text-custom">
              {filteredResources.length}
            </span>{' '}
            {filteredResources.length === 1
              ? 'resource'
              : 'resources'}
          </p>

          {activeCategory !== 'All' && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
              {activeCategory}
            </span>
          )}
        </div>

        {/* Resource Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
            <FaSearch className="mx-auto mb-3 text-2xl text-slate-300" />

            <h3 className="font-poppins text-sm font-bold text-text-custom">
              No resources found
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Try a different search term or choose another
              topic category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/95 transition-all"
            >
              Show All Resources
            </button>
          </div>
        )}
      </main>
    </div>
  )
}