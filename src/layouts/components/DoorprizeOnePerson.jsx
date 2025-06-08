import { createSignal, onMount, onCleanup } from "solid-js";
import logoJudul from "../../assets/img/logojudul.webp";
import sfxButton from "../../assets/sfx/sfxbtn.wav";

export default function DoorprizeOnePerson() {
  const buttonSound = new Audio(sfxButton);

  const hadiahKe = 1; // bisa diubah sesuai logic undian
  const initialParticipants = [
    {
      nama: "Erick",
      notelp: "081234567891",
      status: "QUEUE",
      hadiah: null,
      updated_at: null,
    },
    {
      nama: "Dina",
      notelp: "081234567892",
      status: "QUEUE",
      hadiah: null,
      updated_at: null,
    },
    {
      nama: "Budi",
      notelp: "081234567893",
      status: "QUEUE",
      hadiah: null,
      updated_at: null,
    },
    {
      nama: "Sari",
      notelp: "081234567894",
      status: "QUEUE",
      hadiah: null,
      updated_at: null,
    },
    {
      nama: "Andi",
      notelp: "081234567895",
      status: "QUEUE",
      hadiah: null,
      updated_at: null,
    },
  ];

  const [participants, setParticipants] = createSignal(initialParticipants);
  const [currentName, setCurrentName] = createSignal(null);
  const [winner, setWinner] = createSignal(null);
  const [isRolling, setIsRolling] = createSignal(false);
  let rollInterval;

  const startRolling = () => {
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

  const stopRolling = () => {
    if (isRolling()) {
      buttonSound.play();
      clearInterval(rollInterval);
      setIsRolling(false);
      const selected = currentName();
      const now = new Date().toISOString();
      const updatedList = participants().map((p) =>
        p.nama === selected.nama
          ? {
              ...p,
              status: "DONE",
              hadiah: hadiahKe,
              updated_at: now,
            }
          : p
      );
      setParticipants(updatedList);
      setWinner({
        ...selected,
        status: "DONE",
        hadiah: hadiahKe,
        updated_at: now,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "r" || e.key === "R") {
      if (!isRolling()) startRolling();
    } else if (e.key === "s" || e.key === "S") {
      stopRolling();
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyPress);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyPress);
    clearInterval(rollInterval);
  });

  return (
    <div class="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <img src={logoJudul} alt="Logo" class="w-[500px] mb-6" />

      <div class="text-4xl mb-6 text-center">
        {isRolling() && currentName() && (
          <>
            <div>Mengundi...</div>
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
        {!isRolling() && !winner() && (
          <div>
            Tekan <span class="text-green-400 font-bold">R</span> untuk mulai
            undian
          </div>
        )}
      </div>
    </div>
  );
}
