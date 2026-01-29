// Utility functions for image handling
// Uses placehold.co for reliable placeholder images that work after hosting

export const getPlaceholderImage = (width: number, height: number, text?: string, bgColor?: string, textColor?: string): string => {
    const bg = bgColor || 'e67e22'; // Default orange color
    const color = textColor || 'ffffff'; // Default white text
    const label = text ? `/${encodeURIComponent(text)}` : '';

    return `https://placehold.co/${width}x${height}/${bg}/${color}${label}`;
};

// Restaurant/Food placeholder images
export const foodPlaceholders = {
    restaurant: (name: string) => getPlaceholderImage(1000, 600, name, 'e67e22', 'ffffff'),
    dish: (name: string) => getPlaceholderImage(400, 300, name, 'f39c12', 'ffffff'),
    avatar: (name: string) => getPlaceholderImage(200, 200, name, '3498db', 'ffffff'),
    small: (name: string) => getPlaceholderImage(200, 200, name, 'e74c3c', 'ffffff'),
};

// Fallback images using data URLs (work offline)
export const dataUrlPlaceholders = {
    restaurant: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1000" height="600"%3E%3Crect fill="%23e67e22" width="1000" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="48" fill="%23ffffff"%3ERestaurant%3C/text%3E%3C/svg%3E',
    dish: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f39c12" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="32" fill="%23ffffff"%3EFood%3C/text%3E%3C/svg%3E',
    avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%233498db" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="64" fill="%23ffffff"%3E👤%3C/text%3E%3C/svg%3E',
};

// Image URL mapper - replace Unsplash URLs with reliable placeholders
export const mapImageUrl = (url: string, fallbackText?: string): string => {
    // If it's already a local or data URL, return as is
    if (url.startsWith('/') || url.startsWith('data:')) {
        return url;
    }

    // If it's an Unsplash URL, replace with placeholder
    if (url.includes('unsplash.com')) {
        // Extract dimensions from URL if possible
        const widthMatch = url.match(/w=(\d+)/);
        const width = widthMatch ? parseInt(widthMatch[1]) : 800;
        const height = Math.round(width * 0.75); // 4:3 aspect ratio

        return getPlaceholderImage(width, height, fallbackText || 'Food Image', 'e67e22', 'ffffff');
    }

    // Return original URL if it's not Unsplash
    return url;
};
