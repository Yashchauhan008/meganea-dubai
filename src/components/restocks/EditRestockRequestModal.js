import React, { useState, useEffect } from 'react';
import { editRestockRequest } from '../../api/restockApi';
import { getAllTiles } from '../../api/tileApi';
import { X, Trash2, Search, AlertTriangle } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';

const EditRestockRequestModal = ({ request, onClose, onSave }) => {
    // Form State
    const [notes, setNotes] = useState(request.notes || '');
    const [requestedItems, setRequestedItems] = useState([]);
    const [allTiles, setAllTiles] = useState([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Populate form with existing data
    useEffect(() => {
        const initialItems = request.requestedItems.map(item => ({
            tile: item.tile,
            quantityRequested: item.quantityRequested,
        }));
        setRequestedItems(initialItems);

        const fetchAllTiles = async () => {
            setLoading(true);
            try {
                const { data } = await getAllTiles({ limit: 2000 });
                setAllTiles(data.tiles);
            } catch (err) {
                setError('Failed to load tile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllTiles();
    }, [request]);

    const handleToggleTileInRequest = (tile) => {
        const isAlreadyIn = requestedItems.some(item => item.tile._id === tile._id);
        if (isAlreadyIn) {
            setRequestedItems(prev => prev.filter(item => item.tile._id !== tile._id));
        } else {
            setRequestedItems(prev => [...prev, { tile, quantityRequested: 100 }]);
        }
    };

    const handleQuantityChange = (tileId, value) => {
        const quantity = parseInt(value, 10);
        setRequestedItems(prevList => prevList.map(item =>
            item.tile._id === tileId ? { ...item, quantityRequested: isNaN(quantity) ? 0 : quantity } : item
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const submissionData = {
                notes,
                requestedItems: requestedItems.map(item => ({
                    tile: item.tile._id,
                    quantity: item.quantityRequested,
                })),
            };
            await editRestockRequest(request._id, submissionData);
            onSave();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const filteredTiles = allTiles.filter(tile => {
        const stock = tile.stockDetails;
        const matchesSearch = debouncedSearchTerm ? tile.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) : true;
        
        if (!matchesSearch) return false;

        if (filter === 'Under Threshold') return stock.availableStock <= tile.restockThreshold;
        if (filter === 'Over-Booked') return stock.bookedStock > stock.availableStock;
        return true;
    });

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-foreground rounded-lg shadow-xl p-6 md:p-8 w-full max-w-6xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b pb-4 dark:border-dark-border">
                    <h1 className="text-2xl md:text-3xl font-bold">Edit Restock Request</h1>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-border"><X size={24}/></button>
                </div>
                
                {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md mb-4 text-sm">{error}</p>}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow min-h-0">
                    {/* Left Side: Tile Selection */}
                    <div className="flex flex-col space-y-4 min-h-0">
                        <h2 className="font-bold text-xl">Select Tiles to Restock</h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" placeholder="Search tiles..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 p-2 border rounded-md dark:bg-dark-background dark:border-dark-border"/>
                            </div>
                            <select value={filter} onChange={e => setFilter(e.target.value)} className="p-2 border rounded-md dark:bg-dark-background dark:border-dark-border">
                                <option value="All">Show All</option>
                                <option value="Under Threshold">Under Threshold</option>
                                <option value="Over-Booked">Over-Booked</option>
                            </select>
                        </div>
                        <div className="flex-grow overflow-y-auto border dark:border-dark-border rounded-lg p-2 space-y-2">
                            {loading ? <p>Loading tiles...</p> : filteredTiles.map(tile => {
                                const isSelected = requestedItems.some(item => item.tile._id === tile._id);
                                const isOverBooked = tile.stockDetails.bookedStock > tile.stockDetails.availableStock;
                                return (
                                    <div key={tile._id} onClick={() => handleToggleTileInRequest(tile)} className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${isSelected ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500' : 'bg-gray-50 dark:bg-dark-background hover:bg-gray-100 dark:hover:bg-dark-border'}`}>
                                        <div>
                                            <p className="font-semibold">{tile.name} {isOverBooked && <AlertTriangle className="inline text-red-500 ml-2" size={16}/>}</p>
                                            <p className="text-xs text-gray-500">{tile.size}</p>
                                        </div>
                                        <div className="text-right text-xs font-mono">
                                            <p>Avl: {tile.stockDetails.availableStock}</p>
                                            <p>Bkd: {tile.stockDetails.bookedStock}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Side: Request Details */}
                    <form onSubmit={handleSubmit} id="edit-restock-form" className="flex flex-col space-y-4 min-h-0">
                        <h2 className="font-bold text-xl">Request Details</h2>
                        <div className="flex-grow overflow-y-auto border dark:border-dark-border rounded-lg p-4 space-y-3">
                            {requestedItems.length === 0 ? <p className="text-gray-500 text-center py-10">Select tiles from the left to add them to the request.</p> : requestedItems.map(item => (
                                <div key={item.tile._id} className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.tile.name}</p>
                                        <p className="text-xs text-gray-500">{item.tile.size}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="number" min="1" value={item.quantityRequested} onChange={e => handleQuantityChange(item.tile._id, e.target.value)} className="w-24 p-2 border rounded-md dark:bg-dark-background dark:border-dark-border" />
                                        <span className="text-sm">Boxes</span>
                                    </div>
                                    <button type="button" onClick={() => handleToggleTileInRequest(item.tile)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="font-medium text-sm">Notes for India Team</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="3" className="w-full mt-1 p-2 border rounded-md dark:bg-dark-background dark:border-dark-border" />
                        </div>
                    </form>
                </div>

                <div className="mt-6 pt-4 border-t dark:border-dark-border">
                    <button type="submit" form="edit-restock-form" disabled={loading || requestedItems.length === 0} className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary-hover disabled:opacity-50">
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditRestockRequestModal;
