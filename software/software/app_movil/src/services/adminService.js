/**
 * Encapsula las operaciones del panel administrativo sobre productos
 * crea, edita, elimina, activa/desactiva productos
 * todas las funciones usan el cliente http central para incluir el token y manejo de errores
 */

import api from '../api/apiClient';

// crea un producto en el backend usando el payload del formulario del admin

export async function createProduct(data) {
    const res = await api.post('/admin/productos', data);
    return res.data;
}

// editar un producto existente por su id usando el payload del formulario del admin

export async function updateProduct(id, data) {
    const res = await api.put(`/admin/productos/${id}`, data);
    return res.data;
}

// elimina un producto por su id
export async function deleteProduct(id, data) {
    const res = await api.delete(`/admin/productos/${id}`, data);
    return res.data;
}

// marca producto como activo  
export async function activarProducto(id) {
    const res = await api.patch(`/admin/productos/${id}/activar`); 
    return res.data;
}


// marca producto como inactivo  
export async function desactivarProducto(id) {
    const res = await api.patch(`/admin/productos/${id}/desactivar`); 
    return res.data;
}
