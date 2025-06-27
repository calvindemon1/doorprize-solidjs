export async function createWinner(payload) {
  const res = await fetch(
    "http://31.97.60.198:3119/api/participants/winner",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal create winner");
  return data;
}

export async function updateWinner(payload) {
  const res = await fetch(
    "http://31.97.60.198:3119/api/participants/update-winner",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal update winner");
  return data;
}

export async function deleteWinner(id) {
  const res = await fetch(
    `http://31.97.60.198:3119/api/participants/winner/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal hapus winner");
  return data;
}
