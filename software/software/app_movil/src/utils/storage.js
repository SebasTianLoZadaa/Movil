import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStore = new Map();
// respaldo temporal en memoria ai AsyncStorage 

// Ejecuta un function async y si falla devuelve un valor por defecto
// Se usa para centralizar el manejo silencioso de errores 
async function safeCall (fn, fallbackValue) {
    try {
        return await fn ();
    } catch {
        return fallbackValue;
    }
}

// lee una clave del almacenamiento 
// primero intenta por AsyncStorage y si falla usa el respaldo de memoria 

export async function storageGetItem(key) {
    const value = await safeCall (() => AsyncStorage.getItem(key), null);
    if (value !== null ) {
        return value;
    }
    return memoryStorage.has(key) ? memoryStore.get(key): null;
}

// guarda un clave en asyncstorage 
// si no puede persistir la almacena en la memoria virtual
export async function storageSetItem(key, value ) {
    const ok = await safeCall (async() => {
        await AsyncStorage.setItem(key, value)
        return true;


    }, false );

    if (!ok) {
        memoryStore.set(key, value);
    }
}

// Elimina varias claves a la vez 
// Siempre limpia primero el respaldo en memoria y luego intenta a asyncStorage

export async function storageMultiRemove (keys) {
    // siempre limpiar memoryStore primero
    keys.forEach((key) => memoryStore.delete(key));
    await safeCall(async() => {
        await AsyncStorage.mutiRemove(keys);
    }, null)
}