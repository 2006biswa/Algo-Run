import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function History() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    
    const fetchHistory = async () => {
      try {
        const res = await api.get('/code/history');
        setSubmissions(res.data);
      } catch (err) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) {
    return <div className="history-container"><p>Loading history...</p></div>;
  }

  return (
    <div className="history-container">
      <h2 style={{ marginBottom: '2rem' }}>Submission History</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet. Go to the editor and run some code!</p>
      ) : (
        submissions.map((sub) => (
          <div key={sub._id} className="glass-panel history-item">
            <div className="history-meta">
              <span>{new Date(sub.createdAt).toLocaleString()}</span>
              <span className={`history-status status-${sub.status.split(' ')[0]}`}>{sub.status}</span>
            </div>
            <details>
              <summary style={{ cursor: 'pointer', color: 'var(--accent-color)', fontWeight: 'bold' }}>View Code & Output</summary>
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Code:</strong></p>
                <pre className="code-area" style={{ padding: '1rem', marginBottom: '1rem', fontSize: '14px' }}>
                  {sub.code}
                </pre>
                <p><strong>Output:</strong></p>
                <pre className="output-area" style={{ fontSize: '14px' }}>
                  {sub.output}
                </pre>
              </div>
            </details>
          </div>
        ))
      )}
    </div>
  );
}

export default History;
