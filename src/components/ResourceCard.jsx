import { useState } from 'react'
import { FaBookOpen, FaVideo, FaPlay, FaPause, FaTimes, FaExternalLinkAlt } from 'react-icons/fa'

export default function ResourceCard({ resource }) {
  const { title, category, description, duration, videoUrl, content } = resource
  const [isPlaying, setIsPlaying] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Stress Management': return 'bg-yellow-50 text-yellow-700 border-yellow-100'
      case 'Anxiety': return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'Depression': return 'bg-indigo-50 text-indigo-700 border-indigo-100'
      case 'Meditation': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'Study Tips': return 'bg-purple-50 text-purple-700 border-purple-100'
      default: return 'bg-slate-50 text-slate-700 border-slate-100'
    }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Visual Header / Mock Video Thumb */}
      <div className="relative h-44 bg-slate-900 flex items-center justify-center overflow-hidden">
        {videoUrl && isPlaying ? (
          <div className="absolute inset-0 w-full h-full bg-black flex flex-col items-center justify-center text-white p-4 text-center">
            {/* Real embedded YouTube video with nocookie or a beautiful custom video element */}
            <iframe
              className="w-full h-full"
              src={`${videoUrl}?autoplay=1&mute=1`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-2 right-2 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-full p-1.5 transition-colors"
              aria-label="Stop Video"
            >
              <FaTimes size={10} />
            </button>
          </div>
        ) : (
          <>
            {/* Visual gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-800 opacity-95"></div>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Category badge */}
            <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-lg border text-xs font-semibold select-none ${getCategoryColor(category)}`}>
              {category}
            </span>

            {/* Icon / Action Indicator */}
            {videoUrl ? (
              <button
                onClick={() => setIsPlaying(true)}
                className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-105 transition-all duration-300"
                aria-label="Play video resource"
              >
                <FaPlay className="text-xl ml-1 text-accent animate-pulse" />
              </button>
            ) : (
              <FaBookOpen className="text-slate-500 text-4xl relative z-10" />
            )}

            {/* Bottom time banner */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-slate-300 font-medium">
              {duration || '5 min read'}
            </div>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-poppins font-bold text-text-custom line-clamp-2 text-base leading-tight mb-2">
            {title}
          </h4>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
          {videoUrl && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-primary transition-colors"
            >
              <FaVideo size={12} className="shrink-0" />
              <span>{isPlaying ? 'Close Player' : 'Watch Video'}</span>
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center space-x-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors ml-auto"
          >
            <span>Read Article</span>
            <FaExternalLinkAlt size={10} className="shrink-0" />
          </button>
        </div>
      </div>

      {/* Modal View Article */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-slate-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-semibold ${getCategoryColor(category)}`}>
                  {category}
                </span>
                <h3 className="font-poppins text-lg font-bold text-text-custom mt-2 leading-snug">{title}</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                aria-label="Close details"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto pr-2 text-sm text-slate-600 leading-relaxed space-y-4 flex-1">
              <p className="font-semibold text-slate-800 leading-normal">{description}</p>
              {content ? (
                content.split('\n\n').map((para, i) => <p key={i}>{para}</p>)
              ) : (
                <p>
                  No extended article contents available. Please refer to external university wellness publications or speak to our clinical counseling team for detailed instructions on this topic.
                </p>
              )}
            </div>

            {/* Close footer */}
            <div className="border-t border-slate-100 pt-4 mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
