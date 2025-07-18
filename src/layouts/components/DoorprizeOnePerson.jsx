import { createSignal, onMount, onCleanup } from "solid-js";
import logoJudul from "../../assets/img/logojudul.webp";
import sfxButton from "../../assets/sfx/sfxbtn.wav";

export default function DoorprizeOnePerson() {
  const buttonSound = new Audio(sfxButton);
  const hadiahKe = 1;

  const [participants, setParticipants] = createSignal([]);
  const [currentName, setCurrentName] = createSignal(null);
  const [winner, setWinner] = createSignal(null);
  const [isRolling, setIsRolling] = createSignal(false);
  const [isFinishing, setIsFinishing] = createSignal(false);

  let rollInterval;

  const startRolling = () => {
    if (participants().length === 0) return;

    buttonSound.play();
    setIsRolling(true);
    setWinner(null);

    rollInterval = setInterval(() => {
      const available = participants().filter((p) => p.status === "QUEUE");
      if (available.length === 0) {
        clearInterval(rollInterval);
        setIsRolling(false);
        return;
      }
      const random = available[Math.floor(Math.random() * available.length)];
      setCurrentName(random);
    }, 50);
  };

  const stopRolling = async () => {
    if (!isRolling()) return;

    buttonSound.play();
    clearInterval(rollInterval);
    setIsRolling(false);

    const selected = currentName();
    if (!selected || !selected.id) return;

    const now = new Date().toISOString();
    const hadiahLabel = "Special Custom Prize";
    setIsFinishing(true);

    try {
      const res = await fetch(
        "https://bedoorprize.nexttechenterprise.site/api/participants/update-winner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selected.id,
            hadiah: hadiahLabel,
          }),
        }
      );

      if (!res.ok) throw new Error("Gagal update winner");

      const updatedList = participants().map((p) =>
        p.id === selected.id
          ? {
              ...p,
              status: "DONE",
              hadiah: hadiahLabel,
              updated_at: now,
            }
          : p
      );

      setParticipants(updatedList);
      setWinner({
        ...selected,
        status: "DONE",
        hadiah: hadiahLabel,
        updated_at: now,
      });
    } catch (err) {
      console.error("Gagal kirim data pemenang ke server:", err);
      alert("Gagal kirim data pemenang. Cek koneksi atau server.");
    } finally {
      setIsFinishing(false);
    }
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
        "https://bedoorprize.nexttechenterprise.site/api/participants/queue",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (Array.isArray(data.data)) {
        setParticipants(data.data);
      } else {
        console.error("Data from API is not an array:", data.data);
      }
    } catch (err) {
      console.error("Failed to fetch participants:", err);
    }
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyPress);
    clearInterval(rollInterval);
  });

  return (
    <div class="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <div class="text-4xl mb-6 text-center">
        {isRolling() && currentName() && (
          <>
            <div class="font-bold">{currentName().nama}</div>
            <div>{currentName().notelp}</div>
          </>
        )}
        {winner() && (
          <>
            <div class="text-5xl font-bold text-yellow-400">🎉 Pemenang 🎉</div>
            <div class="text-4xl">{winner().nama}</div>
            <div class="text-2xl text-gray-300">{winner().notelp}</div>
            <div class="mt-2 text-lg">Hadiah ke-{winner().hadiah}</div>
          </>
        )}
        {/* {!isRolling() && !winner() && !isFinishing() && (
          <div>
            Tekan <span class="text-green-400 font-bold">R</span> untuk mulai
            undian
          </div>
        )} */}
      </div>
    </div>
  );
}
