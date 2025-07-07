// javascript/data.js
// This array holds all your product data.
// We export it so other modules can import it.
export const products = [ // Make sure 'export' is here
    {
        id: 'tech-001',
        name: 'Apple MacBook Air M2',
        price: 120000,
        category: 'laptops',
        image: './assets/images/mac3.jpg',
        detailImages: [
            'https://placehold.co/600x400/E0E0E0/000000?text=MacBook+Air+Front',
            'https://placehold.co/600x400/D0D0D0/000000?text=MacBook+Air+Side',
            'https://placehold.co/600x400/C0C0C0/000000?text=MacBook+Air+Keyboard'
        ],
        description: 'Experience unparalleled performance and efficiency with the new Apple MacBook Air M3. Perfect for professionals and students alike.',
        specifications: [
            { key: 'Processor', value: 'Apple M2 Chip' },
            { key: 'RAM', value: '8GB Unified Memory' },
            { key: 'Storage', value: '256GB SSD' },
            { key: 'Display', value: '13.6-inch Liquid Retina Display' }
        ],
        rating: 4.8,
        reviews: 250,
        stock: 10
    },
    {
        id: 'phone-001',
        name: 'iPhone 16 Pro',
        price: 130900,
        category: 'phones',
        image: './assets/images/iPhone2.jpg',
        detailImages: [
            './assets/images/iPhone2.jpg',
            './assets/images/iPhone3.jpg',
            './assets/images/iPhone.jpg'
        ],
        description: 'Capture stunning photos and videos with the advanced camera system and enjoy lightning-fast performance.',
        specifications: [
            { key: 'Display', value: '6.3-inch Super Retina XDR' },
            { key: 'Processor', value: 'A18 pro Bionic Chip' },
            { key: 'Camera', value: 'Pro Camera System' },
            { key: 'Storage', value: '128GB' }
        ],
        rating: 4.7,
        reviews: 300,
        stock: 15,
        discount: 5
    },
    {
        id: 'audio-001',
        name: 'AirPods Pro (2nd Gen)',
        price: 24900,
        category: 'audio',
        image: './assets/images/airpods.jpg',
        detailImages: [
            './assets/images/case.jpg',
            './assets/images/airpods_2.jpg'
        ],
        description: 'Immersive sound, active noise cancellation, and personalized spatial audio.',
        specifications: [
            { key: 'Chip', value: 'H2 Chip' },
            { key: 'Noise Cancellation', value: 'Active Noise Cancellation' },
            { key: 'Battery Life', value: 'Up to 6 hours' }
        ],
        rating: 4.9,
        reviews: 400,
        stock: 20
    },
    {
        id: 'watch-001',
        name: 'Apple Watch Series 10',
        price: 59900,
        category: 'wearables',
        image: './assets/images/watch.jpg',
        detailImages: [
            'https://placehold.co/600x400/E0E0E0/000000?text=Apple+Watch+Front',
            'https://placehold.co/600x400/D0D0D0/000000?text=Apple+Watch+Side'
        ],
        description: 'Your essential companion for a healthy life. Now with a brighter display and new gestures.',
        specifications: [
            { key: 'Display', value: 'Always-On Retina' },
            { key: 'Processor', value: 'S9 SiP' },
            { key: 'Water Resistance', value: '50m' }
        ],
        rating: 4.6,
        reviews: 180,
        stock: 12
    },
    {
        id: 'tablet-001',
        name: 'iPad Air M3',
        price: 59900,
        category: 'tablets',
        image: './assets/images/ipad.jpg',
        description: 'Powerful, portable, and perfect for creativity and productivity on the go.',
        specifications: [
            { key: 'Processor', value: 'Apple M2 Chip' },
            { key: 'Display', value: '10.9-inch Liquid Retina' },
            { key: 'Storage', value: '128GB' }
        ],
        rating: 4.7,
        reviews: 150,
        stock: 8
    },
    {
        id: 'accessory-001',
        name: 'Apple Pencil (2nd Gen)',
        price: 11900,
        category: 'accessories',
        image: './assets/images/pencil.jpg',
        description: 'The perfect tool for drawing, sketching, coloring, taking notes, and marking up documents.',
        specifications: [
            { key: 'Compatibility', value: 'iPad Pro, iPad Air, iPad mini' },
            { key: 'Connectivity', value: 'Magnetic attachment, wireless charging' }
        ],
        rating: 4.5,
        reviews: 120,
        stock: 25
    },
    {
        id: 'tech-002',
        name: 'iMac 24-inch M4',
        price: 180000,
        category: 'desktops',
        image: './assets/images/imac.jpg',
        description: 'All-in-one desktop with a stunning design and incredible M3 chip performance.',
        specifications: [
            { key: 'Processor', value: 'Apple M3 Chip' },
            { key: 'Display', value: '24-inch 4.5K Retina' },
            { key: 'RAM', value: '8GB Unified Memory' },
            { key: 'Storage', value: '256GB SSD' }
        ],
        rating: 4.8,
        reviews: 90,
        stock: 5
    },
    {
        id: 'audio-002',
        name: 'HomePod mini',
        price: 9900,
        category: 'audio',
        image: './assets/images/homepod.jpg',
        description: 'A smart speaker that delivers rich, 360-degree audio and intelligent assistance.',
        specifications: [
            { key: 'Chip', value: 'Apple S5 Chip' },
            { key: 'Audio', value: '360-degree sound' },
            { key: 'Voice Assistant', value: 'Siri' }
        ],
        rating: 4.4,
        reviews: 70,
        stock: 30
    },
    {
        id: 'accessory-002',
        name: 'Magic Keyboard',
        price: 14900,
        category: 'accessories',
        image: './assets/images/magic.jpg',
        description: 'Delivers a remarkably comfortable and precise typing experience.',
        specifications: [
            { key: 'Connectivity', value: 'Wireless (Bluetooth)' },
            { key: 'Battery', value: 'Rechargeable' }
        ],
        rating: 4.6,
        reviews: 60,
        stock: 18
    }
];
