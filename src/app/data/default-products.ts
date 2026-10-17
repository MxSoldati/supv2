import { Product } from '../models/product.model';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "star-creatina",
    brand: "Star Nutrition",
    name: "Creatina",
    category: "creatina",
    variants: [
      { code: "A001", size: "300g", flavor: "Neutro", price: 27500, originalName: "Creatina 300 gramos", image: "assets/img/todas/A001.webp" },
      { code: "A002", size: "300g", flavor: "Frutos Rojos", price: 26500, originalName: "Creatina 300 gramos - frutos rojos", image: "assets/img/todas/A002.webp" },
      { code: "A003", size: "150g", flavor: "Neutro", price: 20000, originalName: "Creatina 150 gramos", image: "assets/img/todas/A003.webp" },
      { code: "A004", size: "500g", flavor: "Neutro", price: null, originalName: "Creatina 500 gramos", image: "assets/img/todas/A004.webp" },
      { code: "A005", size: "1kg", flavor: "Neutro", price: 80000, originalName: "Creatina 1 kg", image: "assets/img/todas/A005.webp" }
    ]
  },
  {
    id: "star-whey",
    brand: "Star Nutrition",
    name: "Whey Protein",
    category: "proteina",
    variants: [
      { code: "A006", size: "2 lbs", flavor: "Vainilla", price: 47000, originalName: "Whey Protein 2 libras - vainilla", image: "assets/img/todas/A006.webp" },
      { code: "A007", size: "2 lbs", flavor: "Chocolate", price: 47000, originalName: "Whey Protein 2 libras - chocolate", image: "assets/img/todas/A007.webp" },
      { code: "A008", size: "2 lbs", flavor: "Cookies", price: 47000, originalName: "Whey Protein 2 libras - cookies", image: "assets/img/todas/A008.webp" },
      { code: "A009", size: "2 lbs", flavor: "Frutilla", price: 47000, originalName: "Whey Protein 2 libras - frutilla", image: "assets/img/todas/A009.webp" },
      { code: "A010", size: "2 lbs (Tarro)", flavor: "Vainilla", price: 52000, originalName: "Whey Protein 2 libras - tarro - vainilla", image: "assets/img/todas/A010.webp" },
      { code: "A011", size: "2 lbs (Tarro)", flavor: "Chocolate", price: 52000, originalName: "Whey Protein 2 libras - tarro - chocolate", image: "assets/img/todas/A011.webp" },
      { code: "A012", size: "3 kg", flavor: "Vainilla", price: 142000, originalName: "Whey Protein 3 kg - vainilla", image: "assets/img/todas/A012.webp" },
      { code: "A013", size: "3 kg", flavor: "Chocolate", price: 142000, originalName: "Whey Protein 3 kg - chocolate", image: "assets/img/todas/A013.webp" }
    ]
  },
  {
    id: "star-whey-collagen",
    brand: "Star Nutrition",
    name: "Whey Protein Collagen",
    category: "proteina",
    variants: [
      { code: "A014", size: "2 lbs", flavor: "Vainilla", price: 45000, originalName: "Whey Protein Collagen 2 libras - vainilla", image: "assets/img/todas/A014.webp" },
      { code: "A015", size: "2 lbs", flavor: "Chocolate", price: 45000, originalName: "Whey Protein Collagen 2 libras - chocolate", image: "assets/img/todas/A015.webp" }
    ]
  },
  {
    id: "star-mutant",
    brand: "Star Nutrition",
    name: "Mutant Mass",
    category: "proteina",
    variants: [
      { code: "A016", size: "1.5 kg", flavor: "Vainilla", price: 38500, originalName: "Mutant Mass 1,5 kg - vainilla", image: "assets/img/todas/A016.webp" },
      { code: "A017", size: "1.5 kg", flavor: "Chocolate", price: 38500, originalName: "Mutant Mass 1,5 kg - chocolate", image: "assets/img/todas/A017.webp" }
    ]
  },
  {
    id: "star-magnesio",
    brand: "Star Nutrition",
    name: "Magnesio",
    category: "salud",
    variants: [
      { code: "A018", size: "60 caps", flavor: "Único", price: 15500, originalName: "Magnesio 60 cápsulas", image: "assets/img/todas/A018.webp" }
    ]
  },
  {
    id: "star-colageno",
    brand: "Star Nutrition",
    name: "Colágeno",
    category: "salud",
    variants: [
      { code: "A019", size: "210g", flavor: "Limón", price: 21500, originalName: "Colágeno 210 gramos - limón", image: "assets/img/todas/A019.webp" },
      { code: "A020", size: "210g", flavor: "Frutos Rojos", price: 21500, originalName: "Colágeno 210 gramos - frutos rojos", image: "assets/img/todas/A020.webp" }
    ]
  },
  {
    id: "star-v8",
    brand: "Star Nutrition",
    name: "V8 Pump",
    category: "energia",
    variants: [
      { code: "A021", size: "Único", flavor: "Sandía", price: 35000, originalName: "V8 Pump - sandía", image: "assets/img/todas/A021.webp" },
      { code: "A022", size: "Único", flavor: "Acai", price: 35000, originalName: "V8 Pump - acai", image: "assets/img/todas/A022.webp" }
    ]
  },
  {
    id: "star-omega3",
    brand: "Star Nutrition",
    name: "Omega 3",
    category: "salud",
    variants: [
      { code: "A023", size: "60 caps", flavor: "Único", price: 35900, originalName: "Omega 3 60 cápsulas", image: "assets/img/todas/A023.webp" }
    ]
  },
  {
    id: "star-zma",
    brand: "Star Nutrition",
    name: "ZMA",
    category: "salud",
    variants: [
      { code: "A024", size: "90 caps", flavor: "Único", price: 18300, originalName: "ZMA 90 cápsulas", image: "assets/img/todas/A024.webp" }
    ]
  },
  {
    id: "star-glutamina",
    brand: "Star Nutrition",
    name: "Glutamina",
    category: "aminoacidos",
    variants: [
      { code: "A025", size: "150g", flavor: "Neutro", price: null, originalName: "Glutamina 150 gramos", image: "assets/img/todas/A025(falta).webp" },
      { code: "A026", size: "300g", flavor: "Neutro", price: 32300, originalName: "Glutamina 300 gramos", image: "assets/img/todas/A026.webp" }
    ]
  },
  {
    id: "star-resveratrol",
    brand: "Star Nutrition",
    name: "Resveratrol",
    category: "salud",
    variants: [
      { code: "A027", size: "60 caps", flavor: "Único", price: 23500, originalName: "Resveratrol 60 cápsulas", image: "assets/img/todas/A027.webp" }
    ]
  },
  {
    id: "star-bcaa",
    brand: "Star Nutrition",
    name: "BCAA",
    category: "aminoacidos",
    variants: [
      { code: "A028", size: "120 caps", flavor: "Único", price: 19200, originalName: "BCAA 120 cápsulas", image: "assets/img/todas/A028.webp" }
    ]
  },
  {
    id: "star-botella",
    brand: "Star Nutrition",
    name: "Botella",
    category: "accesorios",
    variants: [
      { code: "A029", size: "Premium", flavor: "Único", price: 16000, originalName: "Botella Premium", image: "assets/img/Accesorios/A029(1).webp" },
      { code: "A030", size: "Básica", flavor: "Único", price: 5500, originalName: "Botella Básica", image: "assets/img/Accesorios/A030(1).jpg" }
    ]
  },
  {
    id: "ba-creatina",
    brand: "Body Advance",
    name: "Creatina",
    category: "creatina",
    variants: [
      { code: "B001", size: "150g", flavor: "Neutro", price: 12400, originalName: "Creatina 150 gramos", image: "assets/img/todas/B001.webp" }
    ]
  },
  {
    id: "ba-whey",
    brand: "Body Advance",
    name: "Whey Protein",
    category: "proteina",
    variants: [
      { code: "B002", size: "910g", flavor: "Vainilla", price: 25000, originalName: "Whey Protein 910 gramos - vainilla", image: "assets/img/todas/B002.webp" },
      { code: "B003", size: "910g", flavor: "Chocolate", price: 25000, originalName: "Whey Protein 910 gramos - chocolate", image: "assets/img/todas/B003.webp" },
      { code: "B004", size: "3 kg", flavor: "Único", price: 68500, originalName: "Whey Protein 3 kg", image: "assets/img/todas/B004 (chocolate).webp" }
    ]
  },
  {
    id: "ba-testo",
    brand: "Body Advance",
    name: "Testo",
    category: "energia",
    variants: [
      { code: "B005", size: "240g", flavor: "Uva", price: 20000, originalName: "Testo 240 gramos - Uva", image: "assets/img/todas/B005.webp" },
      { code: "B006", size: "240g", flavor: "Neutro", price: null, originalName: "Testo 240 gramos - ..", image: "assets/img/todas/B006.webp" }
    ]
  },
  {
    id: "ba-eeaa",
    brand: "Body Advance",
    name: "EEAA - Aminoácidos esenciales",
    category: "aminoacidos",
    variants: [
      { code: "B007", size: "Único", flavor: "Uva", price: 21000, originalName: "EEAA - Aminoácidos esenciales - Uva", image: "assets/img/todas/B007.webp" },
      { code: "B008", size: "Único", flavor: "Melón", price: 21000, originalName: "EEAA - Aminoácidos esenciales - Melón", image: "assets/img/todas/B008...webp" }
    ]
  },
  {
    id: "ba-magnesio",
    brand: "Body Advance",
    name: "Magnesio Citrato",
    category: "salud",
    variants: [
      { code: "B009", size: "175g", flavor: "Único", price: 13000, originalName: "Magnesio Citrato 175 gramos", image: "assets/img/todas/B009.webp" }
    ]
  },
  {
    id: "ba-nitrix",
    brand: "Body Advance",
    name: "Nitrix Bomb",
    category: "energia",
    variants: [
      { code: "B010", size: "90 comp", flavor: "Único", price: 9500, originalName: "Nitrix Bomb 90 comprimidos", image: "assets/img/todas/B010.webp" }
    ]
  },
  {
    id: "ba-multi",
    brand: "Body Advance",
    name: "Multivitaminico",
    category: "salud",
    variants: [
      { code: "B011", size: "60 comp", flavor: "Único", price: 9500, originalName: "Multivitaminico 60 comprimidos", image: "assets/img/todas/B011.webp" }
    ]
  }
];
