import React, { useEffect, useState } from 'react';

const AddInventoryForm = () => {
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null); // Asegúrate de tener este estado

    useEffect(() => {
        fetch('/units')
            .then(res => res.json())
            .then(data => {
                if (data.success) setUnits(data.data);
            });
    }, []);

    // Actualiza la unidad cuando cambie el producto seleccionado
    useEffect(() => {
        if (selectedProduct && units.length > 0) {
            const unit = units.find(u => u.id === selectedProduct.unit_id);
            setSelectedUnit(unit ? unit.name : '');
        } else {
            setSelectedUnit('');
        }
    }, [selectedProduct, units]);

    // Ejemplo de handler para seleccionar producto
    const handleProductChange = (event) => {
        const productId = event.target.value;
        // Busca el producto seleccionado en tu lista de productos
        const product = products.find(p => p.id === parseInt(productId));
        setSelectedProduct(product);
    };

    return (
        <form>
            {/* ...existing code... */}
            <div className="form-group">
                <label>Producto</label>
                <select className="form-control" onChange={handleProductChange}>
                    <option value="">Seleccione un producto</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>
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
            {/* ...existing code... */}
        </form>
    );
};

export default AddInventoryForm;