// import React, { useState, useEffect } from 'react';
// import { createTile, updateTile, uploadTileImage } from '../../api/tileApi';
// import Input from '../ui/Input';
// import Select from '../ui/Select';
// import Label from '../ui/Label';
// import { X, UploadCloud } from 'lucide-react';

// const TileFormModal = ({ tile, onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     name: '', number: '', surface: 'Glossy', size: '', imageUrl: '', publicId: '',
//     conversionFactor: 1, restockThreshold: 0,
//     availableStock: 0, bookedStock: 0, restockingStock: 0,
//   });

//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const isEditMode = !!tile;

//   useEffect(() => {
//     if (isEditMode) {
//       setFormData({
//         name: tile.name || '',
//         number: tile.number || '',
//         surface: tile.surface || 'Glossy',
//         size: tile.size || '',
//         imageUrl: tile.imageUrl || '',
//         publicId: tile.publicId || '',
//         conversionFactor: tile.conversionFactor ?? 1,
//         restockThreshold: tile.restockThreshold ?? 0,
//         availableStock: tile.stockDetails?.availableStock ?? 0,
//         bookedStock: tile.stockDetails?.bookedStock ?? 0,
//         restockingStock: tile.stockDetails?.restockingStock ?? 0,
//       });
//       if (tile.imageUrl) {
//         setImagePreview(tile.imageUrl);
//       }
//     }
//   }, [tile, isEditMode]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       let finalImageUrl = formData.imageUrl;
//       let finalPublicId = formData.publicId;

//       if (imageFile) {
//         const uploadFormData = new FormData();
//         uploadFormData.append('image', imageFile);
//         const uploadResponse = await uploadTileImage(uploadFormData);
//         finalImageUrl = uploadResponse.data.imageUrl;
//         finalPublicId = uploadResponse.data.publicId;
//       }

//       const submissionData = {
//         name: formData.name,
//         number: formData.number,
//         surface: formData.surface,
//         size: formData.size,
//         imageUrl: finalImageUrl,
//         publicId: finalPublicId,
//         conversionFactor: Number(formData.conversionFactor),
//         restockThreshold: Number(formData.restockThreshold),
//         stockDetails: {
//           availableStock: Number(formData.availableStock),
//           bookedStock: Number(formData.bookedStock),
//           restockingStock: Number(formData.restockingStock),
//         },
//       };

//       if (isEditMode) {
//         await updateTile(tile._id, submissionData);
//       } else {
//         await createTile(submissionData);
//       }
      
//       onSave();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || `Failed to ${isEditMode ? 'save' : 'create'} tile.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//       <div className="bg-foreground dark:bg-dark-foreground rounded-lg shadow-xl p-8 w-full max-w-4xl relative">
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><X /></button>
//         <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Tile' : 'Add New Tile'}</h1>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <form onSubmit={handleSubmit} className="space-y-6">
          
//           <div>
//             <Label>Tile Image</Label>
//             <div className="mt-2 flex items-center space-x-6">
//               <div className="flex-shrink-0 w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center">
//                 {imagePreview ? <img src={imagePreview} alt="Tile Preview" className="w-full h-full object-cover rounded-md" /> : <UploadCloud size={32} className="text-gray-400" />}
//               </div>
//               <label htmlFor="file-upload" className="cursor-pointer bg-primary text-white px-3 py-2 text-sm rounded-md hover:bg-primary-hover">
//                 <span>Upload a file</span>
//                 <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
//               </label>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <div><Label htmlFor="name">Name</Label><Input id="name" name="name" required value={formData.name} onChange={handleChange} /></div>
//             <div><Label htmlFor="number">Number</Label><Input id="number" name="number" value={formData.number} onChange={handleChange} /></div>
//             <div><Label htmlFor="size">Size</Label><Input id="size" name="size" required value={formData.size} onChange={handleChange} /></div>
//             <div>
//               <Label htmlFor="surface">Surface</Label>
//               <Select id="surface" name="surface" required value={formData.surface} onChange={handleChange}>
//                 <option value="Glossy">Glossy</option>
//                 <option value="Matt">Matt</option>
//               </Select>
//             </div>
//             <div><Label htmlFor="conversionFactor">Conversion Factor</Label><Input id="conversionFactor" type="number" name="conversionFactor" required value={formData.conversionFactor} onChange={handleChange} /></div>
//             <div><Label htmlFor="restockThreshold">Restock Threshold</Label><Input id="restockThreshold" type="number" name="restockThreshold" required value={formData.restockThreshold} onChange={handleChange} /></div>
            
//             <div><Label htmlFor="availableStock">Available Stock</Label><Input id="availableStock" type="number" name="availableStock" required value={formData.availableStock} onChange={handleChange} /></div>
//             <div><Label htmlFor="bookedStock">Booked Stock</Label><Input id="bookedStock" type="number" name="bookedStock" required value={formData.bookedStock} onChange={handleChange} /></div>
//             <div><Label htmlFor="restockingStock">Restocking Stock</Label><Input id="restockingStock" type="number" name="restockingStock" required value={formData.restockingStock} onChange={handleChange} /></div>
//           </div>
          
//           <div>
//             <button type="submit" disabled={loading} className="w-full mt-4 px-4 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover disabled:opacity-50">
//               {loading ? 'Saving...' : 'Save Tile'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TileFormModal;
import React, { useState, useEffect } from 'react';
import { createTile, updateTile, uploadTileImage } from '../../api/tileApi';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Label from '../ui/Label';
import { X, UploadCloud } from 'lucide-react';

const TileFormModal = ({ tile, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '', number: '', surface: 'Glossy', size: '', imageUrl: '', publicId: '',
    conversionFactor: 1, restockThreshold: 0,
    availableStock: 0, bookedStock: 0, restockingStock: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditMode = !!tile;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: tile.name || '',
        number: tile.number || '',
        surface: tile.surface || 'Glossy',
        size: tile.size || '',
        imageUrl: tile.imageUrl || '',
        publicId: tile.publicId || '',
        conversionFactor: tile.conversionFactor ?? 1,
        restockThreshold: tile.restockThreshold ?? 0,
        availableStock: tile.stockDetails?.availableStock ?? 0,
        bookedStock: tile.stockDetails?.bookedStock ?? 0,
        restockingStock: tile.stockDetails?.restockingStock ?? 0,
      });
      if (tile.imageUrl) setImagePreview(tile.imageUrl);
    }
  }, [tile, isEditMode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalImageUrl = formData.imageUrl;
      let finalPublicId = formData.publicId;

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        const uploadResponse = await uploadTileImage(uploadFormData);
        finalImageUrl = uploadResponse.data.imageUrl;
        finalPublicId = uploadResponse.data.publicId;
      }

      const submissionData = {
        name: formData.name, number: formData.number, surface: formData.surface, size: formData.size,
        imageUrl: finalImageUrl, publicId: finalPublicId,
        conversionFactor: Number(formData.conversionFactor), restockThreshold: Number(formData.restockThreshold),
        stockDetails: {
          availableStock: Number(formData.availableStock),
          bookedStock: Number(formData.bookedStock),
          restockingStock: Number(formData.restockingStock),
        },
      };

      if (isEditMode) {
        await updateTile(tile._id, submissionData);
      } else {
        await createTile(submissionData);
      }
      
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'save' : 'create'} tile.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-foreground dark:bg-dark-foreground rounded-lg shadow-xl p-8 w-full max-w-4xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><X /></button>
        <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Tile' : 'Add New Tile'}</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Tile Image</Label>
            <div className="mt-2 flex items-center space-x-6">
              <div className="flex-shrink-0 w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center">
                {imagePreview ? <img src={imagePreview} alt="Tile Preview" className="w-full h-full object-cover rounded-md" /> : <UploadCloud size={32} className="text-gray-400" />}
              </div>
              <label htmlFor="file-upload" className="cursor-pointer bg-primary text-white px-3 py-2 text-sm rounded-md hover:bg-primary-hover">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><Label htmlFor="name">Name</Label><Input id="name" name="name" required value={formData.name} onChange={handleChange} /></div>
            <div><Label htmlFor="number">Number</Label><Input id="number" name="number" value={formData.number} onChange={handleChange} /></div>
            <div><Label htmlFor="size">Size</Label><Input id="size" name="size" required value={formData.size} onChange={handleChange} /></div>
            <div>
              <Label htmlFor="surface">Surface</Label>
              <Select id="surface" name="surface" required value={formData.surface} onChange={handleChange}>
                <option value="Glossy">Glossy</option>
                <option value="Matt">Matt</option>
              </Select>
            </div>
            <div><Label htmlFor="conversionFactor">Conversion Factor</Label><Input id="conversionFactor" type="number" name="conversionFactor" required value={formData.conversionFactor} onChange={handleChange} /></div>
            <div><Label htmlFor="restockThreshold">Restock Threshold</Label><Input id="restockThreshold" type="number" name="restockThreshold" required value={formData.restockThreshold} onChange={handleChange} /></div>
            <div><Label htmlFor="availableStock">Available Stock</Label><Input id="availableStock" type="number" name="availableStock" required value={formData.availableStock} onChange={handleChange} /></div>
            <div><Label htmlFor="bookedStock">Booked Stock</Label><Input id="bookedStock" type="number" name="bookedStock" required value={formData.bookedStock} onChange={handleChange} /></div>
            <div><Label htmlFor="restockingStock">Restocking Stock</Label><Input id="restockingStock" type="number" name="restockingStock" required value={formData.restockingStock} onChange={handleChange} /></div>
          </div>
          <div>
            <button type="submit" disabled={loading} className="w-full mt-4 px-4 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Tile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TileFormModal;
