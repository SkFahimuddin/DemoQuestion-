import React, {useState} from 'react';
import axios from 'axios';
import API_URL from '../config'; // ADD THIS LINE

export default function Login({ onLogin }){
  const [teacherID, setTeacherID] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try{
      // CHANGE: Replace 'http://localhost:5000' with API_URL
      const res = await axios.post(`${API_URL}/api/auth/login`, { teacherID, password });
      onLogin(res.data.token, { teacherID: res.data.teacherID, name: res.data.name });
    }catch(err){
      setMsg(err.response?.data?.message || 'Error');
    }
  }

  return (
    <div>
      <h4>Login</h4>
      <form onSubmit={submit}>
        <div className="mb-2"><input className="form-control" placeholder="Teacher ID" value={teacherID} onChange={e=>setTeacherID(e.target.value)} /></div>
        <div className="mb-2"><input type="password" className="form-control" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button className="btn btn-success" type="submit">Login</button>
      </form>
      {msg && <div className="mt-2 alert alert-danger">{msg}</div>}
    </div>
  );
}