/**
 * unifica el manejo del carrito para dos escenarios
 * usuarios sin sesion carrito local en asyncStorage
 * usuario autenticado carrito persistido en el backend 
 * tambien normaliza la estructura de items y calcula totales para el contexto consuma siempre un formato consistente
 */

import apiClient from '../api/apiClient';
import { STORAGE_KEYS} from '../utils/constants';
import { storageGetItem, storageSetItem } from '../utils/storage';

// lee el carrito guardado localmente, si no existe o esta corrupto devuelve [].

async function readLocalCart() {
    const raw = await storageGetItem(STORAGE_KEYS.carritoLocal);
    if (!raw) {
        return [];
    }
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// guarda el carrito local completo en remplazando el valor anterior
async function writeLocalCart(items) {
    await storageSetItem(STORAGE_KEYS.carritoLocal, JSON.stringify(items));
}

// Convierte en diferentes formatos de items del backend/local a una estructura unica

function normalizeItem(item) {
    const producto = item.Producto || item.producto || {};
    const precio = Number(item.precio ?? item.precioUnitario  ?? producto.precio ?? 0);
    const cantidad = Number(item.cantidad  || 0);

    return {
        id : item.id, 
        productoId: producto.id ?? prducto.id,
        nombre: item.nombre ?? producto.nombre ?? 'producto',
        imagen: item.imagen ?? producto.imagen ?? '',
        precio, 
        cantidad,
        subtotal: precio * cantidad,
    };
}