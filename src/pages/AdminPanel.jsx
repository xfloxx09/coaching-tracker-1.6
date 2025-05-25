import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('team_leader');
  const [teamId, setTeamId] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        role,
        teamId
      });
      alert('Benutzer erstellt');
    } catch (error) {
      alert('Fehler beim Erstellen');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl text-magenta mb-4">Adminbereich – Benutzer erstellen</h2>
      <form onSubmit={handleCreateUser} className="flex flex-col gap-4 max-w-md">
        <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 text-black" />
        <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 text-black" />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 text-black">
          <option value="admin">Admin</option>
          <option value="team_leader">Teamleiter</option>
        </select>
        <input type="text" placeholder="Team ID" value={teamId} onChange={(e) => setTeamId(e.target.value)} className="p-2 text-black" />
        <button type="submit" className="bg-magenta text-white p-2">Benutzer erstellen</button>
      </form>
    </div>
  );
}