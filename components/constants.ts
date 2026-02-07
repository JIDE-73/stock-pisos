import {
  Search,
  ShoppingBag,
  Smartphone,
  Shirt,
  Apple,
  Wrench,
  Sofa,
  Gamepad2,
  BookOpen,
  Dumbbell,
  Heart,
  Sparkles,
  Car,
  PawPrint,
  Book,
  Music,
  Plane,
  Leaf,
  Headphones,
  Zap,
} from "lucide-react-native";

export const categories = [
  { id: 1, name: "Productos", icon: ShoppingBag },
  { id: 2, name: "Tecnología", icon: Smartphone },
  { id: 3, name: "Moda", icon: Shirt },
  { id: 4, name: "Supermercado", icon: Apple },
  { id: 5, name: "Ferretería", icon: Wrench },
  { id: 6, name: "Hogar", icon: Sofa },
  { id: 7, name: "Entretenimiento", icon: Gamepad2 },
  { id: 8, name: "Educación", icon: BookOpen },
  { id: 9, name: "Deportes", icon: Dumbbell },
  { id: 10, name: "Salud y Bienestar", icon: Heart },
  { id: 11, name: "Belleza", icon: Sparkles },
  { id: 12, name: "Automóviles", icon: Car },
  { id: 13, name: "Mascotas", icon: PawPrint },
  { id: 14, name: "Libros", icon: Book },
  { id: 15, name: "Música", icon: Music },
  { id: 16, name: "Viajes", icon: Plane },
  { id: 17, name: "Jardín", icon: Leaf },
  { id: 18, name: "Accesorios", icon: Headphones },
  { id: 19, name: "Utilidades", icon: Zap },
];

export type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

export const productsByCategory: Record<number, Product[]> = {
  1: [
    {
      id: 1,
      name: "Producto Premium 1",
      price: 1500,
    },
    {
      id: 2,
      name: "Producto Premium 2",
      price: 1200,
    },
    {
      id: 3,
      name: "Producto Premium 3",
      price: 2500,
    },
    {
      id: 4,
      name: "Producto Premium 4",
      price: 890,
    },
    {
      id: 5,
      name: "Producto Premium 5",
      price: 3200,
    },
    {
      id: 6,
      name: "Producto Premium 6",
      price: 1650,
    },
  ],
  2: [
    {
      id: 7,
      name: "Laptop i5",
      price: 45000,
    },
    { id: 8, name: "Mouse Inalámbrico", price: 850 },
    {
      id: 9,
      name: "Teclado Mecánico",
      price: 3200,
    },
    { id: 10, name: "Monitor 27 4K", price: 8500 },
    {
      id: 11,
      name: "Auriculares Bluetooth",
      price: 2500,
    },
    { id: 12, name: "Webcam HD", price: 1200 },
  ],
  3: [
    {
      id: 13,
      name: "Camiseta Premium",
      price: 350,
    },
    {
      id: 14,
      name: "Pantalón Casual",
      price: 650,
    },
    {
      id: 15,
      name: "Chaqueta de Invierno",
      price: 2800,
    },
    {
      id: 16,
      name: "Zapatillas Deportivas",
      price: 1500,
    },
    {
      id: 17,
      name: "Accesorios de Moda",
      price: 450,
    },
    { id: 18, name: "Gorro Térmico", price: 280 },
  ],
  4: [
    {
      id: 19,
      name: "Leche Integral 1L",
      price: 120,
    },
    { id: 20, name: "Pan Integral", price: 280 },
    { id: 21, name: "Almendras 500g", price: 650 },
    { id: 22, name: "Aceite de Oliva", price: 890 },
    { id: 23, name: "Huevos Doena", price: 450 },
    {
      id: 24,
      name: "Café Gourmet 250g",
      price: 520,
    },
  ],
  5: [
    {
      id: 25,
      name: "Taladro Percutor",
      price: 3500,
    },
    { id: 26, name: "Martillo de Goma", price: 450, },
    {
      id: 27,
      name: "Juego de Destornilladores",
      price: 650,
    },
    {
      id: 28,
      name: "Sierra Circular",
      price: 5200,
    },
    { id: 29, name: "Cinta Métrica 5m", price: 280 },
    { id: 30, name: "Nivel Láser", price: 2800 },
  ],
  6: [
    {
      id: 31,
      name: "Sofá 3 Cuerpos",
      price: 12500,
    },
    { id: 32, name: "Mesa de Centro", price: 2200 },
    { id: 33, name: "Lámpara de Pie", price: 1500 },
    {
      id: 34,
      name: "Cortinas Premium",
      price: 3500,
    },
    { id: 35, name: "Almohadas Set 2", price: 890 },
    { id: 36, name: "Tapete 2x3m", price: 2800 },
  ],
};

export const getProductsForCategory = (categoryId: number): Product[] => {
  return productsByCategory[categoryId] || [];
};
