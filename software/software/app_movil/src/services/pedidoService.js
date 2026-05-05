/**
 * agrupa todas las operaciones del cliente sobre pedidos 
 * crear, consultar, consultar detalle de un pedido y cancelar pedido 
 */

import apiClient from '../api/apiClient';

const pedidoService = {
    // crea un pedido nuevo con los datos capturados en el checkout
    crearPedido: async ({ direccionEnvio, telefono, metodoPago = 'efectivo', notasAdicionales = '' }) => {
        const response = await apiClient.post('/cliente/pedidos', {
            direccionEnvio,
            telefono,
            metodoPago,
            notasAdicionales,
        });
        return response.data?.data?.pedidos || response.data?.pedidos || [];
    },

    // devuelve el historial de pedidos del usuario autenticado 
    getPedidos: async () => {
        const response = await apiClient.get('/cliente/pedidos');
        return response.data?.data?.pedidos || response.data?.pedidos || [];
    },

    // obtiene el detalle completo de un pedido por id
    getDetallePedido: async (id) => {
        const response = await apiClient.get(`/cliente/pedidos/${id}`);
        return response.data?.data?.pedido || response.data?.pedido || response.data;
    },

    // cancela un pedido siempre que el backend permita el cambio de estado
    cancelarPedido: async (id) => {
        const response = await apiClient.post(`/cliente/pedidos/${id}/cancelar`);
        return response.data; 
    }

    
};

export default pedidoService;