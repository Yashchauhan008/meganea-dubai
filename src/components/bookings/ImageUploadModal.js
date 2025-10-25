import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, UploadCloud, Loader2 } from 'lucide-react';
import { uploadBookingImages } from '../../api/bookingApi'; // We will create this API function

const ImageUploadModal = ({ bookingId, onClose, onUploadSuccess }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const newFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] }
    });

    const removeFile = (fileName) => {
        setFiles(prev => prev.filter(file => file.name !== fileName));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Please select at least one file to upload.');
            return;
        }
        setLoading(true);
        setError('');

        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file); // Use 'images' to match the backend route
        });

        try {
            await uploadBookingImages(bookingId, formData);
            onUploadSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-foreground rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Upload Delivery Notes</h2>
                    <button onClick={onClose}><X /></button>
                </div>

                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-600 hover:border-primary'}`}>
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                        <UploadCloud size={48} className="text-gray-400 mb-4" />
                        {isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag & drop some files here, or click to select files</p>
                        }
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold">Selected Files:</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-dark-background rounded">
                            {files.map(file => (
                                <div key={file.name} className="relative">
                                    <img src={file.preview} alt={file.name} className="w-full h-24 object-cover rounded-md" onLoad={() => URL.revokeObjectURL(file.preview)} />
                                    <button onClick={() => removeFile(file.name)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button onClick={handleUpload} disabled={loading || files.length === 0} className="flex items-center justify-center bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-primary-hover disabled:opacity-50">
                        {loading && <Loader2 size={18} className="animate-spin mr-2" />}
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModal;
