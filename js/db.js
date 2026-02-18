// ============================================
// DB.JS - IndexedDB Database Layer
// ============================================

const DB_NAME = 'WorkManagerDB';
const DB_VERSION = 2;

let db = null;

// Open database connection
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            
            // Create object stores
            if (!database.objectStoreNames.contains('projects')) {
                database.createObjectStore('projects', { keyPath: 'code' });
            }
            if (!database.objectStoreNames.contains('dps')) {
                database.createObjectStore('dps', { keyPath: 'id', autoIncrement: true });
            }
            if (!database.objectStoreNames.contains('orders')) {
                database.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
            }
            if (!database.objectStoreNames.contains('clients')) {
                database.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

// Generic DB operations
function dbPut(storeName, data) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function dbGet(storeName, key) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function dbGetAll(storeName) {
    return new Promise((resolve, reject) => {
        if (!db) {
            resolve([]); // Return empty array if DB not ready
            return;
        }
        
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

function dbDelete(storeName, key) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Initialize DB on load
let dbReady = false;

async function initDB() {
    try {
        await openDB();
        dbReady = true;
        console.log('Database initialized');
        
        // Load initial data
        if (typeof projects !== 'undefined') {
            const loadedProjects = await dbGetAll('projects');
            projects = loadedProjects;
        }
    } catch (err) {
        console.error('Database initialization failed:', err);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDB);
