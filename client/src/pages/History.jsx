import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { GiHamburgerMenu } from 'react-icons/gi'
import { getAllNotes, getSingleNote } from '../services/api'
import FinalResult from '../components/FinalResult'

function History() {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const credits = userData?.credits;

  const [notes, setNotes] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loadingNote, setLoadingNote] = useState(false);
  const [noteError, setNoteError] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await getAllNotes();
        setNotes(Array.isArray(res.notes) ? res.notes : []);
      } catch (error) {
        console.log('error', error);
        setListError("Failed to load your notes");
      } finally {
        setLoadingList(false);
      }
    };
    fetchNotes();
  }, []);

  const openNote = async (noteId) => {
    setSelectedId(noteId);
    setSelectedNote(null);
    setNoteError("");
    setLoadingNote(true);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    try {
      const res = await getSingleNote(noteId);
      setSelectedNote(res.note);
    } catch (error) {
      console.log('error', error);
      setNoteError("Failed to load this note");
    } finally {
      setLoadingNote(false);
    }
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200 px-4 sm:px-6 py-8'>
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 px-4 sm:px-8 py-6
        shadow-[0_20px_45px_rgba(0,0,0,0.6)] items-start flex md:items-center justify-between gap-4 flex-col md:flex-row'
      >
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className='lg:hidden cursor-pointer h-9 w-9 flex items-center justify-center rounded-full bg-white/10 border border-white/10 text-white'
          >
            <GiHamburgerMenu />
          </button>
          <div onClick={() => navigate("/")} className='cursor-pointer'>
            <h1 className='text-2xl font-bold bg-linear-to-r from-white via-gray-300 to-white bg-clip-text text-transparent'>ExamNotes AI</h1>
            <p className='text-sm text-gray-300 mt-1'>AI-powered exam-oriented notes & revision</p>
          </div>
        </div>
        <div className='flex items-center gap-4 flex-wrap'>
          <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm'>
            <span className='text-xl'>💎</span>
            <span>{credits}</span>
          </div>
          <button
            onClick={() => navigate("/notes")}
            className='px-4 py-3 rounded-full text-sm font-medium bg-white/10 border border-white/10 text-white hover:bg-white/20 transition flex items-center gap-2 cursor-pointer'
          >
            📝 New Notes
          </button>
        </div>
      </motion.header>

      <div className='mt-8 flex gap-6 relative'>
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              key='overlay'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className='fixed inset-0 z-30 bg-black/50 lg:hidden'
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              key='sidebar'
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className='fixed inset-y-0 left-0 z-40 w-[85vw] max-w-xs overflow-y-auto rounded-r-2xl
              bg-black/90 backdrop-blur-xl border-r border-white/10 p-4 shadow-[0_20px_45px_rgba(0,0,0,0.6)]
              lg:static lg:z-auto lg:w-auto lg:max-w-none lg:shrink-0 lg:basis-1/4 lg:rounded-2xl lg:border'
            >
              <h2 className='text-lg font-semibold text-white mb-4'>Your Notes</h2>

              {loadingList && <p className='text-sm text-gray-400'>Loading notes...</p>}
              {!loadingList && listError && <p className='text-sm text-red-400'>{listError}</p>}
              {!loadingList && !listError && notes.length === 0 && (
                <p className='text-sm text-gray-400'>No notes created yet</p>
              )}

              <ul className='space-y-3'>
                {notes.map((note) => (
                  <li
                    key={note._id}
                    onClick={() => openNote(note._id)}
                    className={`cursor-pointer rounded-xl p-3 border transition ${selectedId === note._id
                      ? "bg-white/15 border-white/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                  >
                    <p className='text-sm font-semibold text-white truncate'>{note.topic}</p>

                    <div className='flex flex-wrap gap-2 mt-2 text-xs'>
                      {note.classLevel && (
                        <span className='px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300'>
                          {note.classLevel}
                        </span>
                      )}
                      {note.examType && (
                        <span className='px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300'>
                          {note.examType}
                        </span>
                      )}
                    </div>

                    <div className='flex gap-3 mt-2 text-xs text-gray-300'>
                      {note.revisionMode && <span>⚡ Revision</span>}
                      {note.includeDiagram && <span>📈 Diagram</span>}
                      {note.includeChart && <span>📊 Chart</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='flex-1 min-w-0 rounded-2xl bg-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] p-4 sm:p-6'>
          {!selectedId && !loadingNote && (
            <div className='h-64 rounded-2xl flex flex-col items-center justify-center bg-white/60 border border-dashed border-gray-300 text-gray-500'>
              <span className='text-4xl mb-3'>📋</span>
              <p>Select a note from the list to view details</p>
            </div>
          )}

          {loadingNote && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className='text-center text-black font-medium py-16'
            >
              Loading note...
            </motion.div>
          )}

          {!loadingNote && noteError && (
            <div className='text-center text-red-600 font-medium py-16'>{noteError}</div>
          )}

          {!loadingNote && !noteError && selectedNote && (
            <FinalResult result={selectedNote.content} />
          )}
        </div>
      </div>
    </div>
  )
}

export default History
