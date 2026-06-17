/**
 * Генератор sitemap для GitHub Pages
 * Запуск: node generate-sitemap.js
 * 
 * ИЛИ используйте в браузере для генерации
 */

const fs = require('fs');
const path = require('path');

const domain = 'https://vps-vpn.ru';
const articlesDir = './articles';
const outputDir = './';

// Основные страницы
const pages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/blog.html', priority: '0.9', changefreq: 'daily' },
    { url: '/access.html', priority: '0.8', changefreq: 'weekly' },
    { url: '/success.html', priority: '0.4', changefreq: 'monthly' },
    { url: '/article-template.html', priority: '0.1', changefreq: 'never' },
];

// Функция для определения приоритета
function getPriority(filename) {
    const highPriority = [
        'honor-magic-v6-review',
        'obzor-motorola-razr-ultra-2026',
        'obzor-samsung-galaxy-s26-ultra',
        'pochemu-vpn-ne-rabotaet',
        'kak-provaider-vidit-vash-vpn',
    ];
    
    for (const keyword of highPriority) {
        if (filename.includes(keyword)) {
            return '0.8';
        }
    }
    
    if (filename.includes('obzor-') || 
        filename.includes('review') ||
        filename.includes('kak-ya-')) {
        return '0.6';
    }
    
    return '0.5';
}

// Получаем список всех HTML файлов в папке articles
function getArticleFiles() {
    try {
        const files = fs.readdirSync(articlesDir);
        return files
            .filter(file => file.endsWith('.html') && file !== 'articles.json')
            .sort();
    } catch (error) {
        console.error('❌ Ошибка чтения папки articles:', error.message);
        return [];
    }
}

// Генерация sitemap-pages.xml
function generatePagesSitemap() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
    
    for (const page of pages) {
        xml += '    <url>\n';
        xml += `        <loc>${domain}${page.url}</loc>\n`;
        xml += `        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        xml += `        <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `        <priority>${page.priority}</priority>\n`;
        xml += '    </url>\n';
    }
    
    xml += '</urlset>';
    return xml;
}

// Генерация sitemap-articles.xml
function generateArticlesSitemap(articles) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const article of articles) {
        const priority = getPriority(article);
        xml += '    <url>\n';
        xml += `        <loc>${domain}/articles/${article}</loc>\n`;
        xml += `        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        xml += '        <changefreq>monthly</changefreq>\n';
        xml += `        <priority>${priority}</priority>\n`;
        xml += '    </url>\n';
    }
    
    xml += '</urlset>';
    return xml;
}

// Генерация основного sitemap.xml
function generateMainSitemap() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    xml += '    <sitemap>\n';
    xml += `        <loc>${domain}/sitemap-pages.xml</loc>\n`;
    xml += `        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += '    </sitemap>\n';
    xml += '    <sitemap>\n';
    xml += `        <loc>${domain}/sitemap-articles.xml</loc>\n`;
    xml += `        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += '    </sitemap>\n';
    xml += '</sitemapindex>';
    return xml;
}

// Сохранение файла
function saveFile(filename, content) {
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✅ Создан: ${filename}`);
}

// Главная функция
function main() {
    console.log('🚀 Генерация sitemap для ' + domain);
    console.log('━'.repeat(60));
    
    const articles = getArticleFiles();
    console.log(`📄 Найдено статей: ${articles.length}`);
    
    // Генерируем все sitemap
    saveFile('sitemap.xml', generateMainSitemap());
    saveFile('sitemap-pages.xml', generatePagesSitemap());
    saveFile('sitemap-articles.xml', generateArticlesSitemap(articles));
    
    console.log('━'.repeat(60));
    console.log('✅ Sitemap успешно сгенерирован!');
    console.log(`📁 Папка: ${path.resolve(outputDir)}`);
    console.log(`📄 Статей: ${articles.length}`);
}

// Запуск
main();
