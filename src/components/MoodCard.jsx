import { FaTrashAlt } from "react-icons/fa";

const moodEmojis = {
  Happy: "😀",
  Good: "🙂",
  Okay: "😐",
  Stressed: "😟",
  Sad: "😢",
};

export default function MoodCard({
  id,
  mood,
  note,
  date,
  onDelete,
}) {
  const formattedDate = date
    ? new Date(date).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Unknown date";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          <div className="text-4xl">
            {moodEmojis[mood] || "🙂"}
          </div>

          <div>

            <h3 className="font-semibold text-text-custom">
              {mood}
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              {formattedDate}
            </p>

          </div>

        </div>

        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
          title="Delete entry"
        >
          <FaTrashAlt size={15} />
        </button>

      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">

        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
          {note || "No journal entry."}
        </p>

      </div>

    </div>
  );
}