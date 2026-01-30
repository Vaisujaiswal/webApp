/* =========================

   SIMPLE IN-MEMORY CACHE

   (Redis-ready)

========================= */



const cacheStore = new Map();



/**

 * Set cache

 */

export const setCache = (key, value, ttlSeconds = 60) => {

    const expiresAt = Date.now() + ttlSeconds * 1000;



    cacheStore.set(key, {

        value,

        expiresAt,

    });

};



/**

 * Get cache

 */

export const getCache = (key) => {

    const cached = cacheStore.get(key);



    if (!cached) return null;



    if (Date.now() > cached.expiresAt) {

        cacheStore.delete(key);

        return null;

    }



    return cached.value;

};



/**

 * Delete cache key

 */

export const deleteCache = (key) => {

    cacheStore.delete(key);

};



/**

 * Clear all cache (debug)

 */

export const clearCache = () => {

    cacheStore.clear();

};



/* =========================

   AUTO CLEANUP

========================= */

setInterval(() => {

    const now = Date.now();

    for (const [key, entry] of cacheStore.entries()) {

        if (now > entry.expiresAt) {

            cacheStore.delete(key);

        }

    }

}, 60 * 1000);

