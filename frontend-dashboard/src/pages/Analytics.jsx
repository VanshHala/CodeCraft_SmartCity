import { useEffect, useState } from "react";

export default function Analytics() {
  const [healthScores, setHealthScores] = useState([]);

  useEffect(() => {
    fetch("/api/analytics/health-score")
      .then((r) => r.json())
      .then((data) => {
        // Sort ascending by wardHealthScore (worst on top)
        data.sort((a, b) => a.wardHealthScore - b.wardHealthScore);
        setHealthScores(data);
      });
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ward Health Scores</h1>
      <div className="bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b bg-gray-50">
              <th className="p-3">Ward</th>
              <th className="p-3">Overall Health</th>
              <th className="p-3">Roads</th>
              <th className="p-3">Lighting</th>
              <th className="p-3">Water</th>
              <th className="p-3">Garbage</th>
              <th className="p-3">Safety</th>
            </tr>
          </thead>
          <tbody>
            {healthScores.map((score, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{score.ward}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded font-bold text-white ${
                    score.wardHealthScore >= 80 ? 'bg-green-500' :
                    score.wardHealthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {score.wardHealthScore}
                  </span>
                </td>
                <td className="p-3">{score.roadScore}</td>
                <td className="p-3">{score.lightingScore}</td>
                <td className="p-3">{score.waterScore}</td>
                <td className="p-3">{score.garbageScore}</td>
                <td className="p-3">{score.safetyScore}</td>
              </tr>
            ))}
            {healthScores.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Loading health scores...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
