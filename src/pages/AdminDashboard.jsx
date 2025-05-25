
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function AdminDashboard() {
  const [coachings, setCoachings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'coachings'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCoachings(data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    };
    fetchData();
  }, []);

  const exportCSV = () => {
    const headers = ['Team', 'Mitarbeiter', 'Stil', 'T-CAP ID', 'Score', 'Zeit', 'Datum'];
    const rows = coachings.map(coaching => [
      coaching.teamId,
      coaching.member,
      coaching.style,
      coaching.tcapId || '-',
      coaching.performance?.toFixed(2),
      coaching.timeSpent,
      new Date(coaching.createdAt?.seconds * 1000).toLocaleString()
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "coachings.csv";
    link.click();
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl text-magenta mb-4">Admin-Dashboard: Alle Coachings</h2>
      <button onClick={exportCSV} className="mb-4 bg-magenta p-2 text-white">CSV Export</button>
      <table className="table-auto w-full text-left text-sm">
        <thead className="bg-magenta text-white">
          <tr>
            <th className="p-2">Team</th>
            <th className="p-2">Mitarbeiter</th>
            <th className="p-2">Stil</th>
            <th className="p-2">T-CAP ID</th>
            <th className="p-2">Score</th>
            <th className="p-2">Zeit</th>
            <th className="p-2">Datum</th>
          </tr>
        </thead>
        <tbody>
          {coachings.map(coaching => (
            <tr key={coaching.id} className="border-b border-magenta/50">
              <td className="p-2">{coaching.teamId}</td>
              <td className="p-2">{coaching.member}</td>
              <td className="p-2">{coaching.style}</td>
              <td className="p-2">{coaching.tcapId || '-'}</td>
              <td className="p-2">{coaching.performance?.toFixed(2)}</td>
              <td className="p-2">{coaching.timeSpent}</td>
              <td className="p-2">{new Date(coaching.createdAt?.seconds * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
