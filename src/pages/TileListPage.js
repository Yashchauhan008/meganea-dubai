// import React, { useState, useEffect, useCallback } from 'react';
// import { getAllTiles, deleteTile, getTileById } from '../api/tileApi';
// import TileFormModal from '../components/tiles/TileFormModal';
// import { PlusCircle, Edit, Trash2, Layers, Search, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
// import useDebounce from '../hooks/useDebounce';
// import { LazyLoadImage } from 'react-lazy-load-image-component';
// import 'react-lazy-load-image-component/src/effects/blur.css';

// const PAGE_LIMIT = 50;

// // --- NEW: Image Lightbox Component ---
// const ImageLightbox = ({ src, alt, onClose }) => (
//     <div 
//         className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]"
//         onClick={onClose}
//     >
//         <img 
//             src={src} 
//             alt={alt} 
//             className="max-w-[90vw] max-h-[90vh] object-contain"
//             onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
//         />
//     </div>
// );

// const TileListPage = () => {
//     const [tiles, setTiles] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingTile, setEditingTile] = useState(null);
    
//     // --- NEW: State for the image lightbox ---
//     const [expandedImage, setExpandedImage] = useState(null);

//     const [searchTerm, setSearchTerm] = useState('');
//     const [sizeFilter, setSizeFilter] = useState('');
//     const [showUnderThresholdOnly, setShowUnderThresholdOnly] = useState(false);
//     const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
//     const debouncedSearchTerm = useDebounce(searchTerm, 500);
//     const [allUniqueSizes, setAllUniqueSizes] = useState([]);

//     const fetchTiles = useCallback(async () => {
//         try {
//             setLoading(true);
//             setError('');
//             const params = {
//                 page: pagination.page,
//                 search: debouncedSearchTerm,
//                 size: sizeFilter,
//                 limit: PAGE_LIMIT,
//                 underThreshold: showUnderThresholdOnly,
//             };
//             const { data } = await getAllTiles(params);
//             setTiles(data.tiles);
//             setPagination({ page: data.page, pages: data.pages, total: data.total });
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to fetch tiles.');
//         } finally {
//             setLoading(false);
//         }
//     }, [pagination.page, debouncedSearchTerm, sizeFilter, showUnderThresholdOnly]);

//     useEffect(() => {
//         const fetchAllSizes = async () => {
//             try {
//                 const { data } = await getAllTiles({ limit: 1000 });
//                 const sizes = [...new Set(data.tiles.map(tile => tile.size))].sort();
//                 setAllUniqueSizes(sizes);
//             } catch (err) {
//                 console.error("Could not fetch tile sizes for filter.");
//             }
//         };
//         fetchAllSizes();
//     }, []);

//     useEffect(() => {
//         fetchTiles();
//     }, [fetchTiles]);

//     const handleAdd = () => {
//         setEditingTile(null);
//         setIsModalOpen(true);
//     };

//     const handleEdit = async (id) => {
//         const { data } = await getTileById(id);
//         setEditingTile(data);
//         setIsModalOpen(true);
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to archive this tile?')) {
//             await deleteTile(id).catch(() => setError('Failed to archive tile.'));
//             fetchTiles();
//         }
//     };
    
//     const handlePageChange = (newPage) => {
//         setPagination(prev => ({ ...prev, page: newPage }));
//     };

//     return (
//         <div className="p-4 sm:p-6 md:p-8">
//             {isModalOpen && <TileFormModal tile={editingTile} onClose={() => setIsModalOpen(false)} onSave={fetchTiles} />}
            
//             {/* --- NEW: Render lightbox when an image is expanded --- */}
//             {expandedImage && <ImageLightbox src={expandedImage.src} alt={expandedImage.alt} onClose={() => setExpandedImage(null)} />}

//             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//                 <h1 className="text-3xl font-bold text-text dark:text-dark-text">Tiles</h1>
//                 <button onClick={handleAdd} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover shadow-sm w-full sm:w-auto">
//                     <PlusCircle size={20} className="mr-2" /> Add Tile
//                 </button>
//             </div>

//             <div className="flex flex-wrap items-center gap-4 mb-6">
//                 <div className="relative flex-grow min-w-[250px]">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                     <input type="text" placeholder="Search by name or number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border dark:border-dark-border rounded-md bg-foreground dark:bg-dark-foreground focus:ring-2 focus:ring-primary" />
//                 </div>
//                 <select value={sizeFilter} onChange={(e) => { setSizeFilter(e.target.value); setPagination(p => ({...p, page: 1})); }} className="w-full sm:w-auto px-4 py-2 border border-border dark:border-dark-border rounded-md bg-foreground dark:bg-dark-foreground focus:ring-2 focus:ring-primary">
//                     <option value="">All Sizes</option>
//                     {allUniqueSizes.map(size => <option key={size} value={size}>{size}</option>)}
//                 </select>
//                 <label htmlFor="threshold-toggle" className="flex items-center cursor-pointer">
//                     <div className="relative">
//                         <input type="checkbox" id="threshold-toggle" className="sr-only peer" checked={showUnderThresholdOnly} onChange={() => setShowUnderThresholdOnly(!showUnderThresholdOnly)} />
//                         <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full peer-checked:bg-primary dark:peer-checked:bg-dark-primary transition-colors"></div>
//                         <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform peer-checked:translate-x-6"></div>
//                     </div>
//                     <div className="ml-3 text-text dark:text-dark-text font-medium text-sm">Under Threshold</div>
//                 </label>
//             </div>

//             {loading && <div className="text-center p-8">Loading...</div>}
//             {!loading && error && <div className="p-6 text-center text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg"><h2 className="font-bold text-lg">An Error Occurred</h2><p>{error}</p></div>}
            
//             {!loading && !error && (
//                 <>
//                     <div className="space-y-5">
//                         {tiles.map((tile) => {
//                             const needsRestock = tile.stockDetails.availableStock <= tile.restockThreshold;
//                             return (
//                                 <div key={tile._id} className="flex flex-col md:flex-row bg-foreground dark:bg-dark-foreground border border-border dark:border-dark-border rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg">
//                                     {/* --- UPDATED: Image is now clickable --- */}
//                                     <div 
//                                         className="w-full md:w-56 flex-shrink-0 h-56 cursor-pointer"
//                                         onClick={() => setExpandedImage({ src: tile.imageUrl, alt: tile.name })}
//                                     >
//                                         <LazyLoadImage alt={tile.name} src={tile.imageUrl} effect="blur" className="w-full h-full object-cover" wrapperClassName="w-full h-full" placeholder={<div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-background"><Layers size={48} className="text-gray-400" /></div>} />
//                                     </div>
//                                     <div className="flex-grow p-5 flex flex-col justify-between">
//                                         <div>
//                                             <div className="flex justify-between items-start mb-4">
//                                                 <div>
//                                                     <h3 className="font-bold text-xl text-text dark:text-dark-text">{tile.name}{tile.number && <span className="ml-2 font-light text-text-secondary dark:text-dark-text-secondary">({tile.number})</span>}</h3>
//                                                     <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{tile.size} • {tile.surface}</p>
//                                                 </div>
//                                                 <div className="flex space-x-2">
//                                                     <button onClick={() => handleEdit(tile._id)} className="p-2 text-gray-400 hover:text-blue-500"><Edit size={18} /></button>
//                                                     <button onClick={() => handleDelete(tile._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
//                                                 </div>
//                                             </div>
//                                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
//                                                 {/* --- UPDATED: Conditional border and alert icon --- */}
//                                                 <div className={`bg-gray-100 dark:bg-dark-background p-3 rounded-lg border-l-4 ${needsRestock ? 'border-red-500' : 'border-transparent'}`}>
//                                                     <div className="flex justify-between items-center text-xs text-text-secondary dark:text-dark-text-secondary">
//                                                         <span>Available</span>
//                                                         {needsRestock && (
//                                                             <div className="relative group">
//                                                                 <AlertTriangle size={14} className="text-red-500" />
//                                                                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
//                                                                     Threshold: {tile.restockThreshold}
//                                                                 </div>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                     <p className={`font-bold text-lg ${needsRestock ? 'text-red-500' : ''}`}>{tile.stockDetails.availableStock} <span className="text-xs font-normal">Box</span></p>
//                                                     <p className="text-xs text-text-secondary dark:text-dark-text-secondary">≈ {(tile.stockDetails.availableStock * tile.conversionFactor).toFixed(2)} m²</p>
//                                                 </div>
//                                                 <div className="bg-gray-100 dark:bg-dark-background p-3 rounded-lg"><p className="text-xs text-text-secondary dark:text-dark-text-secondary">Booked</p><p className="font-bold text-lg">{tile.stockDetails.bookedStock} <span className="text-xs font-normal">Box</span></p><p className="text-xs text-text-secondary dark:text-dark-text-secondary">≈ {(tile.stockDetails.bookedStock * tile.conversionFactor).toFixed(2)} m²</p></div>
//                                                 <div className="bg-gray-100 dark:bg-dark-background p-3 rounded-lg"><p className="text-xs text-text-secondary dark:text-dark-text-secondary">Restocking</p><p className="font-bold text-lg">{tile.stockDetails.restockingStock} <span className="text-xs font-normal">Box</span></p><p className="text-xs text-text-secondary dark:text-dark-text-secondary">≈ {(tile.stockDetails.restockingStock * tile.conversionFactor).toFixed(2)} m²</p></div>
//                                             </div>
//                                         </div>
//                                         <div className="text-xs text-text-secondary dark:text-dark-text-secondary mt-4">Created by: {tile.createdBy?.username || 'N/A'}</div>
//                                     </div>
//                                 </div>
//                             )
//                         })}
//                     </div>
                    
//                     <div className="flex justify-between items-center mt-8">
//                         <span className="text-sm text-text-secondary dark:text-dark-text-secondary">Page {pagination.page} of {pagination.pages || 1} (Total: {pagination.total} tiles)</span>
//                         <div className="flex gap-2">
//                             <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed border border-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-background"><ChevronLeft size={20} /></button>
//                             <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= pagination.pages} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed border border-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-background"><ChevronRight size={20} /></button>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default TileListPage;

import React, { useState, useEffect, useCallback } from 'react';
import { getAllTiles, deleteTile, getTileById } from '../api/tileApi';
import TileFormModal from '../components/tiles/TileFormModal';
import BulkUploadModal from '../components/tiles/BulkUploadModal';
import ImageLightbox from '../components/tiles/ImageLightbox'; // Assuming you have this from a previous step
import { PlusCircle, Edit, Trash2, Layers, Search, ChevronLeft, ChevronRight, AlertTriangle, Upload } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const PAGE_LIMIT = 50;

const TileListPage = () => {
    // Data and loading states
    const [tiles, setTiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [allUniqueSizes, setAllUniqueSizes] = useState([]);

    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);
    const [editingTile, setEditingTile] = useState(null);
    
    // Filter and search states
    const [searchTerm, setSearchTerm] = useState('');
    const [sizeFilter, setSizeFilter] = useState('');
    const [showUnderThresholdOnly, setShowUnderThresholdOnly] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Fetch main tile data based on filters and pagination
    const fetchTiles = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const params = {
                page: pagination.page,
                search: debouncedSearchTerm,
                size: sizeFilter,
                limit: PAGE_LIMIT,
                underThreshold: showUnderThresholdOnly,
            };
            const { data } = await getAllTiles(params);
            setTiles(data.tiles);
            setPagination({ page: data.page, pages: data.pages, total: data.total });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tiles.');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, debouncedSearchTerm, sizeFilter, showUnderThresholdOnly]);

    // Fetch unique sizes for the filter dropdown only once
    useEffect(() => {
        const fetchAllSizes = async () => {
            try {
                // A lightweight call to get all tiles just for their sizes
                const { data } = await getAllTiles({ limit: 1000 }); 
                const sizes = [...new Set(data.tiles.map(tile => tile.size))].sort();
                setAllUniqueSizes(sizes);
            } catch (err) {
                console.error("Could not fetch tile sizes for filter.");
            }
        };
        fetchAllSizes();
    }, []);

    // Re-fetch tiles when dependencies change
    useEffect(() => {
        fetchTiles();
    }, [fetchTiles]);

    // Handlers for opening modals
    const handleAdd = () => {
        setEditingTile(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = async (id) => {
        try {
            const { data } = await getTileById(id);
            setEditingTile(data);
            setIsFormModalOpen(true);
        } catch (err) {
            setError('Could not fetch tile details for editing.');
        }
    };

    // Handler for successful save from any modal
    const handleSave = () => {
        setIsFormModalOpen(false);
        setIsBulkUploadModalOpen(false);
        fetchTiles(); // Refresh the data
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to archive this tile?')) {
            try {
                await deleteTile(id);
                fetchTiles(); // Re-fetch to show the item has been removed
            } catch (err) {
                setError('Failed to archive tile.');
            }
        }
    };
    
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {/* Modals */}
            {isFormModalOpen && <TileFormModal tile={editingTile} onClose={() => setIsFormModalOpen(false)} onSave={handleSave} />}
            {isBulkUploadModalOpen && <BulkUploadModal onClose={() => setIsBulkUploadModalOpen(false)} onSave={handleSave} />}
            {expandedImage && <ImageLightbox src={expandedImage.src} alt={expandedImage.alt} onClose={() => setExpandedImage(null)} />}
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-text dark:text-dark-text">Tiles</h1>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsBulkUploadModalOpen(true)}
                        className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 shadow-sm"
                    >
                        <Upload size={20} className="mr-2" /> Bulk Upload
                    </button>
                    <button onClick={handleAdd} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover shadow-sm">
                        <PlusCircle size={20} className="mr-2" /> Add Tile
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-grow min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by name or number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border dark:border-dark-border rounded-md bg-foreground dark:bg-dark-foreground focus:ring-2 focus:ring-primary" />
                </div>
                <select value={sizeFilter} onChange={(e) => { setSizeFilter(e.target.value); setPagination(p => ({...p, page: 1})); }} className="w-full sm:w-auto px-4 py-2 border border-border dark:border-dark-border rounded-md bg-foreground dark:bg-dark-foreground focus:ring-2 focus:ring-primary">
                    <option value="">All Sizes</option>
                    {allUniqueSizes.map(size => <option key={size} value={size}>{size}</option>)}
                </select>
                <label htmlFor="threshold-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id="threshold-toggle" className="sr-only peer" checked={showUnderThresholdOnly} onChange={() => setShowUnderThresholdOnly(!showUnderThresholdOnly)} />
                        <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full peer-checked:bg-primary dark:peer-checked:bg-dark-primary transition-colors"></div>
                        <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform peer-checked:translate-x-6"></div>
                    </div>
                    <div className="ml-3 text-text dark:text-dark-text font-medium text-sm">Under Threshold</div>
                </label>
            </div>

            {/* Content Area */}
            {loading && <div className="text-center p-8">Loading...</div>}
            {!loading && error && <div className="p-6 text-center text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg"><h2 className="font-bold text-lg">An Error Occurred</h2><p>{error}</p></div>}
            
            {!loading && !error && (
                <>
                    <div className="space-y-5">
                        {tiles.map((tile) => {
                            const needsRestock = tile.stockDetails.availableStock <= tile.restockThreshold;
                            return (
                                <div key={tile._id} className="flex flex-col md:flex-row bg-foreground dark:bg-dark-foreground border border-border dark:border-dark-border rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg">
                                    <div 
                                        className="w-full md:w-56 flex-shrink-0 h-56 cursor-pointer"
                                        onClick={() => setExpandedImage({ src: tile.imageUrl, alt: tile.name })}
                                    >
                                        <LazyLoadImage alt={tile.name} src={tile.imageUrl} effect="blur" className="w-full h-full object-cover" wrapperClassName="w-full h-full" placeholder={<div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-background"><Layers size={48} className="text-gray-400" /></div>} />
                                    </div>
                                    <div className="flex-grow p-5 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-xl text-text dark:text-dark-text">{tile.name}{tile.number && <span className="ml-2 font-light text-text-secondary dark:text-dark-text-secondary">({tile.number})</span>}</h3>
                                                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{tile.size} • {tile.surface}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleEdit(tile._id)} className="p-2 text-gray-400 hover:text-blue-500"><Edit size={18} /></button>
                                                    <button onClick={() => handleDelete(tile._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                <div className={`bg-gray-100 dark:bg-dark-background p-3 rounded-lg border-l-4 ${needsRestock ? 'border-red-500' : 'border-transparent'}`}>
                                                    <div className="flex justify-between items-center text-xs text-text-secondary dark:text-dark-text-secondary">
                                                        <span>Available</span>
                                                        {needsRestock && (
                                                            <div className="relative group">
                                                                <AlertTriangle size={14} className="text-red-500" />
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Threshold: {tile.restockThreshold}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className={`font-bold text-lg ${needsRestock ? 'text-red-500' : ''}`}>{tile.stockDetails.availableStock} <span className="text-xs font-normal">Box</span></p>
                                                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">≈ {(tile.stockDetails.availableStock * tile.conversionFactor).toFixed(2)} m²</p>
                                                </div>
                                                <div className="bg-gray-100 dark:bg-dark-background p-3 rounded-lg"><p className="text-xs text-text-secondary dark:text-dark-text-secondary">Booked</p><p className="font-bold text-lg">{tile.stockDetails.bookedStock} <span className="text-xs font-normal">Box</span></p><p className="text-xs text-text-secondary dark:text-dark-text-secondary">≈ {(tile.stockDetails.bookedStock * tile.conversionFactor).toFixed(2)} m²</p></div>
                                                <div className="bg-gray-100 dark:bg-dark-background p-3 rounded-lg"><p className="text-xs text-text-secondary dark:text-dark-text-secondary">Restocking</p><p className="font-bold text-lg">{tile.stockDetails.restockingStock} <span className="text-xs font-normal">Box</span></p><p className="text-xs text-text-secondary dark:text-dark-text-secondary">≈ {(tile.stockDetails.restockingStock * tile.conversionFactor).toFixed(2)} m²</p></div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-text-secondary dark:text-dark-text-secondary mt-4">Created by: {tile.createdBy?.username || 'N/A'}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-8">
                        <span className="text-sm text-text-secondary dark:text-dark-text-secondary">Page {pagination.page} of {pagination.pages || 1} (Total: {pagination.total} tiles)</span>
                        <div className="flex gap-2">
                            <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed border border-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-background"><ChevronLeft size={20} /></button>
                            <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= pagination.pages} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed border border-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-background"><ChevronRight size={20} /></button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TileListPage;
