import React, { useState, useEffect } from 'react';
import { getAllTiles, deleteTile, getTileById } from '../api/tileApi';
import TileFormModal from '../components/tiles/TileFormModal';
import { PlusCircle, Edit, Trash2, Layers } from 'lucide-react';

const TileListPage = () => {
    const [tiles, setTiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTile, setEditingTile] = useState(null);

    const fetchTiles = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAllTiles();
            setTiles(response.data);
        } catch (err) {
            console.error("Error fetching tiles:", err.response || err);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch tiles.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTiles();
    }, []);

    const handleAdd = () => {
        setEditingTile(null);
        setIsModalOpen(true);
    };

    const handleEdit = async (id) => {
        try {
            const response = await getTileById(id);
            setEditingTile(response.data);
            setIsModalOpen(true);
        } catch (err) {
            setError('Failed to fetch tile details.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to archive this tile?')) {
            try {
                await deleteTile(id);
                fetchTiles();
            } catch (err) {
                setError('Failed to archive tile.');
            }
        }
    };

    if (loading && tiles.length === 0) return <div className="text-center p-8">Loading tiles...</div>;
    
    if (error) {
        return (
            <div className="p-6 text-center text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <h2 className="font-bold text-lg">An Error Occurred</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {isModalOpen && (
                <TileFormModal
                    tile={editingTile}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchTiles}
                />
            )}
            <div className="bg-transparent">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-text dark:text-dark-text">Tiles</h1>
                    <button onClick={handleAdd} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover shadow-sm">
                        <PlusCircle size={20} className="mr-2" />
                        Add Tile
                    </button>
                </div>

                <div className="space-y-5">
                    {tiles.map((tile) => (
                        <div key={tile._id} className="flex flex-col md:flex-row bg-foreground dark:bg-dark-foreground border border-border dark:border-dark-border rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg">
                            <div className="w-full md:w-48 flex-shrink-0">
                                <div className="relative w-full h-48 md:h-full">
                                    {tile.imageUrl ? (
                                        <img src={tile.imageUrl} alt={tile.name} className="absolute inset-0 w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-background">
                                            <Layers size={48} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-grow p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-xl text-text dark:text-dark-text">{tile.name}</h3>
                                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                                                {tile.size} • {tile.surface}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEdit(tile._id)} className="p-2 text-gray-400 hover:text-blue-500"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(tile._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                                        <div className="bg-gray-100 dark:bg-dark-background p-3 rounded-lg">
                                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Available</p>
                                            <p className="font-bold text-lg">
                                                {tile.stockDetails.availableStock}
                                            </p>
                                        </div>
                                        <div className="bg-gray-100 dark:bg-dark-background p-3 rounded-lg">
                                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Booked</p>
                                            <p className="font-bold text-lg">{tile.stockDetails.bookedStock}</p>
                                        </div>
                                        <div className="bg-gray-100 dark:bg-dark-background p-3 rounded-lg">
                                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Restocking</p>
                                            <p className="font-bold text-lg">{tile.stockDetails.restockingStock}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs text-text-secondary dark:text-dark-text-secondary mt-4">
                                    Created by: {tile.createdBy?.username || 'N/A'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TileListPage;
