import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import BackgroundGrain from '../components/BackgroundGrain'

export default function NotFound() {
  const navigate = useNavigate()
  const [isWaking, setIsWaking] = useState(false)
  const [mascotAwake, setMascotAwake] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    document.title = '404 | Lost in the void'
    
    audioRef.current = new Audio('/sounds/wake.mp3')
    audioRef.current.volume = 0.4
  }, [])

  const handleWakeUp = () => {
    if (isWaking) return
    setIsWaking(true)

    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio blocked:', e))
    }

    setMascotAwake(true)

    setTimeout(() => {
      navigate('/')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden flex items-center justify-center px-4">
      <BackgroundGrain />
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center">
        
        <div className="mb-6 flex justify-center">
          <div className="relative w-fit">
            <img 
              src={mascotAwake ? '/mascot.svg' : '/mascot-sleeping.svg'} 
              alt="Mascot" 
              className={`w-28 h-28 md:w-32 md:h-32 transition-all duration-500 ${
                isWaking ? 'animate-bounce scale-110' : 'animate-pulse'
              }`}
            />
            {!mascotAwake && (
              <div className="absolute -top-5 -right-6 flex flex-col items-start select-none">
                <span className="text-ink-soft text-lg font-bold leading-none animate-float">Z</span>
                <span className="text-ink-soft text-sm font-bold leading-none animate-float-delayed pl-2">z</span>
                <span className="text-ink-soft text-xs font-bold leading-none animate-float-slow pl-4">z</span>
              </div>
            )}
          </div>
        </div>

        <h1 className="text-7xl md:text-9xl font-bold text-ink tracking-tighter mb-2 opacity-10 select-none">
          404
        </h1>
        
        <div className="relative inline-block bg-yellow-200 text-black p-5 rounded-sm shadow-xl rotate-2 mb-8 max-w-sm mx-auto">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-black/5 backdrop-blur-sm rounded-full" />
          <p className="text-sm font-medium leading-relaxed">
            <strong className="block text-base mb-1">Note to self:</strong>
            This page doesn't exist. I probably deleted it, or you typed the URL wrong. The mascot is sleeping on the job again. Click the button to wake it up and go home.
          </p>
          <div className="text-[0.6rem] text-black/40 text-right mt-2">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleWakeUp}
            disabled={isWaking}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              isWaking 
                ? 'bg-green-500 text-white cursor-wait' 
                : 'bg-ink text-bg hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isWaking ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Waking up...
              </>
            ) : (
              'Wake Mascot & Go Home'
            )}
          </button>
        </div>

        <p className="text-[0.65rem] text-ink-soft/50 mt-8 uppercase tracking-widest">
          Error code: 404_NOT_FOUND
        </p>
      </div>
    </div>
  )
}