import React, { useState, useEffect } from 'react';
import { createBooking, updateBooking } from '../../api/bookingApi';
import { searchTilesForBooking } from '../../api/tileApi';
import { getAllCompanies } from '../../api/companyApi';
import { getAllSalesmen } from '../../api/userApi';
import useDebounce from '../../hooks/useDebounce';
import { X, Trash2, Search, AlertTriangle, Box, Minimize2 } from 'lucide-react';

const BookingFormModal = ({ booking, onClose, onSave }) => {
    const isEditMode = !!booking;

    // Form State
    const [company, setParty] = useState(booking?.company?._id || '');
    const [salesman, setSalesman] = useState(booking?.salesman?._id || '');
    const [lpoNumber, setLpoNumber] = useState(booking?.lpoNumber || '');
    const [notes, setNotes] = useState(booking?.notes || '');
    const [tilesList, setTilesList] = useState([]);

    // Data-fetching state
    const [companies, setCompanies] = useState([]);
    const [salesmen, setSalesmen] = useState([]);
    const [availableTiles, setAvailableTiles] = useState([]);
    
    // Tile search state
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch initial dropdown data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [companiesRes, salesmenRes] = await Promise.all([getAllCompanies(), getAllSalesmen()]);
                setCompanies(companiesRes.data);
                setSalesmen(salesmenRes.data);
            } catch (err) { setError('Failed to load required data.'); }
        };
        fetchData();
    }, []);

    // Pre-fill form for Edit Mode
    useEffect(() => {
        if (isEditMode && booking.tilesList) {
            const initialTiles = booking.tilesList.map(item => {
                const currentStock = item.tile.stockDetails?.availableStock ?? 0;
                const bookedStock = item.tile.stockDetails?.bookedStock ?? 0;
                // For an existing booking, its own quantity shouldn't count against its availability
                const availableStock = currentStock - bookedStock + item.quantity;
                console.log(currentStock,bookedStock)
                
                return {
                    tile: item.tile,
                    quantityInBoxes: item.quantity,
                    quantityInSqM: (item.quantity * (item.tile.conversionFactor || 1)).toFixed(2),
                    available: availableStock
                };
            });
            setTilesList(initialTiles);
        }
    }, [isEditMode, booking]);


    // Auto-select salesman when company changes
    useEffect(() => {
        if (company && companies.length > 0) {
            const selectedParty = companies.find(p => p._id === company);
            // The salesman object might be populated differently, so check both possibilities
            const salesmanId = selectedParty?.salesman?._id || selectedParty?.salesman;
            if (salesmanId) {
                setSalesman(salesmanId);
            }
        }
    }, [company, companies]);

    // Fetch tiles for search dropdown
    useEffect(() => {
        const fetchTiles = async () => {
            if (debouncedSearchTerm.length < 2) {
                setAvailableTiles([]);
                return;
            }
            try {
                const { data } = await searchTilesForBooking(debouncedSearchTerm);
                setAvailableTiles(data);
            } catch (err) { console.error("Failed to search tiles", err); }
        };
        fetchTiles();
    }, [debouncedSearchTerm]);

    const handleAddTile = (tile) => {
        if (tilesList.find(item => item.tile._id === tile._id)) return;
        
        const currentStock = tile.stockDetails?.availableStock ?? 0;
        const bookedStock = tile.stockDetails?.bookedStock ?? 0;
        const newAvailableStock = currentStock - bookedStock;
        
        setTilesList(prev => [...prev, { 
            tile: tile, 
            quantityInBoxes: 1, 
            quantityInSqM: (1 * (tile.conversionFactor || 1)).toFixed(2),
            available: newAvailableStock 
        }]);
        setSearchTerm('');
        setAvailableTiles([]);
    };

    const handleQuantityChange = (tileId, value, unit) => {
        setTilesList(prevList => prevList.map(item => {
            if (item.tile._id === tileId) {
                const val = parseFloat(value) || 0;
                const factor = item.tile.conversionFactor || 1;
                if (unit === 'boxes') {
                    return { ...item, quantityInBoxes: val, quantityInSqM: (val * factor).toFixed(2) };
                } else {
                    return { ...item, quantityInSqM: val, quantityInBoxes: Math.ceil(val / factor) };
                }
            }
            return item;
        }));
    };

    const handleRemoveTile = (tileId) => setTilesList(prev => prev.filter(item => item.tile._id !== tileId));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const bookingData = {
            company, salesman, lpoNumber, notes,
            tilesList: tilesList.map(item => ({
                tile: item.tile._id,
                quantity: item.quantityInBoxes,
            })),
        };

        try {
            if (isEditMode) {
                await updateBooking(booking._id, bookingData);
            } else {
                await createBooking(bookingData);
            }
            onSave();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // console.log(tilesList)

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-foreground rounded-lg shadow-xl p-6 md:p-8 w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-dark-border">
                    <h1 className="text-2xl md:text-3xl font-bold">{isEditMode ? 'Edit Booking' : 'Create New Booking'}</h1>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-border"><X size={24}/></button>
                </div>
                
                {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md mb-4 text-sm">{error}</p>}

                <form onSubmit={handleSubmit} id="booking-form" className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-8">
                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div><label className="font-medium text-sm text-gray-700 dark:text-gray-300">Party *</label><select required value={company} onChange={e => setParty(e.target.value)} className="w-full mt-1 p-2 border rounded-md dark:bg-dark-background dark:border-dark-border"><option value="" disabled>Select a company</option>{companies.map(p => <option key={p._id} value={p._id}>{p.companyName}</option>)}</select></div>
                        <div><label className="font-medium text-sm text-gray-700 dark:text-gray-300">Salesman *</label><select required value={salesman} onChange={e => setSalesman(e.target.value)} className="w-full mt-1 p-2 border rounded-md dark:bg-dark-background dark:border-dark-border disabled:bg-gray-100 dark:disabled:bg-dark-border/50"><option value="" disabled>Select a salesman</option>{salesmen.map(s => <option key={s._id} value={s._id}>{s.username}</option>)}</select></div>
                        <div><label className="font-medium text-sm text-gray-700 dark:text-gray-300">LPO Number</label><input type="text" value={lpoNumber} onChange={e => setLpoNumber(e.target.value)} className="w-full mt-1 p-2 border rounded-md dark:bg-dark-background dark:border-dark-border" /></div>
                        <div><label className="font-medium text-sm text-gray-700 dark:text-gray-300">Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows="1" className="w-full mt-1 p-2 border rounded-md dark:bg-dark-background dark:border-dark-border" /></div>
                    </div>

                    {/* Tile Selection */}
                    <div className="space-y-2">
                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Search and Add Tiles *</label>
                        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search by tile name or number..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 p-2 border rounded-md dark:bg-dark-background dark:border-dark-border" />
                            {availableTiles.length > 0 && (
                                <ul className="absolute w-full bg-white dark:bg-dark-background border dark:border-dark-border rounded-md mt-1 z-10 max-h-60 overflow-y-auto shadow-lg">
                                    {availableTiles.map(tile => {
                                        const currentStock = tile.stockDetails?.availableStock ?? 0;
                                        const bookedStock = tile.stockDetails?.bookedStock ?? 0;
                                        const availableStock = currentStock - bookedStock;
                                        const conversionFactor = tile.conversionFactor || 1;
                                        return (
                                            <li key={tile._id} onClick={() => handleAddTile(tile)} className="p-3 hover:bg-gray-100 dark:hover:bg-dark-border cursor-pointer flex justify-between items-center text-sm">
                                                <div><p className="font-semibold">{tile.name} <span className="text-gray-500">({tile.size})</span></p></div>
                                                <div className="text-right text-gray-500 dark:text-gray-400"><p>{availableStock} boxes</p><p className="text-xs">≈ {(availableStock * conversionFactor).toFixed(2)} m²</p></div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Selected Tiles List */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2 dark:border-dark-border">Selected Tiles</h3>
                        {tilesList.length === 0 ? <p className="text-gray-500 text-center py-4">No tiles added yet.</p> : (
                            tilesList.map(item => {
                                const isOverbooked = item.quantityInBoxes > item.available;
                                return (
                                <div key={item.tile._id} className={`p-4 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-colors ${isOverbooked ? 'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700' : 'bg-gray-50 dark:bg-dark-background'}`}>
                                    <div className="md:col-span-4">
                                        <p className="font-bold">{item.tile.name}</p>
                                        <p className="text-sm text-gray-500">{item.tile.size}</p>
                                        <p className={`text-xs font-mono ${isOverbooked ? 'text-red-500' : 'text-gray-500'}`}>Available: {item.available} boxes</p>
                                    </div>
                                    <div className="md:col-span-3 flex items-center gap-2">
                                        <Box size={16} className="text-gray-500"/>
                                        <input type="number" min="1" value={item.quantityInBoxes} onChange={e => handleQuantityChange(item.tile._id, e.target.value, 'boxes')} className="w-full p-2 border rounded-md dark:bg-dark-background dark:border-dark-border" />
                                        <label className="text-sm">Boxes</label>
                                    </div>
                                    <div className="md:col-span-3 flex items-center gap-2">
                                        <Minimize2 size={16} className="text-gray-500"/>
                                        <input type="number" step="0.01" min="0" value={item.quantityInSqM} onChange={e => handleQuantityChange(item.tile._id, e.target.value, 'sqm')} className="w-full p-2 border rounded-md dark:bg-dark-background dark:border-dark-border" />
                                        <label className="text-sm">m²</label>
                                    </div>
                                    <div className="md:col-span-2 flex items-center justify-end gap-2">
                                        {isOverbooked && <AlertTriangle size={20} className="text-red-500" title="Requested quantity exceeds available stock"/>}
                                        <button type="button" onClick={() => handleRemoveTile(item.tile._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"><Trash2 size={18}/></button>
                                    </div>
                                </div>
                            )})
                        )}
                    </div>
                </form>

                <div className="mt-6 pt-6 border-t dark:border-dark-border">
                    <button type="submit" form="booking-form" disabled={loading || tilesList.length === 0 || !company || !salesman} className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Booking')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingFormModal;
