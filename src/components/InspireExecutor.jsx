import React, { useState } from 'react';
import axios from 'axios';

function InspireExecutor() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [archivo, setArchivo] = useState(null);

  const ejecutar = async () => {
    if (!archivo) {
      alert('📁 Selecciona un archivo JSON antes de ejecutar');
      return;
    }

    setLoading(true);
    setOutput('');
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);

      const res = await axios.post('http://localhost:8080/generar-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setOutput(res.data);
    } catch (error) {
      setOutput('❌ Error al ejecutar: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async () => {
    try {
      const response = await fetch('http://localhost:8080/descargar-pdf');
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

      <input
        type="file"
        accept=".json"
        onChange={(e) => setArchivo(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={ejecutar}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mb-4"
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
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        📥 Descargar PDF
      </button>
    </div>
  );
}

export default InspireExecutor;