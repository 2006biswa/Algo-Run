import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditorCode from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-twilight.css';
import api from '../api';

function Editor() {
  const [code, setCode] = useState('#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, AlgoRun!" << endl;\n    return 0;\n}');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleRun = async () => {
    setLoading(true);
    setOutput('Running...');
    setStatus('');
    try {
      const res = await api.post('/code/run', { code });
      setOutput(res.data.output);
      setStatus(res.data.status);
    } catch (err) {
      setOutput(err.response?.data?.error || 'Execution failed due to network error.');
      setStatus('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="glass-panel">
        <div className="editor-header" style={{ marginBottom: '1rem' }}>
          <h3>C++ Editor</h3>
          <button className="btn" onClick={handleRun} disabled={loading}>
            {loading ? 'Running...' : '▶ Run Code'}
          </button>
        </div>
        <div className="code-area">
          <EditorCode
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => Prism.highlight(code, Prism.languages.cpp, 'cpp')}
            padding={20}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
              minHeight: '400px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1rem' }}>Output</h3>
        <div className={`output-area ${status === 'Error' ? 'output-error' : ''}`}>
          {output || 'Output will appear here...'}
        </div>
        {status && <div style={{ marginTop: '1rem', fontWeight: 'bold' }} className={`status-${status.split(' ')[0]}`}>Status: {status}</div>}
      </div>
    </div>
  );
}

export default Editor;
