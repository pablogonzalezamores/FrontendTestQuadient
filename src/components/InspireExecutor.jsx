import React, { useState } from 'react';
import axios from 'axios';

function InspireExecutor() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const ejecutar = async () => {
    setLoading(true);
    setOutput('');
    try {
      const res = await axios.get('http://localhost:8080/generar-pdf');
      setOutput(res.data);
    } catch (error) {
      setOutput('❌ Error al ejecutar: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async () => {
    try {
      const response = await fetch('http://localhost:8080/descargar-pdf', {
        method: 'GET',
      });
  
      if (!response.ok) throw new Error('Error al descargar el PDF');
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Output1.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('❌ No se pudo descargar el PDF');
      console.error(error);
    }
  };
  

  return (
    <div className="p-6 bg-white shadow rounded max-w-xl mx-auto mt-10 text-center">
      <h2 className="text-xl font-semibold mb-4">🛠 Ejecutar InspireCLI</h2>
      <button
        onClick={ejecutar}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Ejecutando...' : 'Ejecutar'}
      </button>

      {output && (
        <pre className="mt-4 bg-gray-100 p-4 rounded text-left text-sm overflow-auto max-h-80">
          {output}
        </pre>
      )}

      <button
        onClick={descargarPDF}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        📥 Descargar PDF
      </button>

    </div>
  );
}

export default InspireExecutor;