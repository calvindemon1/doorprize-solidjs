import { createSignal, onMount, onCleanup } from "solid-js";
import logoJudul from "../../assets/img/logojudul.webp";
import sfxButton from "../../assets/sfx/sfxbtn.wav";

export default function StopWatchFirst() {
  const [isRunning, setIsRunning] = createSignal(false);
  const [elapsed, setElapsed] = createSignal(0);
  const buttonSound = new Audio(sfxButton);
  let interval;
  let startTime = 0;

  const start = () => {
    if (!isRunning()) {
      buttonSound.play();
      setIsRunning(true);
      startTime = Date.now() - elapsed(); // resume from current time
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 10); // update every 10ms
    }
  };

  const stop = () => {
    if (isRunning()) {
      buttonSound.play();
      setIsRunning(false);
      clearInterval(interval);
    }
  };

  const reset = () => {
    buttonSound.play();
    setIsRunning(false);
    clearInterval(interval);
    setElapsed(0);
  };

  const formatTime = (ms) => {
    const date = new Date(ms);
    const h = String(date.getUTCHours()).padStart(2, "0");
    const m = String(date.getUTCMinutes()).padStart(2, "0");
    const s = String(date.getUTCSeconds()).padStart(2, "0");
    const msPart = String(Math.floor(ms % 1000)).padStart(3, "0");
    return `${h}:${m}:${s}.${msPart}`;
  };

  const handleKey = (e) => {
    if (e.key === "r" || e.key === "R") {
      start();
    } else if (e.key === "s" || e.key === "S") {
      stop();
    } else if (e.key === "t" || e.key === "T") {
      reset();
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKey);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKey);
    clearInterval(interval);
  });

  return (
    <div class="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden px-4">
      <p class="text-xl mb-2">🏃 Pocari Run Marathon 5K 🏃</p>

      <div class="text-5xl font-bold tracking-widest bg-blue-600 px-6 py-4 rounded-lg shadow-lg mb-6">
        {formatTime(elapsed())}
      </div>

      <div class="flex gap-4">
        <button
          onClick={start}
          class="bg-green-500 hover:bg-green-400 px-4 py-2 rounded text-white"
        >
          Start (R)
        </button>
        <button
          onClick={stop}
          class="bg-red-500 hover:bg-red-400 px-4 py-2 rounded text-white"
        >
          Stop (S)
        </button>
        <button
          onClick={reset}
          class="bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded text-white"
        >
          Reset (T)
        </button>
      </div>
    </div>
  );
}
