# Источники и права

- `public/assets/land.geojson`: Natural Earth 1:110m land, https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson. Public domain: https://www.naturalearthdata.com/about/terms-of-use/ . Данные без государственных границ и подписей.
- `earth-texture.png`: прежняя карта Natural Earth, больше не используется в hero.
- `public/assets/earth/surface-{4096,2048}.webp`: NASA Blue Marble Next Generation, июль 2004. Источник: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/ . Исходный JPEG 5400×2700: https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-base/july/world.200407.3x5400x2700.jpg . Авторство: NASA Earth Observatory, Reto Stöckli / Robert Simmon. Подготовлены локальные развёртки 4096×2048 и 2048×1024; почти чёрный глубокий океан слегка осветлён до синего для читаемости, география сохранена.
- `public/assets/earth/clouds-{2048,1024}.webp`: отдельная маска облаков NASA, https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg . Размеры 2048×1024 и 1024×512. Это исторический композит, не текущая погода. В шейдере облачный слой плавно ослабляется у полюсов, чтобы не показывать радиальные артефакты полярного заполнения исходной карты.
- Материалы NASA скачаны 4 октября 2026 года. Условия использования NASA: https://www.nasa.gov/nasa-brand-center/images-and-media/ . Логотипы NASA не используются, поддержка NASA не подразумевается.
- `earth-static.webp`: статичный прозрачный WebP-рендер итоговой Three.js-сцены, 1200×1200. `npm run assets` обновляет только спутниковые материалы и не перезаписывает этот рендер старой картой. Для обновления рендера при работающем локальном сервере: `npm run assets:render`; другой адрес задаётся `HERO_CAPTURE_URL`, браузер — `CHROMIUM_EXECUTABLE_PATH`.
- Свечение звёзд построено процедурно в canvas. Их положение символизирует программы фонда, а не географию помощи.
- Manrope и Cormorant Garamond: локальные пакеты Fontsource, SIL Open Font License; лицензии находятся в пакетах зависимостей.
- Иконки Lucide: ISC, пакет lucide-react.
- Исходный DOCX предоставлен владельцем проекта и сохранён без изменений. Размещать публично только в рамках согласованной публикации сайта.
- Референсы направления: https://syaifond.ru/, https://fondvera.ru/, https://voskhod.agency/portfolio/charity-foundation-website/. Тексты, изображения, персонажи и логотипы не копировались.

Визуальный концепт, созданный для разработки, не используется как изображение сайта: интерфейс и контент сверстаны независимо. География актуального hero основана на спутниковой карте NASA, а не на генерации.
