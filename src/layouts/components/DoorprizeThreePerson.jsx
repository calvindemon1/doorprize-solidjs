import { createSignal, onMount, onCleanup } from "solid-js";
import logoJudul from "../../assets/img/logojudul.webp";
import sfxButton from "../../assets/sfx/sfxbtn.wav";

export default function DoorprizeThreePersons() {
  const buttonSound = new Audio(sfxButton);

  const [participants, setParticipants] = createSignal([]);
  const [currentNames, setCurrentNames] = createSignal([]);
  const [isRolling, setIsRolling] = createSignal(false);
  let rollInterval;
  let hadiahCounter = 1;

  const WINNER_COUNT = 3;

  const getQueuedParticipants = () =>
    participants().filter((p) => p.status === "QUEUE");

  const startRolling = () => {
    if (getQueuedParticipants().length < WINNER_COUNT) {
      alert("Peserta tersisa tidak cukup untuk diundi.");
      return;
    }

    buttonSound.play();
    setIsRolling(true);
    setCurrentNames([]);

    rollInterval = setInterval(() => {
      const randomNames = pickRandomUnique(
        getQueuedParticipants(),
        WINNER_COUNT
      );
      setCurrentNames(randomNames);
    }, 100);
  };

  const stopRolling = async () => {
    if (!isRolling()) return;

    buttonSound.play();
    clearInterval(rollInterval);
    setIsRolling(false);

    const selected = currentNames();
    const now = new Date().toISOString();

    // ✅ Loop & kirim data ke backend
    for (const person of selected) {
      try {
        await fetch("http://31.97.60.198:3119/api/participants/update-winner", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: person.id,
            hadiah: `Special Custom Prize #${hadiahCounter}`,
          }),
        });
        hadiahCounter++;
      } catch (err) {
        console.error(`Gagal update untuk ${person.nama}`, err);
        alert(`Gagal update hadiah untuk ${person.nama}`);
      }
    }

    // ✅ Update state lokal
    const updated = participants().map((p) => {
      const match = selected.find((s) => s.id === p.id);
      if (match) {
        return {
          ...p,
          status: "DONE",
          hadiah: `Special Custom Prize #${hadiahCounter - 1}`, // atau simpan individual if needed
          updated_at: now,
        };
      }
      return p;
    });

    setParticipants(updated);
  };

  const pickRandomUnique = (list, count) => {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleKeyPress = (e) => {
    if (e.key === "r" || e.key === "R") {
      if (!isRolling()) startRolling();
    } else if (e.key === "s" || e.key === "S") {
      stopRolling();
    }
  };

  onMount(async () => {
    window.addEventListener("keydown", handleKeyPress);

    try {
      const res = await fetch(
        "http://31.97.60.198:3119/api/participants/queue",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setParticipants(data);
      } else {
        console.error("Data dari API bukan array", data);
      }
    } catch (err) {
      console.error("Gagal ambil data peserta", err);
    }
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyPress);
    clearInterval(rollInterval);
  });

  const doneParticipants = () =>
    participants().filter((p) => p.status === "DONE");

  return (
    <div class="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden px-4">
      <div class="text-2xl mb-6 text-center">
        {isRolling()
          ? "Mengundi..."
          : currentNames().length > 0
          ? `🎉 Pemenang: ${currentNames()
              .map((p) => p.nama)
              .join(", ")} 🎉`
          : "Tekan R untuk mulai, S untuk berhenti"}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {currentNames().map((p) => (
          <div class="bg-gray-800 rounded-xl p-4 text-center shadow-lg">
            <div class="text-2xl font-bold text-yellow-300">{p.nama}</div>
            <div class="text-sm text-gray-300">{p.notelp}</div>
          </div>
        ))}
      </div>

      <div class="text-sm text-gray-300 mb-2">
        Peserta tersisa: {getQueuedParticipants().length}
      </div>

      {doneParticipants().length > 0 && (
        <div class="mt-4 text-center">
          <h2 class="text-xl font-bold mb-2">🏆 Semua Pemenang:</h2>
          <ul>
            {doneParticipants().map((p, idx) => (
              <li key={idx} class="text-green-400">
                {idx + 1}. {p.nama} ({p.notelp}) - {p.hadiah}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
