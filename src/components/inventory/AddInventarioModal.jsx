import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import { fetchProducts, addInventory } from '../../services/inventoryService';
import { API_BASE_URL } from "@/lib/constants";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

const AddInventarioModal = ({ isOpen, onRequestClose, selectedProduct, onProductChange }) => {
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState('');

    useEffect(() => {
        fetchProducts().then(data => {
            setProducts(data);
        });

        fetch(`${API_BASE_URL}/api/units`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setUnits(data.data);
            });
    }, []);

    useEffect(() => {
        if (selectedProduct && units.length > 0) {
            const unit = units.find(u => u.id === selectedProduct.unit_id);
            setSelectedUnit(unit ? unit.name : '');
        } else {
            setSelectedUnit('');
        }
    }, [selectedProduct, units]);

    const handleAddInventory = () => {
        addInventory(selectedProduct.id, quantity)
            .then(response => {
                if (response.success) {
                    // Handle successful addition of inventory
                }
            });
    };

    const handleProductChange = (selectedOption) => {
        onProductChange(selectedOption);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="Add Inventory Modal"
        >
            <h2>Agregar Inventario</h2>
            <div className="form-group">
                <label>Producto</label>
                <Select
                    options={products}
                    onChange={handleProductChange}
                    getOptionLabel={e => e.name}
                    getOptionValue={e => e.id}
                    value={selectedProduct}
                />
            </div>
            <div className="form-group">
                <label>Cantidad</label>
                <input
                    type="number"
                    className="form-control"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Unidad</label>
                <input
                    type="text"
                    className="form-control"
                    value={selectedUnit}
                    readOnly
                />
            </div>
            <button onClick={handleAddInventory} className="btn btn-primary">Agregar</button>
        </Modal>
    );
};

export default AddInventarioModal;