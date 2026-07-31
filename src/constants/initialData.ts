import { Template, BackgroundMusic, Memory, Order, QRCodeData, MediaItem, SiteSettings, ActivityLog, User } from '../types';

export const INITIAL_USER: User = {
  id: 'usr_super_admin_01',
  name: 'Alexander Vance',
  email: 'alexander.vance@memorygift.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  phone: '+1 (800) 555-0199',
  role: 'SUPER_ADMIN',
  status: 'ACTIVE',
  lastLogin: '2026-07-30T03:45:00Z'
};

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'tmpl_rose_garden',
    name: 'Rose Garden Proposal',
    slug: 'rose-garden',
    category: 'PROPOSAL',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    description: 'Romantic burgundy & gold aesthetic featuring falling rose petal physics, rich serif typography, and intimate letter reveals.',
    previewImages: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'ACTIVE',
    isPremium: true,
    displayOrder: 1,
    version: '2.1.0',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-07-01T12:00:00Z'
  },
  {
    id: 'tmpl_luxury_gold',
    name: 'Luxury Golden Anniversary',
    slug: 'luxury-gold',
    category: 'ANNIVERSARY',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    description: 'Champagne gold shimmer and dark velvet slate with metallic card borders, glowing timeline checkpoints, and elegant glassmorphism.',
    previewImages: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'ACTIVE',
    isPremium: true,
    displayOrder: 2,
    version: '1.8.4',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-06-20T12:00:00Z'
  },
  {
    id: 'tmpl_galaxy_love',
    name: 'Galaxy Love Story',
    slug: 'galaxy-love',
    category: 'ROMANTIC',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800',
    description: 'Deep cosmic night sky backdrop with glowing star particle animations, constellation timelines, and dreamy nebula typography.',
    previewImages: [
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'ACTIVE',
    isPremium: false,
    displayOrder: 3,
    version: '1.5.0',
    createdAt: '2026-02-14T10:00:00Z',
    updatedAt: '2026-07-10T12:00:00Z'
  },
  {
    id: 'tmpl_elegant_birthday',
    name: 'Elegant Birthday Celebration',
    slug: 'elegant-birthday',
    category: 'BIRTHDAY',
    thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
    description: 'Warm celebratory pastel theme featuring celebratory confetti bursts, interactive Polaroid layout grids, and cheerful audio player.',
    previewImages: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'ACTIVE',
    isPremium: false,
    displayOrder: 4,
    version: '2.0.1',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-07-15T12:00:00Z'
  },
  {
    id: 'tmpl_vintage_scrapbook',
    name: 'Vintage Scrapbook Memories',
    slug: 'vintage-scrapbook',
    category: 'VINTAGE',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    description: 'Handcrafted parchment textures, washi tape corners, film grain shadows, and nostalgic handwritten font styles.',
    previewImages: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'ACTIVE',
    isPremium: true,
    displayOrder: 5,
    version: '1.2.0',
    createdAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-07-05T12:00:00Z'
  }
];

export const INITIAL_MUSIC: BackgroundMusic[] = [
  {
    id: 'mus_01',
    title: 'A Thousand Years (Piano Instrumental)',
    artist: 'Ethereal Harmony',
    musicUrl: 'https://res.cloudinary.com/vrniaume/video/upload/v1785510550/memorygift/music/a-thousand-years-piano-instrumental-.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=300',
    category: 'Romantic',
    duration: '2:27'
  },
  {
    id: 'mus_02',
    title: 'Golden Sunset Acoustic',
    artist: 'Serenity Ensemble',
    musicUrl: 'https://res.cloudinary.com/vrniaume/video/upload/v1785511760/memorygift/music/golden-sunset-acoustic.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300',
    category: 'Acoustic',
    duration: '2:10'
  },
  {
    id: 'mus_03',
    title: 'Celestial Whispers String Quartet',
    artist: 'Luna Strings',
    musicUrl: 'https://res.cloudinary.com/vrniaume/video/upload/v1785510555/memorygift/music/celestial-whispers-string-quartet.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=300',
    category: 'Classical',
    duration: '1:51'
  }
];

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem_rose_garden_01',
    slug: 'rose-garden-proposal',
    title: 'Will You Marry Me, Sophia?',
    subtitle: 'A journey through our 5 unforgettable years of love, laughter, and endless dreams.',
    recipientName: 'Sophia Lin',
    senderName: 'Marcus Bennett',
    relationship: 'Fiancée',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
    templateId: 'tmpl_rose_garden',
    musicId: 'mus_01',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    viewCount: 142,
    publishedAt: '2026-07-20T14:30:00Z',
    createdAt: '2026-07-18T10:00:00Z',
    updatedAt: '2026-07-20T14:30:00Z',
    letter: {
      id: 'ltr_01',
      memoryId: 'mem_rose_garden_01',
      title: 'My Dearest Sophia,',
      content: 'From the very first moment we met at that rainy coffee shop in Seattle, I knew my world had changed forever. Your smile lit up the darkest room, and your kindness touched every heart around you.\n\nThrough every trip, every quiet Sunday morning, and every challenge we conquered side by side, you have been my rock, my best friend, and my greatest blessing. As you read this letter and turn the page of our memory book, I want to ask you the most important question of my life...',
      fontStyle: 'serif',
      textAlignment: 'left'
    },
    photos: [
      {
        id: 'p_01',
        memoryId: 'mem_rose_garden_01',
        imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800',
        caption: 'Our first trip to Paris under the glowing lights',
        displayOrder: 1
      },
      {
        id: 'p_02',
        memoryId: 'mem_rose_garden_01',
        imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800',
        caption: 'Sunset stroll at the coast - July 2024',
        displayOrder: 2
      },
      {
        id: 'p_03',
        memoryId: 'mem_rose_garden_01',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
        caption: 'Cozy winter nights by the fireplace',
        displayOrder: 3
      },
      {
        id: 'p_04',
        memoryId: 'mem_rose_garden_01',
        imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800',
        caption: 'Hiking the Ridge Trail together',
        displayOrder: 4
      }
    ],
    videos: [
      {
        id: 'v_01',
        memoryId: 'mem_rose_garden_01',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&q=80&w=800',
        caption: 'Dancing under the summer rain',
        displayOrder: 1
      }
    ],
    voiceNotes: [
      {
        id: 'vn_01',
        memoryId: 'mem_rose_garden_01',
        title: 'A Message From My Heart',
        audioUrl: 'https://res.cloudinary.com/vrniaume/video/upload/v1785510560/memorygift/voice_notes/tmkc-mahavirwa-wala-mp3-old-raw-.mp3',
        duration: '00:06',
        displayOrder: 1
      }
    ],
    timeline: [
      {
        id: 'tl_01',
        memoryId: 'mem_rose_garden_01',
        title: 'First Coffee Date',
        description: 'We talked for 4 hours until the barista gently let us know they were closing!',
        eventDate: 'October 12, 2021',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600',
        displayOrder: 1
      },
      {
        id: 'tl_02',
        memoryId: 'mem_rose_garden_01',
        title: 'Adopting Maya',
        description: 'Brought our adorable golden retriever pup home to complete our little family.',
        eventDate: 'May 4, 2022',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
        displayOrder: 2
      },
      {
        id: 'tl_03',
        memoryId: 'mem_rose_garden_01',
        title: 'Moving Into Our Dream Home',
        description: 'Unpacking boxes, eating pizza on the hardwood floor, and making promises for the future.',
        eventDate: 'September 18, 2023',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
        displayOrder: 3
      },
      {
        id: 'tl_04',
        memoryId: 'mem_rose_garden_01',
        title: 'Tonight...',
        description: 'Beginning our forever together.',
        eventDate: 'Tonight',
        displayOrder: 4
      }
    ],
    quotes: [
      {
        id: 'q_01',
        memoryId: 'mem_rose_garden_01',
        quote: 'Whatever our souls are made of, his and mine are the same.',
        author: 'Emily Brontë',
        displayOrder: 1
      }
    ],
    wishes: [
      {
        id: 'w_01',
        memoryId: 'mem_rose_garden_01',
        personName: 'Mom & Dad',
        message: 'Wishing you two a lifetime of infinite joy and unconditional love!',
        createdAt: '2026-07-20T15:00:00Z'
      },
      {
        id: 'w_02',
        memoryId: 'mem_rose_garden_01',
        personName: 'Aunt Clara',
        message: 'May your journey together grow sweeter with every passing year.',
        createdAt: '2026-07-21T09:30:00Z'
      }
    ]
  },
  {
    id: 'mem_luxury_gold_02',
    slug: 'golden-anniversary-sarah-david',
    title: '50 Years of Grace & Devotion',
    subtitle: 'Celebrating the Golden Anniversary of Sarah & David Harrison',
    recipientName: 'Sarah & David Harrison',
    senderName: 'The Harrison Family & Grandchildren',
    relationship: 'Grandparents',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    templateId: 'tmpl_luxury_gold',
    musicId: 'mus_03',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    viewCount: 389,
    publishedAt: '2026-06-15T10:00:00Z',
    createdAt: '2026-06-10T08:00:00Z',
    updatedAt: '2026-06-15T10:00:00Z',
    letter: {
      id: 'ltr_02',
      memoryId: 'mem_luxury_gold_02',
      title: 'To Grandma & Grandpa,',
      content: 'Fifty years ago today, you stood at the altar and pledged your love. Over five decades, you built not just a family, but a sanctuary of warmth, wisdom, and steadfast unconditional kindness.\n\nYou taught us how to love, how to laugh during dark times, and how to stay united. This digital memory book is a humble tribute from all 14 of your children and grandchildren.',
      fontStyle: 'display',
      textAlignment: 'center'
    },
    photos: [
      {
        id: 'p_05',
        memoryId: 'mem_luxury_gold_02',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
        caption: 'Wedding Day - Summer 1976',
        displayOrder: 1
      },
      {
        id: 'p_06',
        memoryId: 'mem_luxury_gold_02',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
        caption: 'Family reunion in Aspen',
        displayOrder: 2
      }
    ],
    videos: [],
    voiceNotes: [
      {
        id: 'vn_02',
        memoryId: 'mem_luxury_gold_02',
        title: 'Toast From Ethan',
        audioUrl: 'https://res.cloudinary.com/vrniaume/video/upload/v1785510560/memorygift/voice_notes/tmkc-mahavirwa-wala-mp3-old-raw-.mp3',
        duration: '00:06',
        displayOrder: 1
      }
    ],
    timeline: [
      {
        id: 'tl_05',
        memoryId: 'mem_luxury_gold_02',
        title: 'The Wedding Day',
        description: 'June 15, 1976 in St. Mary’s Cathedral.',
        eventDate: 'June 15, 1976',
        displayOrder: 1
      },
      {
        id: 'tl_06',
        memoryId: 'mem_luxury_gold_02',
        title: 'Golden Jubilee Celebration',
        description: 'Gathered with 50 cherished friends and family.',
        eventDate: 'June 15, 2026',
        displayOrder: 2
      }
    ],
    quotes: [
      {
        id: 'q_02',
        memoryId: 'mem_luxury_gold_02',
        quote: 'Love grows more tremendously full, swift, poignant, as the years multiply.',
        author: 'Zora Neale Hurston',
        displayOrder: 1
      }
    ],
    wishes: []
  },
  {
    id: 'mem_birthday_03',
    slug: 'birthday-surprise-emma',
    title: 'Happy 30th Birthday, Emma!',
    subtitle: 'Chapter 30 begins with sparkle, joy, and memories with your favorite humans.',
    recipientName: 'Emma Vance',
    senderName: 'Your Besties Club',
    relationship: 'Best Friends',
    coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1200',
    templateId: 'tmpl_elegant_birthday',
    musicId: 'mus_02',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    viewCount: 88,
    publishedAt: '2026-07-25T08:00:00Z',
    createdAt: '2026-07-24T12:00:00Z',
    updatedAt: '2026-07-25T08:00:00Z',
    letter: {
      id: 'ltr_03',
      memoryId: 'mem_birthday_03',
      title: 'To the Queen of 30!',
      content: 'Happy 30th Birthday to the brightest soul in our squad! May this decade bring you untamed adventures, endless espresso martinis, and success beyond your wildest dreams.',
      fontStyle: 'sans',
      textAlignment: 'center'
    },
    photos: [
      {
        id: 'p_07',
        memoryId: 'mem_birthday_03',
        imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800',
        caption: 'Party mode unlocked!',
        displayOrder: 1
      }
    ],
    videos: [],
    voiceNotes: [],
    timeline: [],
    quotes: [],
    wishes: []
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1001',
    orderNumber: 'MG-8821',
    memoryId: 'mem_rose_garden_01',
    customerName: 'Marcus Bennett',
    customerPhone: '+1 555-0142',
    customerEmail: 'marcus.b@example.com',
    price: 49.00,
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    templateName: 'Rose Garden Proposal',
    createdAt: '2026-07-18T10:05:00Z'
  },
  {
    id: 'ord_1002',
    orderNumber: 'MG-8822',
    memoryId: 'mem_luxury_gold_02',
    customerName: 'David Harrison Jr.',
    customerPhone: '+1 555-0198',
    customerEmail: 'david.jr@example.com',
    price: 79.00,
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    templateName: 'Luxury Golden Anniversary',
    createdAt: '2026-06-10T08:12:00Z'
  },
  {
    id: 'ord_1003',
    orderNumber: 'MG-8823',
    memoryId: 'mem_birthday_03',
    customerName: 'Chloe Jenkins',
    customerPhone: '+1 555-0177',
    customerEmail: 'chloe.j@example.com',
    price: 29.00,
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    templateName: 'Elegant Birthday Celebration',
    createdAt: '2026-07-24T12:05:00Z'
  }
];

export const INITIAL_QRS: QRCodeData[] = [
  {
    id: 'qr_01',
    memoryId: 'mem_rose_garden_01',
    qrCodeImage: '',
    qrValue: '/memory/rose-garden-proposal',
    scanCount: 142,
    downloadCount: 22,
    status: 'ACTIVE',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    style: 'standard',
    createdAt: '2026-07-18T10:10:00Z',
    lastScannedAt: '2026-07-30T02:15:00Z'
  },
  {
    id: 'qr_02',
    memoryId: 'mem_luxury_gold_02',
    qrCodeImage: '',
    qrValue: '/memory/golden-anniversary-sarah-david',
    scanCount: 389,
    downloadCount: 45,
    status: 'ACTIVE',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    style: 'standard',
    createdAt: '2026-06-10T08:15:00Z',
    lastScannedAt: '2026-07-29T18:40:00Z'
  },
  {
    id: 'qr_03',
    memoryId: 'mem_birthday_03',
    qrCodeImage: '',
    qrValue: '/memory/birthday-surprise-emma',
    scanCount: 88,
    downloadCount: 12,
    status: 'ACTIVE',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    style: 'standard',
    createdAt: '2026-07-24T12:10:00Z',
    lastScannedAt: '2026-07-28T21:05:00Z'
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med_01',
    type: 'IMAGE',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    name: 'rose_garden_hero.jpg',
    size: '1.8 MB',
    mimeType: 'image/jpeg',
    uploadedBy: 'Alexander Vance',
    createdAt: '2026-07-18T10:00:00Z'
  },
  {
    id: 'med_02',
    type: 'IMAGE',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    name: 'golden_wedding_cover.jpg',
    size: '2.4 MB',
    mimeType: 'image/jpeg',
    uploadedBy: 'Alexander Vance',
    createdAt: '2026-06-10T08:00:00Z'
  },
  {
    id: 'med_03',
    type: 'VOICE_NOTE',
    url: 'https://res.cloudinary.com/vrniaume/video/upload/v1785510560/memorygift/voice_notes/tmkc-mahavirwa-wala-mp3-old-raw-.mp3',
    name: 'marcus_voice_proposal.mp3',
    size: '1.2 MB',
    mimeType: 'audio/mpeg',
    uploadedBy: 'Alexander Vance',
    createdAt: '2026-07-18T10:15:00Z'
  },
  {
    id: 'med_04',
    type: 'VIDEO',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    name: 'rain_dance_moment.mp4',
    size: '14.5 MB',
    mimeType: 'video/mp4',
    uploadedBy: 'Alexander Vance',
    createdAt: '2026-07-18T10:20:00Z'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'Memory Gift',
  siteLogo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=100',
  favicon: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=32',
  primaryColor: '#E11D48',
  secondaryColor: '#D97706',
  supportEmail: 'concierge@memorygift.com',
  phone: '+1 (800) 555-0199',
  address: '',
  city: '',
  facebook: 'https://facebook.com/memorygift',
  instagram: 'https://instagram.com/memorygift',
  youtube: 'https://youtube.com/memorygift',
  twitter: '',
  linkedin: '',
  tiktok: '',
  whatsapp: '',
  metaTitle: '',
  metaDescription: '',
  ogImage: '',
  twitterHandle: '',
  maintenanceMode: false
};

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log_01',
    adminId: 'usr_super_admin_01',
    adminName: 'Alexander Vance',
    action: 'MEMORY_CREATED',
    target: 'Will You Marry Me, Sophia?',
    description: 'Created new memory gift with Rose Garden template.',
    ipAddress: '192.168.1.101',
    browser: 'Chrome 126.0 (Macintosh)',
    createdAt: '2026-07-18T10:00:00Z'
  },
  {
    id: 'log_02',
    adminId: 'usr_super_admin_01',
    adminName: 'Alexander Vance',
    action: 'QR_GENERATED',
    target: 'MG-8821 / Rose Garden',
    description: 'Generated high-resolution vector QR code for gift box print.',
    ipAddress: '192.168.1.101',
    browser: 'Chrome 126.0 (Macintosh)',
    createdAt: '2026-07-18T10:10:00Z'
  },
  {
    id: 'log_03',
    adminId: 'usr_super_admin_01',
    adminName: 'Alexander Vance',
    action: 'TEMPLATE_UPDATED',
    target: 'Rose Garden Proposal v2.1.0',
    description: 'Updated template particle density and petal transition timings.',
    ipAddress: '192.168.1.101',
    browser: 'Chrome 126.0 (Macintosh)',
    createdAt: '2026-07-20T12:00:00Z'
  },
  {
    id: 'log_04',
    adminId: 'usr_super_admin_01',
    adminName: 'Alexander Vance',
    action: 'ADMIN_LOGIN',
    target: 'Admin Dashboard',
    description: 'Successful administrative login from secure IP.',
    ipAddress: '192.168.1.101',
    browser: 'Chrome 126.0 (Macintosh)',
    createdAt: '2026-07-30T03:45:00Z'
  }
];
