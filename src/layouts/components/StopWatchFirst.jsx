import { createSignal, onMount, onCleanup } from "solid-js";
import logoJudul from "../../assets/img/logojudul.webp";
import sfxButton from "../../assets/sfx/sfxbtn.wav";
import { useParams } from "@solidjs/router";

export default function StopWatchFirst() {
  const [laps, setLaps] = createSignal([]);
  const [isRunning, setIsRunning] = createSignal(false);
  const [elapsed, setElapsed] = createSignal(0);
  const buttonSound = new Audio(sfxButton);
  const idStopWatch = useParams().id;
  let interval;
  let startTime = 0;

  const start = () => {
    if (!isRunning()) {
      // buttonSound.play();
      setIsRunning(true);
      startTime = Date.now() - elapsed(); // resume from current time
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 10); // update every 10ms
    }
  };

  const stop = () => {
    if (isRunning()) {
      // buttonSound.play();
      setIsRunning(false);
      clearInterval(interval);
    }
  };

  const reset = () => {
    // buttonSound.play();
    setIsRunning(false);
    clearInterval(interval);
    setElapsed(0);
  };

  const lap = () => {
    // buttonSound.play();
    const newLap = {
      time: formatTime(elapsed()),
      rawTime: elapsed(),
    };
    setLaps((prev) => [...prev, newLap]);
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
    } else if (e.key === "l" || e.key === "L") {
      lap();
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
    <div
      class="min-h-screen w-full grid grid-rows-2"
      style={{
        "font-family": "Gobold",
      }}
    >
      <div
        class={`${
          idStopWatch == 1
            ? "bg-[#00AA43]"
            : idStopWatch == 2
            ? "bg-[#D20019]"
            : "bg-[#007DCA]"
        } text-white flex flex-col items-center justify-center text-[150px] font-bold tracking-widest gap-4`}
      >
        <h1>
          {idStopWatch == 1 ? "5K" : idStopWatch == 2 ? "10K" : "HALF MARATHON"}
        </h1>
        <h1
          style={{
            "font-family": "Gobold",
          }}
        >
          {formatTime(elapsed())}
        </h1>
      </div>

      <div class=" bg-black text-white flex items-center h-full w-full gap-10 uppercase">
        <div class="w-3/4 max-h-[500px] overflow-y-auto border-4 border-gray-500 rounded">
          <table class="w-full text-left text-white border-collapse">
            <thead class="border-b-4 border-gray-500 text-[30px] sticky top-0 bg-black z-10">
              <tr>
                <th class="py-4 px-6 border-r-4 border-gray-500">#</th>
                <th class="py-4 px-6">Lap Time</th>
              </tr>
            </thead>
            <tbody
              class="overflow-y-auto"
              style={{
                "font-family": "Gobold",
              }}
            >
              <For each={laps()}>
                {(lap, i) => (
                  <tr class="border-b-2 border-gray-700 text-[30px] hover:bg-gray-800">
                    <td class="py-3 px-6 border-r-2 border-gray-700">
                      {i() + 1}
                    </td>
                    <td class="py-3 px-6">{lap.time}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        <div class="w-1/4 flex flex-col justify-center items-stretch gap-4 text-[35px]">
          <button
            onClick={start}
            class="bg-green-500 hover:bg-green-400 w-full px-6 py-3 rounded text-white uppercase"
          >
            Start (R)
          </button>
          <button
            onClick={stop}
            class="bg-red-500 hover:bg-red-400 w-full px-6 py-3 rounded text-white uppercase"
          >
            Stop (S)
          </button>
          <button
            onClick={lap}
            class="bg-blue-500 hover:bg-blue-400 w-full px-6 py-3 rounded text-white uppercase"
          >
            Lap (L)
          </button>
          <button
            onClick={reset}
            class="bg-yellow-500 hover:bg-yellow-400 w-full px-6 py-3 rounded text-white uppercase"
          >
            Reset Timer (T)
          </button>
          <button
            onClick={() => setLaps([])}
            class="bg-white text-black hover:bg-gray-200 w-full px-6 py-3 rounded uppercase"
          >
            Reset Laps
          </button>
        </div>
      </div>
    </div>
  );
}
