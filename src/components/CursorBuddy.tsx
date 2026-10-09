import { useEffect, useRef, useState } from 'react'
import type { Timestamp } from 'firebase/firestore'

const COOLDOWN_MS = 60000
const COOLDOWN_STORAGE_KEY = 'lastPostAt'
const INTRO_STORAGE_KEY = 'mascotGuestbookIntroSeen'
const IDLE_DELAY_MS = 45000

const AMBIENT_PHRASES = [
  'The guestbook is open',
  'Thanks for stopping by',
  'Take your time',
  'There is more below',
]

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

export default function CursorBuddy({ onStartMining }: { onStartMining: () => void }) {
  const [phrase, setPhrase] = useState('')
  const [showBubble, setShowBubble] = useState(false)
  const [shouldIntroduce] = useState(
    () => !sessionStorage.getItem(INTRO_STORAGE_KEY),
  )
  const [userId, setUserId] = useState<string | null>(null)
  const [isSleeping, setIsSleeping] = useState(false)
  const lastActivity = useRef(Date.now())
  const mascotButtonRef = useRef<HTMLButtonElement>(null)
  const noteInputRef = useRef<HTMLTextAreaElement>(null)

  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [isWallOpen, setIsWallOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingNotes, setIsLoadingNotes] = useState(false)
  const [notesError, setNotesError] = useState('')
  const [wallRetryKey, setWallRetryKey] = useState(0)
  const [cooldownRemaining, setCooldownRemaining] = useState(getInitialCooldown)

  const playSound = (soundName: string) => {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  const sayPhrase = (message: string, duration = 3200) => {
    setPhrase(message)
    setShowBubble(true)
    window.setTimeout(() => setShowBubble(false), duration)
  }

  useEffect(() => {
    if (!shouldIntroduce) return
    sessionStorage.setItem(INTRO_STORAGE_KEY, 'true')
    const introTimer = window.setTimeout(
      () => sayPhrase('Leave a note in my guestbook', 4200),
      700,
    )
    return () => window.clearTimeout(introTimer)
  }, [shouldIntroduce])

  useEffect(() => {
    if (isPromptOpen || isWallOpen || isSleeping) return

    let phraseTimer: number
    const schedulePhrase = () => {
      const delay = 25000 + Math.random() * 15000
      phraseTimer = window.setTimeout(() => {
        const next = AMBIENT_PHRASES[Math.floor(Math.random() * AMBIENT_PHRASES.length)]
        sayPhrase(next, 3200)
        schedulePhrase()
      }, delay)
    }

    schedulePhrase()
    return () => window.clearTimeout(phraseTimer)
  }, [isPromptOpen, isSleeping, isWallOpen])

  useEffect(() => {
    const markActive = () => {
      lastActivity.current = Date.now()
      if (isSleeping) {
        setIsSleeping(false)
        sayPhrase('Welcome back', 2400)
      }
    }

    const idleTimer = window.setInterval(() => {
      if (isPromptOpen || isWallOpen || isSleeping) return
      if (Date.now() - lastActivity.current >= IDLE_DELAY_MS) {
        setShowBubble(false)
        setIsSleeping(true)
      }
    }, 1000)

    window.addEventListener('mousemove', markActive)
    window.addEventListener('scroll', markActive, { passive: true })
    window.addEventListener('keydown', markActive)
    window.addEventListener('touchstart', markActive, { passive: true })

    return () => {
      window.clearInterval(idleTimer)
      window.removeEventListener('mousemove', markActive)
      window.removeEventListener('scroll', markActive)
      window.removeEventListener('keydown', markActive)
      window.removeEventListener('touchstart', markActive)
    }
  }, [isPromptOpen, isSleeping, isWallOpen])

  useEffect(() => {
    if (!isPromptOpen) return
    noteInputRef.current?.focus()
  }, [isPromptOpen])

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (isWallOpen) setIsWallOpen(false)
      else if (isPromptOpen) setIsPromptOpen(false)
      mascotButtonRef.current?.focus()
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [isPromptOpen, isWallOpen])

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
    setNotesError('');
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    void Promise.all([import('../firebase'), import('firebase/firestore')])
      .then(([{ db }, firestore]) => {
        if (cancelled) return;
        const q = firestore.query(
          firestore.collection(db, 'notes'),
          firestore.orderBy('timestamp', 'desc'),
          firestore.limit(100),
        );
        unsubscribe = firestore.onSnapshot(
          q,
          (snapshot) => {
            const fetchedNotes: Note[] = [];
            snapshot.forEach((noteDocument) => {
              fetchedNotes.push({ id: noteDocument.id, ...noteDocument.data() } as Note);
            });
            setNotes(fetchedNotes);
            setIsLoadingNotes(false);
          },
          () => {
            setNotesError('Could not load notes right now.');
            setIsLoadingNotes(false);
          },
        );
      })
      .catch(() => {
        if (!cancelled) {
          setNotesError('Could not load notes right now.');
          setIsLoadingNotes(false);
        }
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [isWallOpen, wallRetryKey]);

  useEffect(() => {
    if (!isPromptOpen) return;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    void Promise.all([import('../firebase'), import('firebase/auth')]).then(([{ auth }, authApi]) => {
      if (cancelled) return;
      unsubscribe = authApi.onAuthStateChanged(auth, (user) => {
        if (user) setUserId(user.uid);
        else void authApi.signInAnonymously(auth);
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [isPromptOpen]);

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
      const [{ db }, firestore] = await Promise.all([
        import('../firebase'),
        import('firebase/firestore'),
      ]);
      await firestore.addDoc(firestore.collection(db, 'notes'), {
        text: text,
        color: randomColor,
        userId: userId,
        timestamp: firestore.serverTimestamp(),
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
    setIsSleeping(false)
    lastActivity.current = Date.now()
    setIsPromptOpen(!isPromptOpen);
  };

  return (
    <>
      <div className="cursor-buddy-root fixed bottom-4 right-4 z-[9999] flex flex-col items-end pointer-events-none sm:bottom-6 sm:right-6">
        
        {isPromptOpen && <div
          className="w-[calc(100vw-3rem)] max-w-[20rem] sm:w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 p-4 mb-4 origin-bottom-right pointer-events-auto"
          role="dialog"
          aria-labelledby="guestbook-prompt-title"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 id="guestbook-prompt-title" className="m-0 text-sm font-semibold text-gray-800 dark:text-gray-200">what do you want to say?</h4>
            <button 
              onClick={() => setIsPromptOpen(false)} 
              aria-label="Close note prompt"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none transition-colors"
            >
              &times;
            </button>
          </div>
          
          <textarea
            ref={noteInputRef}
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
                disabled={isSubmitting || !userId || noteText.trim().length === 0}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors min-w-[52px] border ${
                  cooldownRemaining > 0
                    ? 'bg-transparent border-dashed border-gray-400 dark:border-zinc-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                    : 'bg-black dark:bg-white border-transparent text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50'
                }`}
              >
                {isSubmitting ? '...' : !userId ? 'Connecting…' : cooldownRemaining > 0 ? `${cooldownRemaining}s` : 'Post'}
              </button>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-100 pt-3 dark:border-zinc-800">
            <button type="button" onClick={onStartMining} className="min-h-11 w-full rounded-md border border-gray-200 px-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-800">
              Mine this page
            </button>
            <p className="mt-2 text-xs text-gray-500">A little demolition. Everything restores when you exit.</p>
          </div>
        </div>}

        <div className="relative pointer-events-auto">
          
          <div className={`absolute bottom-full right-0 mb-3 max-w-[calc(100vw-2rem)] rounded-lg bg-black px-3 py-2 text-right text-xs text-white shadow-md transition-all duration-300 ease-out pointer-events-none z-50 dark:bg-white dark:text-black sm:max-w-none sm:whitespace-nowrap ${
            showBubble && phrase && !isWallOpen && !isSleeping
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-2 scale-95'
          }`}>
            {phrase}
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-black dark:bg-white rotate-45"></div>
          </div>

          <button
            ref={mascotButtonRef}
            onClick={handleMascotClick}
            className={`cursor-buddy relative flex h-16 w-16 items-center justify-center pointer-events-auto transition-transform duration-200 hover:scale-105 sm:h-24 sm:w-24 ${isSleeping ? 'is-sleeping' : ''}`}
            aria-label={isSleeping ? 'Wake mascot and open visitor guestbook' : 'Open visitor guestbook'}
          >
            <div className="cursor-buddy-inner relative w-full h-full">
              <img
                src={isSleeping ? '/mascot-sleeping.svg' : '/mascot.svg'}
                alt=""
                className="cursor-buddy-base w-full h-full object-contain"
                draggable={false}
              />
              {isSleeping && (
                <span className="mascot-sleep-mark" aria-hidden="true">z z z</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {isWallOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity duration-300"
          onClick={() => setIsWallOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="visitor-wall-title"
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col relative transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-zinc-800">
              <div>
                <h2 id="visitor-wall-title" className="text-2xl font-bold text-gray-900 dark:text-white m-0">The Wall</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm m-0">Notes from amazing visitors</p>
              </div>
              <button 
                onClick={() => setIsWallOpen(false)}
                aria-label="Close visitor wall"
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
              ) : notesError ? (
                <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{notesError}</p>
                  <button
                    onClick={() => setWallRetryKey((key) => key + 1)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-800"
                  >
                    Try again
                  </button>
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
