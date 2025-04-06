import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUploadModal.css";


const API_BASE_URL = import.meta.sampleenv.VITE_API_BASE_URL;

const FileUploadModal = ({ isOpen, onClose, cardTitle }) => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // Filter for only CSV files
    const csvFiles = acceptedFiles.filter(file => file.name.toLowerCase().endsWith('.csv'));
    if (csvFiles.length !== acceptedFiles.length) {
      alert('Only CSV files are allowed');
    }
    setFiles((prevFiles) => [...prevFiles, ...csvFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    multiple: true,
    accept: {
      'text/csv': ['.csv']
    }
  });

  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setUploadStatus((prevStatus) => {
      const newStatus = { ...prevStatus };
      delete newStatus[fileName];
      return newStatus;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const results = await response.json();
      
      const newStatus = {};
      results.forEach((result) => {
        newStatus[result.filename] = {
          status: result.status,
          message: result.message
        };
      });
      
      setUploadStatus(newStatus);
      
      // Only clear files that were successfully uploaded
      const successfulUploads = results.filter(r => r.status === 'success').map(r => r.filename);
      setFiles(prevFiles => prevFiles.filter(file => !successfulUploads.includes(file.name)));
      
      if (results.every(r => r.status === 'success')) {
        setTimeout(() => {
          onClose();
          setUploadStatus({});
        }, 2000);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus(prev => ({
        ...prev,
        error: 'Upload failed. Please try again.'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Apply for {cardTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the CSV files here ...</p>
            ) : (
              <p>Drag 'n' drop CSV files here, or click to select files</p>
            )}
          </div>
          {files.length > 0 && (
            <div className="file-list">
              <p>Selected files:</p>
              <ul>
                {files.map((file) => (
                  <li key={file.name}>
                    {file.name}
                    {uploadStatus[file.name] && (
                      <span className={`status-${uploadStatus[file.name].status}`}>
                        {" - " + uploadStatus[file.name].message}
                      </span>
                    )}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveFile(file.name)}
                      disabled={isUploading}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="modal-actions">
            <button type="submit" disabled={files.length === 0 || isUploading}>
              {isUploading ? "Uploading..." : "Upload and Apply"}
            </button>
            <button type="button" onClick={onClose} disabled={isUploading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;