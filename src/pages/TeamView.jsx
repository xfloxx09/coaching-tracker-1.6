
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function TeamView() {
  const { id: teamId } = useParams();
  const [member, setMember] = useState('');
  const [style, setStyle] = useState('side_by_side');
  const [tcapId, setTcapId] = useState('');
  const [leitfaden, setLeitfaden] = useState({});
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState('');

  const leitfadenItems = ['Begrüßung', 'Legitimation', 'PKA', 'KEK', 'Angebot', 'Zusammenfassung', 'KZB'];

  const handleCheckboxChange = (item, value) => {
    setLeitfaden(prev => ({ ...prev, [item]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const neutralCount = Object.values(leitfaden).filter(v => v === 'ka').length;
    const checkedCount = Object.values(leitfaden).filter(v => v === true).length;
    const performance = score * 0.8 + (checkedCount / (leitfadenItems.length - neutralCount)) * 10 * 0.2;

    await addDoc(collection(db, 'coachings'), {
      teamId,
      member,
      style,
      tcapId: style === 'tcap' ? tcapId : null,
      leitfaden,
      score,
      performance,
      timeSpent,
      createdAt: serverTimestamp()
    });

    alert('Coaching gespeichert');
    setMember('');
    setStyle('side_by_side');
    setTcapId('');
    setLeitfaden({});
    setScore(0);
    setTimeSpent('');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-magenta mb-4">Coaching für Team {teamId}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
        <input
          type="text"
          placeholder="Mitarbeitername"
          className="p-2 text-black"
          value={member}
          onChange={(e) => setMember(e.target.value)}
        />

        <label className="text-white">Coaching-Stil:</label>
        <select className="p-2 text-black" value={style} onChange={(e) => setStyle(e.target.value)}>
          <option value="side_by_side">Side-by-Side</option>
          <option value="tcap">T-CAP</option>
        </select>

        {style === 'tcap' && (
          <input
            type="text"
            placeholder="T-CAP ID"
            className="p-2 text-black"
            value={tcapId}
            onChange={(e) => setTcapId(e.target.value)}
          />
        )}

        <label className="text-white">Leitfaden:</label>
        {leitfadenItems.map((item) => (
          <div key={item} className="flex gap-2 items-center">
            <label>{item}:</label>
            <input type="radio" name={item} value="true" onChange={() => handleCheckboxChange(item, true)} /> ✓
            <input type="radio" name={item} value="false" onChange={() => handleCheckboxChange(item, false)} /> ✗
            <input type="radio" name={item} value="ka" onChange={() => handleCheckboxChange(item, 'ka')} /> k.A.
          </div>
        ))}

        <label className="text-white">Bewertung (0-10):</label>
        <input
          type="number"
          min="0"
          max="10"
          className="p-2 text-black"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
        />

        <label className="text-white">Zeitaufwand (Minuten):</label>
        <input
          type="number"
          className="p-2 text-black"
          value={timeSpent}
          onChange={(e) => setTimeSpent(e.target.value)}
        />

        <button type="submit" className="bg-magenta text-white p-2">Coaching speichern</button>
      </form>
    </div>
  );
}
