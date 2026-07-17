import React from 'react'

const PRIORITY_LEVELS = ["⭐", "⭐⭐", "⭐⭐⭐"]

function SideBar({ result }) {
  if (!result) {
    return null;
  }

  const subTopics = result.subTopics || {};
  const hasSubTopics = PRIORITY_LEVELS.some((level) => subTopics[level]?.length > 0);
  const hasQuestions = result.questions?.short?.length > 0 || result.questions?.long?.length > 0;

  return (
    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6'>
      <div className='flex items-center gap-2'>
        <span className='text-xl'>📌</span>
        <h3 className='text-lg font-semibold text-indigo-600'>Quick Exam View</h3>
      </div>

      {hasSubTopics && (
        <section className='space-y-4'>
          <p className='text-sm font-semibold text-gray-700 mb-3'>
            🌟 Sub Topics (Priority Wise)
          </p>

          {PRIORITY_LEVELS.map((level) => (
            subTopics[level]?.length > 0 && (
              <div key={level} className='border border-gray-100 rounded-xl p-3 space-y-2'>
                <p className='text-xs font-semibold text-amber-500'>{level} Priority</p>
                <ul className='list-disc list-inside text-sm text-gray-700 space-y-1'>
                  {subTopics[level].map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </section>
      )}

      {result.importance && (
        <section className='bg-amber-50 border border-amber-100 rounded-xl p-4'>
          <p className='text-sm font-semibold text-gray-700 mb-1'>🔥 Exam Importance</p>
          <p className='text-lg'>{result.importance}</p>
        </section>
      )}

      {hasQuestions && (
        <section className='space-y-3'>
          <p className='text-sm font-semibold text-gray-700'>❓ Important Questions</p>

          {result.questions.short?.length > 0 && (
            <div className='bg-indigo-50 border border-indigo-100 rounded-xl p-3'>
              <p className='text-xs font-semibold text-gray-500 mb-1'>Short Questions</p>
              <ul className='list-disc list-inside text-sm text-gray-700 space-y-1'>
                {result.questions.short.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}

          {result.questions.long?.length > 0 && (
            <div className='bg-purple-50 border border-purple-100 rounded-xl p-3'>
              <p className='text-xs font-semibold text-gray-500 mb-1'>Long Questions</p>
              <ul className='list-disc list-inside text-sm text-gray-700 space-y-1'>
                {result.questions.long.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default SideBar
