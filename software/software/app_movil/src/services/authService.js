/**
 * Centraliza todas las operaciones relacionadas con autenticacion 
 * inicia sesion guarda token/usuario en almacenamiento local "storage" y en el contexto de autenticacion
 * cierra  sesion eliminando los datos 
 * restaura la sesion guardada
 * actualizar el perfil del usuario auntenticado
 */

import apiClient from '../api/apiClient';
import { STORAGE_KEY } from '../utils/constants';
import { storageGetItem, storageMultiSet, storageSetItem, } from '../utils/storage';

const authService = {
    // envia credenciales al backend y persiste token + usuario si son validos
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password});
        const payload = response.data?.data || response.data;

        if (payload?.token) {
            await storageSetItem(STORAGE_KEY.token, payload.token);
        }

          if (payload?.usuario) {
            await storageSetItem(STORAGE_KEY.usuario, payload.usuario);
          }

          return response.data;
    },


// registrar nuevo usuario con email y password
register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
},


// cierra sesion eliminando token y usuario del almacenamiento local
logout: async () => {
    await storageMultiRemove ([STORAGE_KEY.token, STORAGE_KEY.user]);
},

// Lee el almacenamiento local la sesion previamente guardada 
getSession: async () => {
    const token = await storageGetItem(STORAGE_KEY.token);
    const userRaw = await storageGetItem(STORAGE_KEY.user);
    const user = userRaw ? JSON.parse(userRaw) : null; // convierte el string a objeto si existe

    return { token, user };
},

// actualiza el perfil del usuario autenticado
updatePerfil: async (data) => {
    const response = await apiClient.put('/auth/me', data);
    const usuario = response.data?.data?.usuario || response.data.usuario || null;

    if (usuario) {
    await storageSetItem(STORAGE_KEY.usuario, JSON.stringify(usuario)); // guarda el usuario actualizado en storage
    }

    return response.data;

},

};

export default authService;



