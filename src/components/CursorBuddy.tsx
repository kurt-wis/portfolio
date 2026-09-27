import { useEffect, useRef, useState } from 'react'
import { 
  collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, limit, Timestamp 
} from 'firebase/firestore'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase'

const PHRASES = [
  'npm install hire-me',
  'git commit -m "hire Kurt"',
  'currently learning tRPC',
  'go check my projects',
  'press cmd k to explore',
  'console.log("hire me")',
  'sudo hire kurt',
  'i like clean code',
  'shipping > perfect',
  'coffee.exe is running',
  'reading docs rn',
  'unit tests are friends',
  'brb debugging',
  'kurt writes good code',
  'click me for fun',
]

const GREETING = 'oh you are back'
const COOLDOWN_MS = 60000
const COOLDOWN_STORAGE_KEY = 'lastPostAt'

const THANK_YOU_PHRASES = [
  'thanks for the note!',
  'noted! appreciate it',
  'thanks! that made my day',
  'got it, thank you!',
  'signed and sealed, thanks!',
  'thanks for stopping by!',
]

const COOLDOWN_PHRASES = [
  'slow down! wait {s}s',
  'calm down, {s}s left',
  'patience! {s}s more',
  'one at a time, {s}s',
  'not so fast! {s}s',
  'easy there, {s}s left',
]

interface Note {
  id: string;
  text: string;
  color: string;
  timestamp: Timestamp | null;
}

const getInitialCooldown = () => {
  if (typeof window === 'undefined') return 0;
  const lastPost = localStorage.getItem(COOLDOWN_STORAGE_KEY);
  if (!lastPost) return 0;
  const elapsed = Date.now() - parseInt(lastPost, 10);
  return Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));
}

export default function CursorBuddy() {
  const [phrase, setPhrase] = useState('')
  const [showBubble, setShowBubble] = useState(false)
  const [isSleeping, setIsSleeping] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const lastMove = useRef<number>(Date.now())
  const wasSleeping = useRef(false)
  const sleepAudioRef = useRef<HTMLAudioElement | null>(null)
  const manualPhraseRef = useRef(false)

  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [isWallOpen, setIsWallOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingNotes, setIsLoadingNotes] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(getInitialCooldown)

  const playSound = (soundName: string) => {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  const startSleepSound = () => {
    if (sleepAudioRef.current) return;
    const audio = new Audio('/sounds/sleep.mp3');
    audio.volume = 0.3;
    audio.loop = true;
    audio.play().catch(() => {});
    sleepAudioRef.current = audio;
  }

  const stopSleepSound = () => {
    if (sleepAudioRef.current) {
      sleepAudioRef.current.pause();
      sleepAudioRef.current.currentTime = 0;
      sleepAudioRef.current = null;
    }
  }

  const pickPhrase = () => PHRASES[Math.floor(Math.random() * PHRASES.length)]

  const sayPhrase = (message: string, duration = 3200) => {
    manualPhraseRef.current = true
    setPhrase(message)
    setShowBubble(true)
    window.setTimeout(() => {
      setShowBubble(false)
      manualPhraseRef.current = false
    }, duration)
  }

  useEffect(() => {
    if (isSleeping || isWallOpen || isPromptOpen) {
      setShowBubble(false)
      return
    }
    let timeout: number
    const loop = () => {
      const delay = 4000 + Math.random() * 3500
      timeout = window.setTimeout(() => {
        if (!manualPhraseRef.current) {
          setPhrase(pickPhrase())
          setShowBubble(true)
          window.setTimeout(() => setShowBubble(false), 3200)
        }
        loop()
      }, delay)
    }
    loop()
    return () => clearTimeout(timeout)
  }, [isSleeping, isWallOpen, isPromptOpen])

  useEffect(() => {
    const onMove = () => {
      lastMove.current = Date.now()
      if (wasSleeping.current) {
        wasSleeping.current = false
        setIsSleeping(false)
        stopSleepSound()
        playSound('wake')
        sayPhrase(GREETING, 2600)
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('keydown', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onMove)
      window.removeEventListener('keydown', onMove)
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (wasSleeping.current) return
      if (Date.now() - lastMove.current >= 15000) {
        startSleepSound()
        setIsSleeping(true)
        wasSleeping.current = true
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    return () => stopSleepSound();
  }, [])

  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setCooldownRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemaining > 0]);

  useEffect(() => {
    if (!isPromptOpen) return;
    setCooldownRemaining(getInitialCooldown());
  }, [isPromptOpen]);

  useEffect(() => {
    if (!isWallOpen) return;
    setIsLoadingNotes(true);

    const q = query(collection(db, 'notes'), orderBy('timestamp', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotes: Note[] = [];
      snapshot.forEach((doc) => {
        fetchedNotes.push({ id: doc.id, ...doc.data() } as Note);
      });
      setNotes(fetchedNotes);
      setIsLoadingNotes(false);
    });

    return () => unsubscribe();
  }, [isWallOpen]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        signInAnonymously(auth).catch((error) => console.error("Auth error:", error));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmitNote = async () => {
    const text = noteText.trim();
    if (!text || !userId) return;

    const lastPost = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (lastPost) {
      const elapsed = Date.now() - parseInt(lastPost, 10);
      if (elapsed < COOLDOWN_MS) {
        const seconds = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        setCooldownRemaining(seconds);
        setIsPromptOpen(false);
        const template = COOLDOWN_PHRASES[Math.floor(Math.random() * COOLDOWN_PHRASES.length)];
        sayPhrase(template.replace('{s}', String(seconds)), 3000);
        return;
      }
    }

    setIsSubmitting(true);
    const colors = ["#FFE066", "#FF8FA3", "#A0D2EB", "#B5EAD7", "#D4A5FF", "#FFB347"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    try {
      await addDoc(collection(db, 'notes'), {
        text: text,
        color: randomColor,
        userId: userId,
        timestamp: serverTimestamp(),
      });
      localStorage.setItem(COOLDOWN_STORAGE_KEY, Date.now().toString());
      setCooldownRemaining(60);
      setNoteText('');
      setIsPromptOpen(false);
      const thanks = THANK_YOU_PHRASES[Math.floor(Math.random() * THANK_YOU_PHRASES.length)];
      sayPhrase(thanks, 3200);
      playSound('pop');
    } catch (error) {
      console.error("Error writing note: ", error);
      sayPhrase('oops! something broke', 3200);
    }
    setIsSubmitting(false);
  };

  const handleMascotClick = () => {
    playSound('pop');
    setIsPromptOpen(!isPromptOpen);
  };

  return (
    <>
      <style>{`
        @keyframes floatZzz {
          0% { transform: translateY(0px) scale(1); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-15px) scale(1.1); opacity: 0; }
        }
        .animate-float-zzz {
          animation: floatZzz 2.5s infinite ease-in-out;
        }
      `}</style>
      
      <div className="cursor-buddy-root fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
        
        <div className={`w-[calc(100vw-3rem)] max-w-[20rem] sm:w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 p-4 mb-4 transition-all duration-300 ease-out origin-bottom-right pointer-events-auto ${
          isPromptOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <h4 className="m-0 text-sm font-semibold text-gray-800 dark:text-gray-200">what do you want to say?</h4>
            <button 
              onClick={() => setIsPromptOpen(false)} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none transition-colors"
            >
              &times;
            </button>
          </div>
          
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            maxLength={140}
            placeholder="Write something nice..."
            rows={2}
            className="w-full border border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-sm font-sans resize-none focus:outline-none focus:border-gray-400 dark:focus:border-zinc-500 bg-white dark:bg-zinc-800 text-black dark:text-white transition-colors"
          />
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {cooldownRemaining > 0 ? `wait ${cooldownRemaining}s` : `${noteText.length}/140`}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => { setIsPromptOpen(false); setIsWallOpen(true); }}
                className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              >
                View Wall
              </button>
              <button 
                onClick={handleSubmitNote}
                disabled={isSubmitting || noteText.trim().length === 0}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors min-w-[52px] border ${
                  cooldownRemaining > 0
                    ? 'bg-transparent border-dashed border-gray-400 dark:border-zinc-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                    : 'bg-black dark:bg-white border-transparent text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50'
                }`}
              >
                {isSubmitting ? '...' : cooldownRemaining > 0 ? `${cooldownRemaining}s` : 'Post'}
              </button>
            </div>
          </div>
        </div>

        <div className="relative pointer-events-auto">
          
          <div className={`absolute bottom-full right-0 mb-3 bg-black dark:bg-white text-white dark:text-black text-xs px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none shadow-md z-50 transition-all duration-300 ease-out ${
            showBubble && phrase && !isWallOpen 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-2 scale-95'
          }`}>
            {phrase}
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-black dark:bg-white rotate-45"></div>
          </div>

          <button
            onClick={handleMascotClick}
            className="cursor-buddy relative w-24 h-24 flex items-center justify-center pointer-events-auto transition-transform duration-200 hover:scale-105"
            aria-label="Open note prompt"
          >
            <div className="cursor-buddy-inner relative w-full h-full">
              {isSleeping ? (
                <div className="relative w-full h-full">
                  <img src="/mascot-sleeping.svg" alt="" className="cursor-buddy-base w-full h-full object-contain" draggable={false} />
                  
                  <div className="absolute -top-4 -right-6 flex flex-row items-end gap-1">
                    <span className="text-xl font-bold text-gray-400 dark:text-gray-500 animate-float-zzz" style={{ animationDelay: '0s' }}>Z</span>
                    <span className="text-lg font-bold text-gray-400 dark:text-gray-500 animate-float-zzz" style={{ animationDelay: '0.3s' }}>z</span>
                    <span className="text-base font-bold text-gray-400 dark:text-gray-500 animate-float-zzz" style={{ animationDelay: '0.6s' }}>z</span>
                  </div>
                </div>
              ) : (
                <img src="/mascot.svg" alt="" className="cursor-buddy-base w-full h-full object-contain" draggable={false} />
              )}
            </div>
          </button>
        </div>
      </div>

      {isWallOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity duration-300"
          onClick={() => setIsWallOpen(false)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col relative transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-zinc-800">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">The Wall</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm m-0">Notes from amazing visitors</p>
              </div>
              <button 
                onClick={() => setIsWallOpen(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-3xl leading-none transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              {isLoadingNotes ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {notes.length === 0 ? (
                    <p className="col-span-full text-center text-gray-400 py-10">No notes yet. Be the first!</p>
                  ) : (
                    notes.map((note) => {
                      const rotation = (Math.random() * 6) - 3;
                      return (
                        <div 
                          key={note.id}
                          style={{ backgroundColor: note.color, transform: `rotate(${rotation}deg)` }}
                          className="p-4 rounded shadow-md flex flex-col justify-between min-h-[120px] transition-transform duration-300 hover:scale-105 hover:rotate-0 hover:z-10 text-black"
                        >
                          <div className="text-sm font-medium text-gray-800 break-words">
                            {note.text}
                          </div>
                          <div className="text-[0.65rem] text-right mt-2 text-black/50">
                            {note.timestamp ? note.timestamp.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now'}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}