
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TeamDashboard() {
  const { id: teamId } = useParams();
  const [coachings, setCoachings] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'coachings'), where('teamId', '==', teamId));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setCoachings(data);

      const members = {};
      let totalPerformance = 0;
      let totalTime = 0;
      data.forEach((item) => {
        totalPerformance += item.performance;
        totalTime += parseFloat(item.timeSpent);
        if (!members[item.member]) members[item.member] = { performance: 0, count: 0 };
        members[item.member].performance += item.performance;
        members[item.member].count++;
      });

      const memberStats = Object.keys(members).map(name => ({
        name,
        avg: (members[name].performance / members[name].count).toFixed(2)
      }));

      setStats({
        avgPerformance: (totalPerformance / data.length).toFixed(2),
        totalTime,
        memberStats
      });
    };

    fetchData();
  }, [teamId]);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl text-magenta mb-4">Dashboard für Team {teamId}</h2>
      <p>⏱️ Gesamtzeit Coaching: {stats.totalTime} Minuten</p>
      <p>📊 Durchschnittliche Leistung: {stats.avgPerformance}</p>

      <div className="h-80 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.memberStats}>
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip wrapperStyle={{ backgroundColor: '#000' }} />
            <Bar dataKey="avg" fill="#e20074" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
