import { createSignal, onMount } from "solid-js";
import * as XLSX from "xlsx";
import DoorprizeForm from "./DoorprizeForm";
import { deleteWinner } from "../api/api";
import sfxButton from "../../assets/sfx/sfxbtn.wav";

export default function MobileViewCMS() {
  const buttonSound = new Audio(sfxButton);

  const [activeTab, setActiveTab] = createSignal("queue");
  const [dataQueue, setDataQueue] = createSignal([]);
  const [dataWinners, setDataWinners] = createSignal([]);
  const [dataSorted, setDataSorted] = createSignal([]);

  const [searchTerm, setSearchTerm] = createSignal("");
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 30;

  const [showForm, setShowForm] = createSignal(false);
  const [editData, setEditData] = createSignal(null);

  const openDoorprizeForm = (data) => {
    setEditData(data || null);
    setShowForm(true);
  };

  const handleCloseForm = async (success) => {
    setShowForm(false);
    if (success) {
      await refreshWinners();
    }
  };

  const refreshWinners = async () => {
    const resWinners = await fetch(
      "http://31.97.60.198:3119/api/participants/winners"
    );
    const winnerData = await resWinners.json();
    setDataWinners(winnerData || []);
  };

  onMount(async () => {
    try {
      const resQueue = await fetch(
        "http://31.97.60.198:3119/api/participants/queue"
      );
      const queueData = await resQueue.json();
      setDataQueue(queueData || []);

      await refreshWinners();

      const resSorted = await fetch(
        "http://31.97.60.198:3119/api/participants/all-sorted"
      );
      const sortedData = await resSorted.json();
      setDataSorted(sortedData || []);
    } catch (error) {
      console.error("Failed to fetch participants:", error);
    }
  });

  const tabData = () => {
    switch (activeTab()) {
      case "queue":
        return dataQueue();
      case "winners":
        return dataWinners();
      case "sorted":
        return dataSorted();
      default:
        return [];
    }
  };

  const filteredData = () => {
    const term = searchTerm().toLowerCase();
    return tabData().filter((item) => item.nama?.toLowerCase().includes(term));
  };

  const paginatedData = () => {
    const startIndex = (currentPage() - 1) * itemsPerPage;
    return filteredData().slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = () => {
    return Math.ceil(filteredData().length / itemsPerPage) || 1;
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab());
    XLSX.writeFile(wb, `${activeTab()}_data.xlsx`);
  };

  return (
    <div class="min-h-screen w-full p-8 bg-black text-white">
      {/* Tabs */}
      <div class="flex space-x-4 mb-6">
        {["queue", "winners", "sorted"].map((tab) => (
          <button
            class={`px-4 py-2 rounded transition-all duration-300 ${
              activeTab() === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => {
              buttonSound.play();
              setActiveTab(tab);
              setCurrentPage(1);
              setSearchTerm("");
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Create Button for winners */}
      {activeTab() === "winners" && (
        <button
          class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mb-4"
          onClick={() => openDoorprizeForm()}
        >
          + Tambah Winner
        </button>
      )}

      {/* Search + Export */}
      <div class="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by nama..."
          value={searchTerm()}
          onInput={(e) => setSearchTerm(e.target.value)}
          class="text-black px-3 py-2 rounded w-64"
        />
        <button
          class="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={handleExportExcel}
        >
          Export Excel
        </button>
      </div>

      {/* Table */}
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm text-left">
          <thead class="bg-gray-700 text-gray-200 uppercase">
            <tr>
              <th class="px-4 py-2">#</th>
              <th class="px-4 py-2">Nama</th>
              <th class="px-4 py-2">Status</th>
              <th class="px-4 py-2">Hadiah</th>
              <th class="px-4 py-2">Waktu Terupdate</th>
              {activeTab() === "winners" && <th class="px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData().map((item, index) => (
              <tr class="hover:bg-gray-700 transition-colors" key={index}>
                <td class="px-4 py-2">
                  {index + 1 + (currentPage() - 1) * itemsPerPage}
                </td>
                <td class="px-4 py-2">{item.nama}</td>
                <td class="px-4 py-2">{item.status || "-"}</td>
                <td class="px-4 py-2">{item.hadiah || "-"}</td>
                <td class="px-4 py-2">{item.updated_at || "-"}</td>
                {activeTab() === "winners" && (
                  <td class="px-4 py-2 flex space-x-2">
                    <button
                      class="bg-yellow-500 px-2 py-1 rounded text-white"
                      onClick={() => openDoorprizeForm(item)}
                    >
                      Edit
                    </button>
                    <button
                      class="bg-red-600 px-2 py-1 rounded text-white"
                      onClick={async () => {
                        if (confirm("Hapus data winner ini?")) {
                          await deleteWinner(item.id);
                          await refreshWinners();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div class="flex justify-between mt-4">
        <button
          disabled={currentPage() === 1}
          onClick={() => setCurrentPage(currentPage() - 1)}
          class="bg-gray-700 px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <span class="text-gray-300">
          Page {currentPage()} of {totalPages()}
        </span>
        <button
          disabled={currentPage() === totalPages()}
          onClick={() => setCurrentPage(currentPage() + 1)}
          class="bg-gray-700 px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {showForm() && (
        <DoorprizeForm
          data={editData()}
          isEdit={!!editData()}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
