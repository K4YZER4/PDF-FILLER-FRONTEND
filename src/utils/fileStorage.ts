/**
 * ──────────────────────────────────────────────────────────────────────────────
 * fileStorage.ts  —  Persistencia de archivos en IndexedDB
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ¿Por qué IndexedDB y no localStorage?
 *   - Los objetos File (binarios) NO se serializan a JSON
 *   - localStorage tiene un límite de ~5MB, IndexedDB es prácticamente ilimitado
 *   - IndexedDB permite almacenar Blob/File directamente
 *
 * ¿Qué guardamos?
 *   Los 4 archivos del contrato (INE, nómina 1, nómina 2, estado de cuenta)
 *   usando las mismas claves que en el store: ineFile, nomina1File, etc.
 *
 * ¿Cuándo se guardan?
 *   - Al subir un archivo en SubirDocs → saveFile(key, file)
 *
 * ¿Cuándo se restauran?
 *   - Al montar SubirDocs → restoreFile(key) para cada documento
 *
 * ¿Cuándo se limpian?
 *   - Al salir del contrato (resetContract) → clearAllFiles
 *   - Al cerrar sesión (logout/resetAll) → clearAllFiles
 */

const DB_NAME = "credifom-files";
const STORE_NAME = "documents";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Guarda un File en IndexedDB asociado a una clave (ej: "ineFile").
 */
export async function saveFile(key: string, file: File): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(file, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(new Error("Transacción abortada"));
  });
}

/**
 * Recupera un File desde IndexedDB por su clave.
 * Retorna undefined si no existe.
 */
export async function loadFile(key: string): Promise<File | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(key);

    req.onsuccess = () => resolve(req.result ?? undefined);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Elimina un archivo específico de IndexedDB.
 */
export async function removeFile(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Limpia TODOS los archivos de IndexedDB.
 * Se llama al salir del contrato o al cerrar sesión.
 */
export async function clearAllFiles(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
