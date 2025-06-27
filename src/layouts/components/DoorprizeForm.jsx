import { createSignal } from "solid-js";
import { createWinner, updateWinner } from "../api/api"; // sesuaikan path lu

export default function DoorprizeForm(props) {
  const [nama, setNama] = createSignal(props.data?.nama || "");
  const [hadiah, setHadiah] = createSignal(props.data?.hadiah || "");

  const handleSave = async () => {
    try {
      if (props.isEdit) {
        await updateWinner({
          id: props.data.id,
          nama: nama(),
          hadiah: hadiah(),
        });
      } else {
        await createWinner({
          nama: nama(),
          hadiah: hadiah(),
        });
      }
      props.onClose(true);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded text-black w-96">
        <h2 class="text-xl mb-4">{props.isEdit ? "Edit" : "Tambah"} Winner</h2>
        <input
          type="text"
          placeholder="Nama"
          value={nama()}
          onInput={(e) => setNama(e.target.value)}
          class="border w-full p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Hadiah"
          value={hadiah()}
          onInput={(e) => setHadiah(e.target.value)}
          class="border w-full p-2 mb-2"
        />
        <div class="flex justify-end mt-4 space-x-2">
          <button
            class="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => props.onClose(false)}
          >
            Cancel
          </button>
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
