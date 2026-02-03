// Mock product database with detailed information
export interface Product {
  id: string
  category: string
  brand: string
  name: string
  fullName: string // Detailed name with specs (Amazon-style)
  description: string
  specs: Record<string, string | number>
  price: number
  imageUrl: string
}

export const products: Product[] = [
  // ==================== ELECTRONICS ====================
  // Laptops
  {
    id: "prod_laptop_1",
    category: "electronics",
    brand: "Dell",
    name: "XPS 13",
    fullName:
      "Dell XPS 13 9310 Laptop - 13.4-inch FHD+ Touchscreen, Intel Core i7-1185G7, 16GB LPDDR4x RAM, 512GB SSD, Intel Iris Xe Graphics, Windows 11 Pro - Silver",
    description:
      "Premium ultrabook with InfinityEdge display and excellent performance for business and creative professionals.",
    specs: {
      processor: "Intel Core i7-1185G7",
      ram: "16GB LPDDR4x",
      storage: "512GB SSD",
      display: "13.4-inch FHD+ (1920 x 1200) Touchscreen",
      graphics: "Intel Iris Xe Graphics",
      operatingSystem: "Windows 11 Pro",
      batteryLife: "12 hours",
      weight: "2.8 lbs",
    },
    price: 1499.99,
    imageUrl: "/modern-laptop-workspace.png",
  },
  {
    id: "prod_laptop_2",
    category: "electronics",
    brand: "Apple",
    name: "MacBook Pro",
    fullName:
      "Apple MacBook Pro 14-inch Laptop - M2 Pro chip with 10‑core CPU and 16‑core GPU, 16GB Unified Memory, 512GB SSD Storage, Liquid Retina XDR Display - Space Gray",
    description:
      "Powerful laptop for developers and creative professionals with exceptional performance and battery life.",
    specs: {
      processor: "Apple M2 Pro",
      ram: "16GB Unified Memory",
      storage: "512GB SSD",
      display: "14-inch Liquid Retina XDR Display",
      graphics: "16-core GPU",
      operatingSystem: "macOS",
      batteryLife: "18 hours",
      weight: "3.5 lbs",
    },
    price: 1999.99,
    imageUrl: "/placeholder.svg?key=s81rd",
  },
  {
    id: "prod_laptop_3",
    category: "electronics",
    brand: "Lenovo",
    name: "ThinkPad X1 Carbon",
    fullName:
      'Lenovo ThinkPad X1 Carbon Gen 10 - 14" WUXGA IPS Anti-glare Display, Intel Core i7-1260P, 16GB LPDDR5, 1TB SSD, Intel Iris Xe Graphics, Windows 11 Pro, Black',
    description: "Business-class laptop with durable design, excellent keyboard, and strong security features.",
    specs: {
      processor: "Intel Core i7-1260P",
      ram: "16GB LPDDR5",
      storage: "1TB SSD",
      display: "14-inch WUXGA IPS Anti-glare",
      graphics: "Intel Iris Xe Graphics",
      operatingSystem: "Windows 11 Pro",
      batteryLife: "14 hours",
      weight: "2.48 lbs",
    },
    price: 1749.99,
    imageUrl: "/placeholder.svg?key=ip62a",
  },
  {
    id: "prod_laptop_4",
    category: "electronics",
    brand: "HP",
    name: "Spectre x360",
    fullName:
      'HP Spectre x360 14 2-in-1 Laptop - 13.5" 3K2K OLED Touch Display, Intel Core i7-1255U, 16GB RAM, 1TB SSD, Intel Iris Xe Graphics, Windows 11 Pro - Nightfall Black',
    description: "Versatile 2-in-1 convertible laptop with premium design and vibrant OLED display.",
    specs: {
      processor: "Intel Core i7-1255U",
      ram: "16GB DDR4",
      storage: "1TB SSD",
      display: '13.5" 3K2K (3000 x 2000) OLED Touch',
      graphics: "Intel Iris Xe Graphics",
      operatingSystem: "Windows 11 Pro",
      batteryLife: "16 hours",
      weight: "2.95 lbs",
    },
    price: 1649.99,
    imageUrl: "/placeholder.svg?key=7r78w",
  },
  {
    id: "prod_laptop_5",
    category: "electronics",
    brand: "ASUS",
    name: "ROG Zephyrus G14",
    fullName:
      'ASUS ROG Zephyrus G14 Gaming Laptop - 14" QHD 120Hz Display, AMD Ryzen 9 6900HS, NVIDIA GeForce RTX 3060, 16GB DDR5, 1TB SSD, Windows 11 Home - Moonlight White',
    description: "Compact gaming laptop with powerful performance and long battery life.",
    specs: {
      processor: "AMD Ryzen 9 6900HS",
      ram: "16GB DDR5",
      storage: "1TB SSD",
      display: '14" QHD (2560 x 1440) 120Hz',
      graphics: "NVIDIA GeForce RTX 3060 6GB",
      operatingSystem: "Windows 11 Home",
      batteryLife: "10 hours",
      weight: "3.64 lbs",
    },
    price: 1649.99,
    imageUrl: "/placeholder.svg?key=8amui",
  },
  {
    id: "prod_laptop_6",
    category: "electronics",
    brand: "Microsoft",
    name: "Surface Laptop 5",
    fullName:
      'Microsoft Surface Laptop 5 - 13.5" Touchscreen, Intel Core i7-1255U, 16GB RAM, 512GB SSD, Intel Iris Xe Graphics, Windows 11 Pro - Platinum',
    description: "Sleek and lightweight laptop with premium build quality and excellent display.",
    specs: {
      processor: "Intel Core i7-1255U",
      ram: "16GB LPDDR5x",
      storage: "512GB SSD",
      display: '13.5" PixelSense Touch Display (2256 x 1504)',
      graphics: "Intel Iris Xe Graphics",
      operatingSystem: "Windows 11 Pro",
      batteryLife: "18 hours",
      weight: "2.86 lbs",
    },
    price: 1499.99,
    imageUrl: "/placeholder.svg?key=p6j36",
  },

  // Smartphones
  {
    id: "prod_phone_1",
    category: "electronics",
    brand: "Apple",
    name: "iPhone 15 Pro",
    fullName:
      "Apple iPhone 15 Pro - 256GB, 6.1-inch Super Retina XDR Display, A17 Pro Chip, 48MP Triple Camera System, Titanium Finish - Natural Titanium",
    description: "Flagship smartphone with advanced camera system, powerful A17 Pro chip, and premium titanium design.",
    specs: {
      display: '6.1" Super Retina XDR',
      processor: "A17 Pro Chip",
      storage: "256GB",
      camera: "48MP Triple Camera System",
      battery: "All-day battery life",
      operatingSystem: "iOS 17",
      connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
      waterResistance: "IP68",
    },
    price: 1099.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=iPhone+15+Pro",
  },
  {
    id: "prod_phone_2",
    category: "electronics",
    brand: "Samsung",
    name: "Galaxy S23 Ultra",
    fullName:
      "Samsung Galaxy S23 Ultra - 256GB, 6.8-inch QHD+ Dynamic AMOLED 2X, Snapdragon 8 Gen 2, 200MP Camera System, S Pen Included - Phantom Black",
    description: "Premium Android smartphone with S Pen support, exceptional camera system, and powerful performance.",
    specs: {
      display: '6.8" QHD+ Dynamic AMOLED 2X',
      processor: "Snapdragon 8 Gen 2",
      ram: "12GB",
      storage: "256GB",
      camera: "200MP Quad Camera System",
      battery: "5000mAh",
      operatingSystem: "Android 13",
      connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
    },
    price: 1199.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Samsung+Galaxy+S23+Ultra",
  },
  {
    id: "prod_phone_3",
    category: "electronics",
    brand: "Google",
    name: "Pixel 8 Pro",
    fullName:
      "Google Pixel 8 Pro - 128GB, 6.7-inch LTPO OLED Display, Google Tensor G3, 50MP Triple Camera System, 24-hour Battery - Obsidian",
    description:
      "Google flagship smartphone with advanced AI features, exceptional camera performance, and clean Android experience.",
    specs: {
      display: '6.7" LTPO OLED (1440 x 3120)',
      processor: "Google Tensor G3",
      ram: "12GB",
      storage: "128GB",
      camera: "50MP Triple Camera System",
      battery: "5050mAh",
      operatingSystem: "Android 14",
      connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
    },
    price: 999.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Google+Pixel+8+Pro",
  },
  {
    id: "prod_phone_4",
    category: "electronics",
    brand: "OnePlus",
    name: "OnePlus 11",
    fullName:
      "OnePlus 11 5G - 256GB, 6.7-inch QHD+ AMOLED Display, Snapdragon 8 Gen 2, 50MP Triple Camera System, 100W Fast Charging - Eternal Green",
    description: "Flagship smartphone with fast performance, excellent display, and rapid charging capabilities.",
    specs: {
      display: '6.7" QHD+ AMOLED (3216 x 1440)',
      processor: "Snapdragon 8 Gen 2",
      ram: "16GB",
      storage: "256GB",
      camera: "50MP Triple Camera System",
      battery: "5000mAh",
      operatingSystem: "OxygenOS 13 (Android 13)",
      connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
    },
    price: 799.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=OnePlus+11+smartphone",
  },

  // Monitors
  {
    id: "prod_monitor_1",
    category: "electronics",
    brand: "Dell",
    name: "UltraSharp U2720Q",
    fullName:
      "Dell UltraSharp U2720Q 27-inch 4K UHD (3840 x 2160) IPS USB-C Monitor, VESA Certified DisplayHDR 400, 95% DCI-P3, Height Adjustable Stand, 3-Year Warranty",
    description: "Professional 4K monitor with excellent color accuracy and USB-C connectivity.",
    specs: {
      size: "27 inches",
      resolution: "4K UHD (3840 x 2160)",
      panelType: "IPS",
      refreshRate: "60 Hz",
      responseTime: "5ms",
      colorGamut: "95% DCI-P3",
      ports: "HDMI, DisplayPort, USB-C",
      features: "Height Adjustable, Pivot, Swivel, Tilt",
    },
    price: 579.99,
    imageUrl: "/computer-monitor.png",
  },
  {
    id: "prod_monitor_2",
    category: "electronics",
    brand: "LG",
    name: "UltraGear 27GP950",
    fullName:
      "LG UltraGear 27GP950 27-inch UHD (3840 x 2160) Nano IPS Gaming Monitor, NVIDIA G-SYNC Compatible, AMD FreeSync Premium Pro, 144Hz, 1ms, VESA DisplayHDR 600",
    description: "High-performance gaming monitor with fast refresh rate and excellent color reproduction.",
    specs: {
      size: "27 inches",
      resolution: "4K UHD (3840 x 2160)",
      panelType: "Nano IPS",
      refreshRate: "144 Hz",
      responseTime: "1ms",
      colorGamut: "98% DCI-P3",
      ports: "HDMI 2.1, DisplayPort, USB Hub",
      features: "G-SYNC Compatible, FreeSync Premium Pro, RGB Lighting",
    },
    price: 799.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=LG+UltraGear+gaming+monitor",
  },
  {
    id: "prod_monitor_3",
    category: "electronics",
    brand: "Samsung",
    name: "Odyssey G7",
    fullName:
      "Samsung Odyssey G7 32-inch WQHD (2560 x 1440) 1000R Curved Gaming Monitor, 240Hz, 1ms, QLED, HDR600, G-Sync Compatible, FreeSync Premium Pro",
    description: "Curved gaming monitor with high refresh rate and immersive 1000R curvature.",
    specs: {
      size: "32 inches",
      resolution: "WQHD (2560 x 1440)",
      panelType: "QLED",
      refreshRate: "240 Hz",
      responseTime: "1ms",
      curvature: "1000R",
      colorGamut: "95% DCI-P3",
      ports: "HDMI, DisplayPort, USB Hub",
    },
    price: 699.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Samsung+Odyssey+G7+curved+monitor",
  },
  {
    id: "prod_monitor_4",
    category: "electronics",
    brand: "ASUS",
    name: "ProArt PA329CV",
    fullName:
      "ASUS ProArt Display PA329CV 32-inch 4K UHD (3840 x 2160) Professional Monitor, 100% sRGB, 100% Rec. 709, Delta E < 2, USB-C, Calman Verified",
    description: "Professional monitor with excellent color accuracy for content creators and designers.",
    specs: {
      size: "32 inches",
      resolution: "4K UHD (3840 x 2160)",
      panelType: "IPS",
      refreshRate: "60 Hz",
      colorAccuracy: "Delta E < 2",
      colorGamut: "100% sRGB, 100% Rec. 709",
      ports: "HDMI, DisplayPort, USB-C",
      features: "Calman Verified, ProArt Preset, ProArt Palette",
    },
    price: 699.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=ASUS+ProArt+professional+monitor",
  },

  // Headphones
  {
    id: "prod_headphones_1",
    category: "electronics",
    brand: "Sony",
    name: "WH-1000XM5",
    fullName:
      "Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Industry Leading Active Noise Cancellation, 30-Hour Battery, Built-in Microphone, Touch Controls, Black",
    description: "Premium wireless headphones with industry-leading noise cancellation and exceptional sound quality.",
    specs: {
      type: "Over-ear",
      connectivity: "Bluetooth 5.2, 3.5mm wired",
      batteryLife: "30 hours",
      noiseCancellation: "Active Noise Cancellation",
      audioFeatures: "LDAC, DSEE Extreme",
      microphoneType: "Beamforming with AI noise reduction",
      weight: "250g",
    },
    price: 399.99,
    imageUrl: "/diverse-people-listening-headphones.png",
  },
  {
    id: "prod_headphones_2",
    category: "electronics",
    brand: "Apple",
    name: "AirPods Pro 2",
    fullName:
      "Apple AirPods Pro (2nd Generation) - Active Noise Cancellation, Transparency Mode, Spatial Audio, MagSafe Charging Case, Sweat and Water Resistant",
    description:
      "Premium wireless earbuds with excellent noise cancellation and seamless integration with Apple devices.",
    specs: {
      type: "In-ear",
      connectivity: "Bluetooth 5.3",
      batteryLife: "6 hours (30 hours with case)",
      noiseCancellation: "Active Noise Cancellation",
      audioFeatures: "Spatial Audio, Adaptive EQ",
      waterResistance: "IPX4",
      charging: "MagSafe, Wireless, Lightning",
    },
    price: 249.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Apple+AirPods+Pro+2",
  },
  {
    id: "prod_headphones_3",
    category: "electronics",
    brand: "Bose",
    name: "QuietComfort Ultra",
    fullName:
      "Bose QuietComfort Ultra Headphones - Wireless Noise Cancelling Over-Ear Headphones, Spatial Audio, 24-Hour Battery Life, Bluetooth 5.3, Black",
    description: "Premium noise-cancelling headphones with immersive audio and comfortable design.",
    specs: {
      type: "Over-ear",
      connectivity: "Bluetooth 5.3, 3.5mm wired",
      batteryLife: "24 hours",
      noiseCancellation: "Bose Acoustic Noise Cancelling",
      audioFeatures: "Spatial Audio, CustomTune sound calibration",
      controls: "Touch, Physical buttons",
      weight: "250g",
    },
    price: 429.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Bose+QuietComfort+Ultra+headphones",
  },
  {
    id: "prod_headphones_4",
    category: "electronics",
    brand: "Sennheiser",
    name: "Momentum 4 Wireless",
    fullName:
      "Sennheiser Momentum 4 Wireless Headphones - Adaptive Noise Cancellation, 60-Hour Battery Life, Bluetooth 5.2, Smart Control App, Black",
    description: "Premium wireless headphones with exceptional sound quality and battery life.",
    specs: {
      type: "Over-ear",
      connectivity: "Bluetooth 5.2, 3.5mm wired",
      batteryLife: "60 hours",
      noiseCancellation: "Adaptive Noise Cancellation",
      audioFeatures: "aptX Adaptive, AAC, SBC",
      controls: "Touch, App control",
      weight: "293g",
    },
    price: 349.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Sennheiser+Momentum+4+headphones",
  },

  // Tablets
  {
    id: "prod_tablet_1",
    category: "electronics",
    brand: "Apple",
    name: "iPad Pro 12.9",
    fullName:
      "Apple iPad Pro 12.9-inch (6th Generation) - M2 Chip, 256GB, Wi-Fi, Liquid Retina XDR Display, 12MP Wide Camera, 10MP Ultra Wide Camera, Space Gray",
    description: "Powerful tablet with M2 chip, stunning XDR display, and professional-grade performance.",
    specs: {
      display: '12.9" Liquid Retina XDR',
      processor: "Apple M2",
      storage: "256GB",
      camera: "12MP Wide, 10MP Ultra Wide",
      battery: "10 hours",
      connectivity: "Wi-Fi 6E, Bluetooth 5.3",
      ports: "USB-C (Thunderbolt 4)",
      weight: "1.5 lbs",
    },
    price: 1199.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=iPad+Pro+12.9+tablet",
  },
  {
    id: "prod_tablet_2",
    category: "electronics",
    brand: "Samsung",
    name: "Galaxy Tab S9 Ultra",
    fullName:
      "Samsung Galaxy Tab S9 Ultra - 14.6-inch Dynamic AMOLED 2X Display, Snapdragon 8 Gen 2, 256GB, 12GB RAM, S Pen Included, Wi-Fi, Graphite",
    description: "Premium Android tablet with large AMOLED display, S Pen support, and powerful performance.",
    specs: {
      display: '14.6" Dynamic AMOLED 2X',
      processor: "Snapdragon 8 Gen 2",
      ram: "12GB",
      storage: "256GB",
      camera: "13MP + 8MP (front), 13MP + 8MP (rear)",
      battery: "11,200mAh",
      operatingSystem: "Android 13",
      weight: "1.6 lbs",
    },
    price: 1199.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Samsung+Galaxy+Tab+S9+Ultra",
  },
  {
    id: "prod_tablet_3",
    category: "electronics",
    brand: "Microsoft",
    name: "Surface Pro 9",
    fullName:
      "Microsoft Surface Pro 9 - 13-inch PixelSense Flow Display, Intel Core i7-1255U, 16GB RAM, 256GB SSD, Windows 11 Pro, Platinum (Keyboard Sold Separately)",
    description: "Versatile 2-in-1 tablet with laptop performance and tablet flexibility.",
    specs: {
      display: '13" PixelSense Flow (2880 x 1920)',
      processor: "Intel Core i7-1255U",
      ram: "16GB",
      storage: "256GB SSD",
      camera: "10MP Rear, Windows Hello Front",
      battery: "Up to 15.5 hours",
      operatingSystem: "Windows 11 Pro",
      ports: "2x USB-C with Thunderbolt 4",
    },
    price: 1599.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Microsoft+Surface+Pro+9",
  },

  // ==================== OFFICE SUPPLIES ====================
  {
    id: "prod_office_1",
    category: "office",
    brand: "HP",
    name: "LaserJet Pro M404dn",
    fullName:
      "HP LaserJet Pro M404dn Monochrome Laser Printer - Duplex Printing, Ethernet Connectivity, 40ppm, 4800x600 dpi, 350-Sheet Paper Capacity, Enterprise-Level Security",
    description: "Fast, reliable monochrome laser printer for small to medium-sized workgroups.",
    specs: {
      type: "Monochrome Laser",
      printSpeed: "40 ppm",
      resolution: "4800 x 600 dpi",
      paperCapacity: "350 sheets",
      connectivity: "USB, Ethernet",
      duplexPrinting: "Automatic",
      monthlyDutyCycle: "80,000 pages",
    },
    price: 289.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=HP+LaserJet+Pro+printer",
  },
  {
    id: "prod_office_2",
    category: "office",
    brand: "Brother",
    name: "MFC-L8900CDW",
    fullName:
      "Brother MFC-L8900CDW Business Color Laser All-in-One Printer - Print, Copy, Scan, Fax, Wireless Networking, Duplex Printing, Advanced Security Features",
    description: "Advanced color laser all-in-one printer for business use with robust security features.",
    specs: {
      type: "Color Laser All-in-One",
      printSpeed: "33 ppm (color and black)",
      resolution: "2400 x 600 dpi",
      paperCapacity: "650 sheets (expandable)",
      connectivity: "Wireless, Ethernet, USB",
      duplexPrinting: "Automatic",
      scannerType: "Dual-scan ADF",
    },
    price: 599.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Brother+MFC+color+laser+printer",
  },
  {
    id: "prod_office_3",
    category: "office",
    brand: "Epson",
    name: "WorkForce Pro WF-4830",
    fullName:
      "Epson WorkForce Pro WF-4830 All-in-One Printer - Print, Copy, Scan, Fax, 25ppm, Auto 2-Sided Printing, 50-Sheet ADF, 500-Sheet Capacity, 4.3-inch Touchscreen",
    description: "High-performance inkjet all-in-one printer for small businesses and home offices.",
    specs: {
      type: "Color Inkjet All-in-One",
      printSpeed: "25 ppm (black), 12 ppm (color)",
      resolution: "4800 x 2400 dpi",
      paperCapacity: "500 sheets",
      connectivity: "Wireless, Ethernet, USB",
      duplexPrinting: "Automatic",
      display: "4.3-inch Color Touchscreen",
    },
    price: 249.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Epson+WorkForce+Pro+printer",
  },
  {
    id: "prod_office_4",
    category: "office",
    brand: "Fellowes",
    name: "PowerShred 99Ci",
    fullName:
      "Fellowes PowerShred 99Ci 100% Jam Proof Cross-Cut Paper Shredder - 18-Sheet Capacity, 9-Gallon Bin, SafeSense Technology, Energy Saving System, Ultra Quiet",
    description: "Heavy-duty cross-cut shredder for office use with jam prevention technology.",
    specs: {
      type: "Cross-Cut Shredder",
      capacity: "18 sheets per pass",
      binCapacity: "9 gallons",
      shreddingType: "Paper, Credit Cards, CDs/DVDs, Staples",
      runTime: "30 minutes",
      cooldownTime: "40 minutes",
      safetyFeatures: "SafeSense Technology",
      noiseLevel: "Ultra Quiet",
    },
    price: 249.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Fellowes+paper+shredder",
  },
  {
    id: "prod_office_5",
    category: "office",
    brand: "3M",
    name: "Post-it Super Sticky Notes",
    fullName:
      "3M Post-it Super Sticky Notes - 3x3 inches, 24 Pads, 70 Sheets/Pad, Assorted Bright Colors, Strong Adhesive, Recyclable",
    description: "Premium sticky notes with strong adhesive that sticks securely to most surfaces.",
    specs: {
      size: "3x3 inches",
      quantity: "24 pads (70 sheets each)",
      colors: "Assorted Bright Colors",
      adhesive: "Super Sticky",
      material: "Recyclable Paper",
      features: "Sticks to most surfaces",
    },
    price: 39.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Post-it+Super+Sticky+Notes",
  },
  {
    id: "prod_office_6",
    category: "office",
    brand: "Pilot",
    name: "G2 Premium Gel Pens",
    fullName:
      "Pilot G2 Premium Retractable Gel Ink Roller Ball Pens - Fine Point (0.7mm), 36-Pack, Assorted Colors, Comfortable Grip, No Smear, No Bleed",
    description: "America's #1 selling gel pen with smooth writing and comfortable grip.",
    specs: {
      type: "Gel Ink Pens",
      pointSize: "0.7mm (Fine)",
      quantity: "36 pens",
      colors: "Assorted Colors",
      features: "Retractable, Refillable",
      inkProperties: "No Smear, No Bleed",
    },
    price: 42.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Pilot+G2+gel+pens",
  },
  {
    id: "prod_office_7",
    category: "office",
    brand: "Staples",
    name: "Heavy-Duty Stapler",
    fullName:
      "Staples Heavy-Duty Stapler - 40-Sheet Capacity, All-Metal Construction, Non-Slip Base, Built-in Staple Remover, Includes 5,000 Staples",
    description: "Durable, high-capacity stapler for frequent use in busy office environments.",
    specs: {
      capacity: "40 sheets",
      construction: "All-Metal",
      stapleSize: "Standard (26/6, 24/6)",
      features: "Non-Slip Base, Built-in Staple Remover",
      includes: "5,000 Staples",
    },
    price: 29.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Heavy+duty+stapler",
  },
  {
    id: "prod_office_8",
    category: "office",
    brand: "Logitech",
    name: "MX Keys",
    fullName:
      "Logitech MX Keys Advanced Wireless Illuminated Keyboard - Backlit Keys, Tactile Responsive Typing, Bluetooth, USB-C Rechargeable, Multi-Device, Compatible with Windows/Mac",
    description: "Premium wireless keyboard with perfect-stroke keys and smart illumination.",
    specs: {
      type: "Wireless Keyboard",
      connectivity: "Bluetooth, USB Receiver",
      battery: "10 days with backlight, 5 months without",
      features: "Backlit Keys, Multi-Device, Flow Cross-Computer Control",
      compatibility: "Windows, macOS, Linux, iOS, Android",
      charging: "USB-C",
    },
    price: 119.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Logitech+MX+Keys+keyboard",
  },
  {
    id: "prod_office_9",
    category: "office",
    brand: "Moleskine",
    name: "Classic Notebook",
    fullName:
      "Moleskine Classic Notebook, Hard Cover, Large (5 x 8.25) - Ruled/Lined, 240 Pages, Acid-Free Paper, Expandable Inner Pocket, Elastic Closure, Bookmark Ribbon",
    description: "Legendary notebook used by artists, writers, and thinkers for the past two centuries.",
    specs: {
      size: "Large (5 x 8.25 inches)",
      pages: "240 pages",
      paperType: "Acid-Free, Ivory",
      ruling: "Ruled/Lined",
      cover: "Hard Cover",
      features: "Expandable Inner Pocket, Elastic Closure, Bookmark Ribbon",
    },
    price: 19.95,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Moleskine+Classic+Notebook",
  },

  // ==================== FURNITURE ====================
  {
    id: "prod_chair_1",
    category: "furniture",
    brand: "Herman Miller",
    name: "Aeron",
    fullName:
      "Herman Miller Aeron Ergonomic Office Chair - Size B, Graphite Frame/Carbon Pellicle, Fully Adjustable Arms, Tilt Limiter with Seat Angle, PostureFit SL, Carpet Casters",
    description: "Iconic ergonomic chair with breathable mesh and comprehensive adjustability for all-day comfort.",
    specs: {
      size: "Size B (Medium)",
      material: "8Z Pellicle Mesh",
      adjustability: "Fully Adjustable Arms, Seat Height, Tilt",
      lumbarSupport: "PostureFit SL",
      weight: "41 lbs",
      weightCapacity: "350 lbs",
      warranty: "12 Years",
    },
    price: 1395.0,
    imageUrl: "/ergonomic-office-chair.png",
  },
  {
    id: "prod_chair_2",
    category: "furniture",
    brand: "Steelcase",
    name: "Gesture",
    fullName:
      "Steelcase Gesture Office Desk Chair with Headrest - Wrapped Back, Adjustable Seat Depth, Fully Adjustable Arms, Lumbar Support, Black Frame/Licorice Fabric",
    description: "Premium office chair designed to support various postures and technologies used throughout the day.",
    specs: {
      material: "Licorice Fabric",
      adjustability: "Fully Adjustable Arms, Seat Depth, Recline Tension",
      lumbarSupport: "Adjustable Lumbar",
      weight: "78 lbs",
      weightCapacity: "400 lbs",
      warranty: "12 Years",
    },
    price: 1299.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Steelcase+Gesture+chair",
  },
  {
    id: "prod_chair_3",
    category: "furniture",
    brand: "Autonomous",
    name: "ErgoChair Pro",
    fullName:
      "Autonomous ErgoChair Pro - Ergonomic Office Chair with Adjustable Headrest, Armrests, Lumbar Support, Tilt Tension, Seat Height, Breathable Mesh, 350 lbs Capacity",
    description: "Fully adjustable ergonomic chair with modern design and excellent support at a mid-range price.",
    specs: {
      material: "Breathable Mesh",
      adjustability: "5-Point Adjustability (Headrest, Armrests, Lumbar, Tilt, Height)",
      recline: "Up to 136 degrees",
      weight: "48.5 lbs",
      weightCapacity: "350 lbs",
      warranty: "2 Years",
    },
    price: 549.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Autonomous+ErgoChair+Pro",
  },
  {
    id: "prod_chair_4",
    category: "furniture",
    brand: "HON",
    name: "Ignition 2.0",
    fullName:
      "HON Ignition 2.0 Ergonomic Office Chair - Mesh Back, Adjustable Arms, Lumbar Support, Synchro-Tilt, Seat Glide, 300 lbs Capacity, Black Mesh/Fabric",
    description: "Mid-range ergonomic office chair with essential adjustability features and comfortable design.",
    specs: {
      material: "Mesh Back, Fabric Seat",
      adjustability: "4D Adjustable Arms, Seat Height, Seat Depth",
      lumbarSupport: "Height-Adjustable Lumbar",
      weight: "41 lbs",
      weightCapacity: "300 lbs",
      warranty: "Limited Lifetime",
    },
    price: 329.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=HON+Ignition+office+chair",
  },

  // Desks
  {
    id: "prod_desk_1",
    category: "furniture",
    brand: "Uplift",
    name: "V2 Standing Desk",
    fullName:
      'UPLIFT Desk V2 Commercial Height Adjustable Standing Desk - 72" x 30" Advanced Comfort Laminate Desktop, 4-Leg Frame with Programmable Memory Keypad, Cable Management, Black',
    description: "Commercial-grade adjustable height desk with stability even at the tallest heights.",
    specs: {
      size: '72" x 30"',
      heightRange: '22.6" - 48.7"',
      liftCapacity: "355 lbs",
      desktopMaterial: "Advanced Comfort Laminate",
      frameType: "4-Leg Steel Frame",
      controller: "Advanced Digital with 4 Memory Presets",
      warranty: "10 Years",
    },
    price: 749.0,
    imageUrl: "/standing-desk-setup.png",
  },
  {
    id: "prod_desk_2",
    category: "furniture",
    brand: "Fully",
    name: "Jarvis Standing Desk",
    fullName:
      'Fully Jarvis Standing Desk - 60" x 30" Bamboo Top, Electric Adjustable Height (24.5" - 50"), GREENGUARD Certified, 4 Memory Presets, Cable Management, Black Frame',
    description: "Award-winning standing desk with sustainable bamboo top and smooth height adjustment.",
    specs: {
      size: '60" x 30"',
      heightRange: '24.5" - 50"',
      liftCapacity: "350 lbs",
      desktopMaterial: "Bamboo",
      frameType: "Steel Frame",
      controller: "LED with 4 Memory Presets",
      certification: "GREENGUARD Certified",
    },
    price: 659.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Fully+Jarvis+standing+desk",
  },
  {
    id: "prod_desk_3",
    category: "furniture",
    brand: "Steelcase",
    name: "Migration SE",
    fullName:
      'Steelcase Migration SE Height-Adjustable Desk - 60" x 30", Electric, T-Foot Base, 3-Stage Columns, Digital Controller with 4 Memory Settings, Cable Management',
    description: "Commercial-grade height-adjustable desk with premium build quality and stability.",
    specs: {
      size: '60" x 30"',
      heightRange: '22.6" - 48.7"',
      liftCapacity: "220 lbs",
      desktopMaterial: "High-Pressure Laminate",
      frameType: "T-Foot Base",
      controller: "Digital with 4 Memory Settings",
      warranty: "5 Years",
    },
    price: 1099.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Steelcase+Migration+standing+desk",
  },
  {
    id: "prod_desk_4",
    category: "furniture",
    brand: "Herman Miller",
    name: "Renew Sit-to-Stand Desk",
    fullName:
      'Herman Miller Renew Sit-to-Stand Desk - 60" x 30", Electric Height Adjustment, C-Foot, Digital Paddle Control, Cable Management, White Laminate/White Base',
    description: "Premium standing desk with elegant design and reliable performance.",
    specs: {
      size: '60" x 30"',
      heightRange: '27" - 46"',
      liftCapacity: "250 lbs",
      desktopMaterial: "Laminate",
      frameType: "C-Foot",
      controller: "Digital Paddle Control",
      warranty: "12 Years",
    },
    price: 1495.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Herman+Miller+Renew+standing+desk",
  },

  // Filing Cabinets
  {
    id: "prod_cabinet_1",
    category: "furniture",
    brand: "HON",
    name: "Brigade 3-Drawer Filing Cabinet",
    fullName:
      "HON Brigade 3-Drawer Lateral File Cabinet - 42W, Metal, Full-Extension, Locking, 200 lb Capacity Drawers, Leveling Glides, Black",
    description: "Commercial-grade lateral file cabinet with full-extension drawers and high capacity.",
    specs: {
      type: "Lateral File Cabinet",
      drawers: "3 Drawers",
      width: "42 inches",
      material: "Steel",
      drawerCapacity: "200 lbs per drawer",
      features: "Full-Extension, Locking, Leveling Glides",
      assembly: "Fully Assembled",
    },
    price: 599.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=HON+Brigade+filing+cabinet",
  },
  {
    id: "prod_cabinet_2",
    category: "furniture",
    brand: "Lorell",
    name: "2-Drawer File Cabinet",
    fullName:
      "Lorell 2-Drawer Vertical File Cabinet - 15W x 22D x 28H, Metal, Locking, Suspension, Letter/Legal Size, Black",
    description: "Compact vertical file cabinet for home offices and small workspaces.",
    specs: {
      type: "Vertical File Cabinet",
      drawers: "2 Drawers",
      dimensions: "15W x 22D x 28H inches",
      material: "Steel",
      fileSize: "Letter/Legal",
      features: "Locking, Suspension",
      assembly: "Required",
    },
    price: 129.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Lorell+vertical+file+cabinet",
  },

  // Bookcases
  {
    id: "prod_bookcase_1",
    category: "furniture",
    brand: "HON",
    name: "Brigade 5-Shelf Bookcase",
    fullName:
      "HON Brigade 5-Shelf Bookcase - 36W x 12-3/4D x 71H, Metal, Adjustable Shelves, 250 lb Capacity per Shelf, Wall Attachment, Black",
    description: "Durable metal bookcase with adjustable shelves for office storage and organization.",
    specs: {
      type: "Bookcase",
      shelves: "5 Shelves",
      dimensions: "36W x 12-3/4D x 71H inches",
      material: "Steel",
      shelfCapacity: "250 lbs per shelf",
      features: "Adjustable Shelves, Wall Attachment",
      assembly: "Required",
    },
    price: 349.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=HON+Brigade+bookcase",
  },
  {
    id: "prod_bookcase_2",
    category: "furniture",
    brand: "Bush Furniture",
    name: "Somerset 5-Shelf Bookcase",
    fullName:
      "Bush Furniture Somerset 5-Shelf Bookcase - 30W x 12D x 71H, Adjustable Shelves, Enclosed Back Panel, Hansen Cherry",
    description: "Elegant wooden bookcase with adjustable shelves and enclosed back panel.",
    specs: {
      type: "Bookcase",
      shelves: "5 Shelves",
      dimensions: "30W x 12D x 71H inches",
      material: "Engineered Wood",
      finish: "Hansen Cherry",
      features: "Adjustable Shelves, Enclosed Back Panel",
      assembly: "Required",
    },
    price: 229.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Bush+Furniture+Somerset+bookcase",
  },

  // Conference Tables
  {
    id: "prod_table_1",
    category: "furniture",
    brand: "HON",
    name: "Preside Conference Table",
    fullName:
      "HON Preside Conference Table - 96W x 48D x 29-1/2H, Boat-Shaped, Mahogany Laminate, Satin Chrome T-Base, Cable Management",
    description: "Professional conference table with elegant design and integrated cable management.",
    specs: {
      type: "Conference Table",
      shape: "Boat-Shaped",
      dimensions: "96W x 48D x 29-1/2H inches",
      material: "Laminate",
      finish: "Mahogany",
      base: "Satin Chrome T-Base",
      features: "Cable Management",
    },
    price: 899.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=HON+Preside+conference+table",
  },

  // ==================== IT EQUIPMENT ====================
  {
    id: "prod_it_1",
    category: "it",
    brand: "Cisco",
    name: "Catalyst 9200",
    fullName:
      "Cisco Catalyst 9200 Series 48-Port PoE+ Network Switch - C9200-48P-4G, 48 Gigabit Ethernet Ports, 4 SFP Uplinks, 370W PoE Budget, Layer 2 & Layer 3 Features",
    description: "Enterprise-grade network switch with advanced security features and Power over Ethernet.",
    specs: {
      ports: "48 Gigabit Ethernet + 4 SFP Uplinks",
      switching: "176 Gbps",
      poe: "370W PoE Budget",
      features: "Layer 2 & Layer 3, QoS, Security",
      stackable: "Yes",
      rackUnits: "1U",
      warranty: "Limited Lifetime",
    },
    price: 3495.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Cisco+Catalyst+9200+switch",
  },
  {
    id: "prod_it_2",
    category: "it",
    brand: "Ubiquiti",
    name: "UniFi Dream Machine Pro",
    fullName:
      "Ubiquiti UniFi Dream Machine Pro - All-in-One Network Appliance, 10 Gbps SFP+ WAN, 8-Port Gigabit Switch, Security Gateway, Network Video Recorder",
    description: "All-in-one network appliance for enterprise-grade networks with integrated security and management.",
    specs: {
      processor: "Quad-Core ARM Cortex A57",
      memory: "4GB DDR4",
      storage: "16GB eMMC, HDD Bay for NVR",
      ports: "8-Port Gigabit Switch, 1 SFP+ 10G WAN, 1 SFP+ 10G LAN",
      throughput: "Up to 10 Gbps",
      features: "Security Gateway, Network Controller, Video Recorder",
      rackUnits: "1U",
    },
    price: 379.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Ubiquiti+UniFi+Dream+Machine+Pro",
  },
  {
    id: "prod_it_3",
    category: "it",
    brand: "Dell",
    name: "PowerEdge R750",
    fullName:
      "Dell PowerEdge R750 Server - Dual Intel Xeon Gold 6330 Processors, 128GB RAM, 8x 1.92TB SSD, RAID, Dual Power Supplies, iDRAC Enterprise, 3-Year ProSupport",
    description:
      "Enterprise-class server with powerful performance for virtualization and business-critical applications.",
    specs: {
      processor: "Dual Intel Xeon Gold 6330 (28 cores each)",
      memory: "128GB DDR4 ECC (16 DIMM slots)",
      storage: "8x 1.92TB SSD (24 drive bays)",
      raid: "PERC H755 RAID Controller",
      networking: "Dual-port 10GbE, Quad-port 1GbE",
      management: "iDRAC Enterprise",
      rackUnits: "2U",
    },
    price: 12995.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Dell+PowerEdge+R750+server",
  },
  {
    id: "prod_it_4",
    category: "it",
    brand: "Synology",
    name: "DiskStation DS1621+",
    fullName:
      "Synology DiskStation DS1621+ NAS - 6-Bay, AMD Ryzen V1500B Quad-Core, 4GB DDR4 ECC, 4x Gigabit LAN, 3x USB 3.2, PCIe Expansion, Btrfs File System",
    description: "High-performance NAS solution for small and medium businesses with expandability options.",
    specs: {
      bays: "6-Bay (expandable to 16)",
      processor: "AMD Ryzen V1500B Quad-Core",
      memory: "4GB DDR4 ECC (expandable to 32GB)",
      networking: "4x Gigabit LAN with Link Aggregation",
      ports: "3x USB 3.2, 1x PCIe 3.0 x8 slot",
      maxCapacity: "108TB (6x 18TB drives)",
      warranty: "3 Years",
    },
    price: 899.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Synology+DiskStation+DS1621+NAS",
  },
  {
    id: "prod_it_5",
    category: "it",
    brand: "APC",
    name: "Smart-UPS 1500VA",
    fullName:
      "APC Smart-UPS 1500VA LCD - SMT1500C, Line-Interactive, 120V, 1000W/1500VA, 8 Outlets (4 Battery Backup, Surge Protected), AVR, LCD Display, SmartConnect",
    description: "Intelligent and efficient network power protection with real-time monitoring capabilities.",
    specs: {
      capacity: "1000W / 1500VA",
      inputVoltage: "120V",
      outputVoltage: "120V",
      outlets: "8 (4 Battery Backup, Surge Protected)",
      runtime: "13.2 min at 50% load, 4.4 min at full load",
      topology: "Line-Interactive",
      management: "SmartConnect Cloud Monitoring",
      warranty: "3 Years",
    },
    price: 599.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=APC+Smart-UPS+1500VA",
  },
  {
    id: "prod_it_6",
    category: "it",
    brand: "Fortinet",
    name: "FortiGate 100F",
    fullName:
      "Fortinet FortiGate 100F Next-Generation Firewall - 20 Gbps Firewall Throughput, 2.2 Gbps NGFW, 10x GE RJ45 Ports, 2x SFP Ports, SD-WAN, 360 Protection Bundle",
    description: "Enterprise firewall with advanced security features and high-performance threat protection.",
    specs: {
      firewallThroughput: "20 Gbps",
      ngfwThroughput: "2.2 Gbps",
      threatProtection: "1.8 Gbps",
      ports: "10x GE RJ45, 2x SFP",
      concurrent: "700,000 Sessions",
      newSessions: "35,000 per second",
      virtualDomains: "10 (up to 10)",
      formFactor: "Desktop/Rackmount",
    },
    price: 4995.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Fortinet+FortiGate+firewall",
  },
  {
    id: "prod_it_7",
    category: "it",
    brand: "Microsoft",
    name: "Windows Server 2022",
    fullName:
      "Microsoft Windows Server 2022 Standard - 16 Core License, 64-bit, Multilanguage, Volume License, Software Assurance",
    description: "Latest Windows Server operating system with enhanced security and hybrid capabilities.",
    specs: {
      edition: "Standard",
      licensing: "16 Core License",
      architecture: "64-bit",
      language: "Multilanguage",
      licenseType: "Volume License with Software Assurance",
      features: "Secured-core server, Hybrid capabilities, Improved Windows containers",
      support: "5 years mainstream, 5 years extended",
    },
    price: 999.99,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Windows+Server+2022",
  },
  {
    id: "prod_it_8",
    category: "it",
    brand: "VMware",
    name: "vSphere 8 Enterprise Plus",
    fullName:
      "VMware vSphere 8 Enterprise Plus - 1 CPU, Production Support/Subscription for 1 Year, Virtualization Platform",
    description: "Industry-leading virtualization platform for enterprise data centers and cloud infrastructure.",
    specs: {
      edition: "Enterprise Plus",
      licensing: "Per CPU",
      support: "Production Support/Subscription for 1 Year",
      features: "DRS, Storage DRS, Distributed Switch, Host Profiles, Auto Deploy, Storage APIs, Distributed Security",
      compatibility: "Broad hardware and software ecosystem",
      management: "vCenter Server (sold separately)",
    },
    price: 5995.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=VMware+vSphere+virtualization",
  },
  {
    id: "prod_it_9",
    category: "it",
    brand: "Veeam",
    name: "Backup & Replication",
    fullName:
      "Veeam Backup & Replication Enterprise Plus - 10 Socket License, 24/7 Production Support, 1 Year Subscription",
    description:
      "Comprehensive data protection and disaster recovery solution for virtual, physical, and cloud workloads.",
    specs: {
      edition: "Enterprise Plus",
      licensing: "Per Socket (10 Socket License)",
      support: "24/7 Production Support",
      term: "1 Year Subscription",
      features:
        "Backup, Replication, Recovery, Monitoring, Reporting, Orchestration, DataLabs, Secure Restore, NAS Backup",
      compatibility: "VMware vSphere, Microsoft Hyper-V, Nutanix AHV, AWS, Azure, GCP",
    },
    price: 2995.0,
    imageUrl: "/placeholder.svg?height=300&width=400&query=Veeam+Backup+and+Replication",
  },
]

/**
 * Find products that match the given criteria
 */
export function findMatchingProducts(category?: string, query?: string, maxResults = 5): Product[] {
  let results = [...products]

  // Filter by category if provided
  if (category && category !== "other") {
    results = results.filter((product) => product.category.toLowerCase() === category.toLowerCase())
  }

  // Filter by search query if provided
  if (query) {
    const searchTerms = query.toLowerCase().split(" ")

    results = results.filter((product) => {
      // Check if any search term is found in product details
      return searchTerms.some(
        (term) =>
          product.brand.toLowerCase().includes(term) ||
          product.name.toLowerCase().includes(term) ||
          product.fullName.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          Object.values(product.specs).some((spec) => String(spec).toLowerCase().includes(term)),
      )
    })

    // Sort results by relevance (number of matching terms)
    results.sort((a, b) => {
      const aMatches = searchTerms.filter(
        (term) =>
          a.brand.toLowerCase().includes(term) ||
          a.name.toLowerCase().includes(term) ||
          a.fullName.toLowerCase().includes(term) ||
          a.description.toLowerCase().includes(term) ||
          Object.values(a.specs).some((spec) => String(spec).toLowerCase().includes(term)),
      ).length

      const bMatches = searchTerms.filter(
        (term) =>
          b.brand.toLowerCase().includes(term) ||
          b.name.toLowerCase().includes(term) ||
          b.fullName.toLowerCase().includes(term) ||
          b.description.toLowerCase().includes(term) ||
          Object.values(b.specs).some((spec) => String(spec).toLowerCase().includes(term)),
      ).length

      return bMatches - aMatches
    })
  }

  // Return limited number of results
  return results.slice(0, maxResults)
}

/**
 * Get a product by ID
 */
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}
