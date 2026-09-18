import { useState, useEffect } from 'react';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch('/api/analytics/leaderboard').then(r => r.json()).then(setLeaders);
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">🏆 Citizen Leaderboard</h2>
      <div className="bg-white shadow rounded p-4">
        {leaders.map((l, i) => (
          <div key={i} className="flex justify-between border-b py-3 last:border-0">
            <span className="text-lg">
              {i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : <span className="w-8 inline-block text-center font-bold text-gray-500">{i + 1}.</span>}
              {l.name}
            </span>
            <span className="font-bold text-green-600 text-lg">{l.points} pts</span>
          </div>
        ))}
        {leaders.length === 0 && <div className="text-gray-500 text-center">No data yet. Report issues to earn points!</div>}
      </div>
    </div>
  );
}
