/**
 * administra las funciones de usuario
 * activa o desactiva y elimina desde el panel de administrador 
 */

import api from '../api/apiClient';


// marca usuario como activo  
export async function activarUsuario(id) {
    const res = await api.patch(`/admin/usuarios/${id}/activar`); 
    return res.data;
}


// marca usuario como inactivo  
export async function desactivarUsuario(id) {
    const res = await api.patch(`/admin/usuarios/${id}/desactivar`); 
    return res.data;
}

// elimina un usuario
export async function deleteUsuario(id, data) {
    const res = await api.delete(`/admin/usuarios/${id}`, data);
    return res.data;
}
