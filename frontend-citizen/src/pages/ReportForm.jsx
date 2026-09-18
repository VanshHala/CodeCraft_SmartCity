import { useState } from "react";

export default function ReportForm() {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("POTHOLE");
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("");

  function captureLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setStatus("Location permission denied — please enable GPS.")
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!coords) { setStatus("Please capture your location first."); return; }
    const form = new FormData();
    form.append("file", photo);
    const uploadRes = await fetch("/api/uploads", { method: "POST", body: form });
    const { url: photoUrl } = await uploadRes.json();
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenId: 1, // replace with logged-in user id once STEP 17 auth exists
        photoUrl, description, issueType, lat: coords.lat, lng: coords.lng,
      }),
    });
    const data = await res.json();
    setStatus(
      data.mergedIntoExistingCluster
        ? `This issue already exists — ${data.clusterReportCount} citizens have reported it now.`
        : "Report submitted! Thank you."
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <input type="file" accept="image/*" capture="environment"
        onChange={(e) => setPhoto(e.target.files[0])} required />
      <select value={issueType} onChange={(e) => setIssueType(e.target.value)}
        className="w-full border p-2 rounded">
        <option value="POTHOLE">Pothole</option>
        <option value="STREETLIGHT">Streetlight</option>
        <option value="WATER">Water Leakage</option>
        <option value="GARBAGE">Garbage</option>
        <option value="SAFETY">Safety</option>
        <option value="OTHER">Other</option>
      </select>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional description" className="w-full border p-2 rounded" />
      <button type="button" onClick={captureLocation} className="border px-3 py-2 rounded">
        {coords ? `Location captured ✓ (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})` : "Capture Location"}
      </button>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
        Submit Report
      </button>
      {status && <p className="text-sm text-gray-700">{status}</p>}
    </form>
  );
}
