import React, { useState } from 'react';
import axios from 'axios';

const UploadMenu = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file first");
    setUploading(true);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
     const res = await axios.post('http://localhost:8000/api/sales/upload-menu/', formData, {

        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Upload successful');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-2">Upload Menu PDF</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadMenu;
