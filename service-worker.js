// 缓存名称
const CACHE_NAME = 'real-life-quest-v1';

// 需要缓存的资源
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/script.js',
  '/styles.css',
  '/data/quests.js',
  '/utils/analyzeAndRecommend.js',
  '/utils/generateQuests.js'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

//  fetch事件 - 优先从缓存中获取资源
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});