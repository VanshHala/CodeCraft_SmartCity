import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResolveTask({ workerId }) {
  const { clusterId } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!photo) { setStatus("Please provide an after photo."); return; }
    
    setStatus("Uploading photo...");
    const form = new FormData();
    form.append("file", photo);
    
    try {
      const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
      const photoUrl = await uploadRes.text();
      
      setStatus("Resolving task...");
      const res = await fetch(`/api/clusters/${clusterId}/resolve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: workerId,
          afterPhotoUrl: photoUrl,
          notes: notes
        })
      });
      
      if (res.ok) {
        navigate("/");
      } else {
        setStatus("Error resolving task.");
      }
    } catch (err) {
      setStatus("Failed to submit.");
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Resolve Task #{clusterId}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">After Photo</label>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            onChange={(e) => setPhoto(e.target.files[0])} 
            className="w-full border rounded p-2" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Resolution Notes</label>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded p-2" 
            rows="3"
            placeholder="What work was done?"
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded">
          Mark Resolved
        </button>
        {status && <div className="text-sm text-center text-gray-600">{status}</div>}
      </form>
    </div>
  );
}
