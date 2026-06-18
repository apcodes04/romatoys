// Helper to generate products
const generateProducts = (category, count, priceRange, baseName, imagePathFormat) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${category}-${i + 1}`,
    name: `${baseName} Model ${i + 1}`,
    category: category,
    price: Math.floor(Math.random() * (priceRange[1] - priceRange[0]) + priceRange[0]),
    description: `Experience the thrill of driving with our high-quality ${baseName.toLowerCase()}. Battery operated, safe for kids, and packed with features.`,
    image: `/images/products/${imagePathFormat}/${i + 1}.jpg`,
    features: ['Battery Operated', 'Music System', 'LED Lights', 'Safety Belt']
  }));
};

const cars = generateProducts('car', 8, [5000, 15000], 'Luxury Kids Car', 'car');
const jeeps = generateProducts('jeep', 8, [8000, 20000], 'Off-Road Jeep', 'jeep');
const bikes = generateProducts('bike', 12, [3000, 10000], 'Sporty Kids Bike', 'bike');

const otherToys = [
  {
    id: 'other-1',
    name: 'Interactive Robot',
    category: 'other',
    price: 1500,
    description: 'Fun interactive robot toy that dances and sings.',
    image: '/images/products/moretoys/1.png',
    features: ['Dancing', 'Singing', 'Lights']
  },
  {
    id: 'other-2',
    name: 'Educational Building Blocks',
    category: 'other',
    price: 800,
    description: 'Set of 100 colorful building blocks to boost creativity.',
    image: 'https://via.placeholder.com/400x400?text=Building+Blocks',
    features: ['100 Pieces', 'Non-toxic', 'Colorful']
  },
  {
    id: 'other-3',
    name: 'Doll House',
    category: 'other',
    price: 2500,
    description: 'Beautiful multi-story doll house with furniture.',
    image: 'https://via.placeholder.com/400x400?text=Doll+House',
    features: ['3 Stories', 'Wooden', 'Includes Furniture']
  },
  {
    id: 'other-4',
    name: 'Remote Control Helicopter',
    category: 'other',
    price: 2200,
    description: 'High-flying remote control helicopter for outdoor fun.',
    image: 'https://via.placeholder.com/400x400?text=RC+Helicopter',
    features: ['Rechargeable', 'Outdoor', 'Easy Controls']
  }
];

export const allProducts = [...cars, ...jeeps, ...bikes, ...otherToys];
