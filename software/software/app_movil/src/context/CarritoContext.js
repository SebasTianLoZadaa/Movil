/**
 *  Es el contexto global del carrito de compras
 * funciona en dos modos segun si el usuario esta autenticado
 * sin session lee y escribe en asyncStorage (carrito local)
 * con session lee y escribe en backend via api rest 
 * al iniciar sesion funciona automaticamente el carrito local al backend para que al usuario
 * no pierda los productos agregados sin cuenta
 * Expone items totales y las acciones : agregar cambiar cantidad eliminar y vaciar
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'; 
import { useAuth } from './AuthContext';
import carritoService from '../services/carritoService';

const  CarritoContext = createContext(null);

export function CarritoProvider({ children })  {
    // lee isAuthenticated e isLoading del contexto de autenticacion
    const { isAuthenticated, isLoadingSession } = useAuth ();

    // Estado del carrito
    const [carrito,setItems] = useState ([]); // lista de productos en el carrito
    const [totalItems,setTotalItems] = useState ([0]); // suma de cantidades
    const [total,setTotal] = useState ([0]); // precio total
    const [loading,setLoading] = useState (true); // true mientras carga el carrito


// rastrea si el usuario estaba autenticado en el render anterior para detectar en el momento exacto de inicio sesion 
const prevAuthenticated = useRef(false);

/** 
 * hydrate
 * carga o recarga el carrito desde el origen correcto local o backend
 * se llama al montar el provider y despues de cada operacion de escritura 
 */

const hydrate = useCallback(async () => {
    // Espera a que authcontext termine de restaurar la sesion guardada 
    if (isLoadingSession) {
        return;
    }

    /**
     * Fusion al iniciar sesion
     * si el usuario acaba de iniciar sesion paso de false a true
     * sube los items del carrito local al backend antes de leerlo
     * asi no se pierden los productos agregados sin cuenta
     */


    if (isAuthenticated && !prevAuthenticated.current) {

        try {
            await carritoService.mergeLocalToBackend ();
        } catch {
            // si la funcion falla continua sin bloquear 
        }
    } 

    // actualiza la referencia para el proximo render 
    prevAuthenticated.current = isAuthenticated;

    setLoading(true);
    try {
        // getCarrito decie internamente si consulta el backend o asyncStorage
        const snapchot = await carritoService.
        getCarrito(isAuthenticated);
        setItems(snapshot.setItems);
        setTotalItems(snapshot.totalItems);
        setTotal(snapshot.total);
    } catch {
        // si falla muestra carrito vacio sin productos 
        setItems([]);
        setTotalItems(0);
        setTotal(0);

    } finally {
        setLoading(false)
    }
}, [isAuthenticated, isLoadingSession]);

// se ejecuta cada vez que cambia isAuthenticated o isLoadingSession

useEffect (() => {
    hydrate();

}, [hydrate]);

/**
 * agregar producto
 * agrega producto al carrito(local o backend) y recarga el estado
 */

const agregarProducto = useCallback (
    async (producto, cantidad = 1 ) => {
        await carritoService.addToCarrito({
            isAuthenticated, producto, cantidad
        });
    }, 
    [hydrate, isAuthenticated]
);

/**
 * cambiar cantidad
 * modifica la cantidad de un item ya existente en el carrito
 */
const cambiarCantidad = useCallback(
    async (itemId, cantidad) => {
        await carritoService.updateCantidad({
            isAuthenticated, itemId, cantidad 
        })
        await hydrate();
    },
    [hydrate, isAuthenticated]

);

/**
 * vaciar carrito
 * elimina todos los items de carrito de una vez
 */
const vaciarCarrito = useCallback(async () => {
    await carritoService.clearCarrito
    (isAuthenticated); 
    await hydrate();
}, [hydrate, isAuthenticated]); 


}

