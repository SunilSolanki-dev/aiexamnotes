import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import logo from "../assets/logo.png"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { serverUrl } from '../app';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
function Navbar() {

    const { userData } = useSelector(state => state.user);
    const credits = userData.credits;
    const [showCredit, setShowCredit] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            const response = await axios.post(serverUrl + "/api/auth/logout", {}, { withCredentials: true });
            if (response) {
                dispatch(setUserData(null))
                navigate("/auth")
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.7 }}
            className='relative z-20 mx-3 sm:mx-6 mt-3 sm:mt-6 rounded-2xl bg-gradient-to-br from-black/90 via-black/80 to-black/90  backdrop-blur-2xl border border-white/10 shadow-[0_22px_55px_rgba(0,0,0,0.75)] flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4'>

            <div className='flex items-center gap-3'>
                <img src={logo} alt="logo" className='w-9 h-9' />
                <span className='text-lg hidden md:block font-semibold text-white'>
                    ExamNotes <span className='text-gray-400'>AI</span>
                </span>
            </div>
            <div className='flex item-center gap-3 sm:gap-6 relative'>
                <div className='relative'>

                    <motion.div
                        onClick={() => { setShowCredit(!showCredit), setShowProfile(false) }}
                        whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }} className='flex items-center gap-1 px-2 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm shadow-md cursor-pointer' >
                        <span className='text-xl'>💎</span>
                        <span>{credits}</span>
                        <motion.span
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.97 }}
                            className='ml-2 h-5 w-5 flex item-center justify-center rounded-full bg-white text-black text-xs font-blod'
                        >
                            ➕

                        </motion.span>
                    </motion.div>

                    <AnimatePresence>
                        {showCredit &&

                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 10, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className='fixed inset-x-4 top-20 sm:absolute sm:inset-x-auto sm:top-auto sm:right-2 sm:mt-4 w-auto sm:w-64 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-4 text-white '>
                                <h4 className='font-semibold mb-2'>Buy Credits</h4>
                                <p className='text-sm text-gray-300 mb-4'>Use credits to genrate AI notes,diagrams & PDFs</p>
                                <button onClick={() => {setShowCredit(false),navigate('/pricing')}} className='w-full py-2 rounded-lg bg-gradient-to-br from-white to-gray-200 text-black font-semiblod  hover:opacity-90 cursor-pointer'>Buy more Credits</button>


                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
                <div className='relative'>
                    <motion.div
                        onClick={() => { setShowProfile(!showProfile); setShowCredit(false) }}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.97 }}
                        className='flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm shadow-md cursor-pointer' >
                        <span className='text-lg'>{userData.name.slice(0, 1).toUpperCase()}</span>

                    </motion.div>

                    <AnimatePresence>
                        {showProfile &&

                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 10, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className='absolute right-0 mt-4 w-52 max-w-[calc(100vw-2rem)] rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-4 text-white '>

                                <MenuItem text="History" onClick={() => {setShowProfile(false);navigate("/history")}} />
                                <div className='h-px bg-white/10 mx-3' />
                                <MenuItem text="Sign out" red onClick={handleSignOut} />

                            </motion.div>
                        }
                    </AnimatePresence>

                </div>
            </div>

        </motion.div>
    )
}


function MenuItem({ onClick, text, red }) {
    return (
        <div onClick={onClick} className={`w-full text-left px-5 py-3 text-sm transition-colors rounded-lg cursor-pointer ${red ? "text-red-400 hover:bg-red-500/10" : "text-grey-200 hover:bg-white/10"}`}>
            {text}
        </div>
    )
}

export default Navbar