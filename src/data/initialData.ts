import {
  ProductCategory,
  Product,
  Service,
  Project,
  VideoItem,
  CommentReview,
  CompanySettings,
  UserAdmin,
  QuoteRequest,
  ContactMessage,
  MediaItem
} from '../types';

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat-portes-fenetres',
    name: 'Portes & Fenêtres en Verre',
    nameHt: 'Pòt & Fenèt an Vit',
    nameEn: 'Glass Doors & Windows',
    slug: 'portes-fenetres-vitre',
    description: 'Fabrication et installation de portes coulissantes, battantes, fenêtres françaises et baies vitrées sur mesure.',
    order: 1,
    iconName: 'DoorClosed',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-miroirs',
    name: 'Miroirs',
    nameHt: 'Miwon',
    nameEn: 'Mirrors',
    slug: 'miroirs',
    description: 'Miroirs décoratifs, biseautés, miroirs de salle de bain, rétroéclairés LED et grands miroirs de dressing.',
    order: 2,
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-vitres',
    name: 'Vitres',
    nameHt: 'Vit & Vè',
    nameEn: 'Glass Sheets',
    slug: 'vitres',
    description: 'Verre clair, teinté (bronze, gris, bleu), verre feuilleté sécurisé, verre trempé et verre dépoli.',
    order: 3,
    iconName: 'Layers',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-aluminium',
    name: 'Aluminium',
    nameHt: 'Aliminyòm',
    nameEn: 'Aluminium Profiles',
    slug: 'aluminium',
    description: 'Profilés aluminium de haute résistance, cadres, rails coulissants, finitions anodisées blanc, noir et bronze.',
    order: 4,
    iconName: 'Columns',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-vis',
    name: 'Vis & Fixations',
    nameHt: 'Vis & Fiksasyon',
    nameEn: 'Screws & Fasteners',
    slug: 'vis',
    description: 'Visserie inox anti-corrosion, chevilles d’ancrage, vis auto-foreuses et quincaillerie professionnelle.',
    order: 5,
    iconName: 'Hammer',
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-doors-closer',
    name: 'Door Closer / Ferme-Portes',
    nameHt: 'Fèm-Pòt Automatik (Door Closer)',
    nameEn: 'Door Closers',
    slug: 'door-closer',
    description: 'Ferme-portes hydrauliques robustes pour portes en verre et aluminium, pivots de sol et amortisseurs.',
    order: 6,
    iconName: 'Compass',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-accessoires',
    name: 'Accessoires & Matériels de Fabrication',
    nameHt: 'Aksesswa & Materyèl Fabrikasyon',
    nameEn: 'Fabrication Accessories & Hardware',
    slug: 'accessoires-materiels',
    description: 'Charnières lourdes, poignées de tirage inox, serrures à cylindre, joints silicone et ventouses vitrier.',
    order: 7,
    iconName: 'Wrench',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Porte Vitrée Coulissante Aluminium Premium',
    nameHt: 'Pòt Vit Glise Aliminyòm Premium',
    nameEn: 'Premium Sliding Glass Aluminium Door',
    slug: 'porte-vitree-coulissante-aluminium',
    categoryId: 'cat-portes-fenetres',
    shortDescription: 'Porte coulissante 2 ou 4 vantaux avec verre trempé 8mm/10mm et profilés aluminium thermo-laqués.',
    fullDescription: 'Idéale pour les terrasses, balcons et ouvertures résidentielles ou commerciales. Assure une luminosité maximale, une étanchéité parfaite et un roulement silencieux et fluide.',
    features: [
      'Verre trempé de sécurité 8mm ou 10mm',
      'Profilé aluminium haute résistance traité anti-corrosion',
      'Joints d’étanchéité double lèvre contre les intempéries',
      'Serrure de sécurité à clé intégrée',
      'Roulements en acier inoxydable longue durée'
    ],
    isAvailable: true,
    isFeatured: true,
    showOnHome: true,
    order: 1,
    status: 'published',
    images: [
      {
        id: 'img-p1-1',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
        alt: 'Porte vitrée coulissante moderne installée',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-p1-2',
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80',
        alt: 'Détail cadre aluminium et verre trempé',
        isPrimary: false,
        order: 2
      }
    ],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-01T12:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Fenêtre Française en Aluminium & Verre Teinté',
    nameHt: 'Fenèt Franse Aliminyòm & Vit Tente',
    nameEn: 'French Aluminium Window with Tinted Glass',
    slug: 'fenetre-francaise-aluminium',
    categoryId: 'cat-portes-fenetres',
    shortDescription: 'Fenêtre à battants avec verre teinté bronze ou gris, offrant isolation thermique et protection solaire.',
    fullDescription: 'Conçue pour résister aux climats tropicaux et fortes chaleurs, cette fenêtre allie élégance architecturale et protection contre les rayons UV directs.',
    features: [
      'Verre teinté bronze, fumé gris ou clair 6mm',
      'Châssis aluminium robuste résistant aux cyclones',
      'Poignée ergonomique multi-points',
      'Grille de sécurité intégrée en option'
    ],
    isAvailable: true,
    isFeatured: true,
    showOnHome: true,
    order: 2,
    status: 'published',
    images: [
      {
        id: 'img-p2-1',
        url: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=1000&q=80',
        alt: 'Fenêtre aluminium sur mesure',
        isPrimary: true,
        order: 1
      }
    ],
    createdAt: '2026-01-16T11:00:00Z',
    updatedAt: '2026-02-01T12:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Miroir Mural Biseauté Architectural Haute Définition',
    nameHt: 'Miwon Miray Bizo HD',
    nameEn: 'Architectural Beveled Wall Mirror HD',
    slug: 'miroir-mural-biseaute',
    categoryId: 'cat-miroirs',
    shortDescription: 'Miroir argenté sans cuivre de 5mm/6mm avec finition biseautée élégante pour salons et salles de bain.',
    fullDescription: 'Nos miroirs de qualité supérieure offrent une réflexion sans déformation et une couche protectrice anti-oxydation idéale pour les environnements humides.',
    features: [
      'Épaisseur 5mm ou 6mm haute clarté',
      'Biseautage périphérique de 15mm à 25mm au choix',
      'Traitement anti-buée et résistant à l’humidité',
      'Fixations invisibles renforcées incluses'
    ],
    isAvailable: true,
    isFeatured: true,
    showOnHome: true,
    order: 3,
    status: 'published',
    images: [
      {
        id: 'img-p3-1',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
        alt: 'Grand miroir de salle de bain lumineux',
        isPrimary: true,
        order: 1
      }
    ],
    createdAt: '2026-01-18T09:00:00Z',
    updatedAt: '2026-02-01T12:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'Paroi & Cabine de Douche en Verre Trempé 10mm',
    nameHt: 'Kabin Douch an Vit Tranpe 10mm',
    nameEn: '10mm Tempered Glass Shower Enclosure',
    slug: 'paroi-douche-verre-trempe',
    categoryId: 'cat-portes-fenetres',
    shortDescription: 'Paroi fixe ou porte de douche italienne en verre trempé securit avec ferrures inox 304.',
    fullDescription: 'Transformez votre salle d’eau en un espace digne des plus grands hôtels avec nos parois de douche sur mesure, hygiéniques et faciles à entretenir.',
    features: [
      'Verre sécurit trempé 10mm certifié',
      'Quincaillerie inox poli ou noir mat résistant à l’eau',
      'Joint d’étanchéité magnétique et bas de porte anti-goutte',
      'Prise de mesure et découpe au millimètre près'
    ],
    isAvailable: true,
    isFeatured: true,
    showOnHome: true,
    order: 4,
    status: 'published',
    images: [
      {
        id: 'img-p4-1',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
        alt: 'Douche en verre trempé sur mesure',
        isPrimary: true,
        order: 1
      }
    ],
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-02-01T12:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Ferme-Porte Hydraulique Lourd (Door Closer Heavy Duty)',
    nameHt: 'Fèm-Pòt Idwolik Lou',
    nameEn: 'Heavy Duty Hydraulic Door Closer',
    slug: 'ferme-porte-hydraulique-doors-closer',
    categoryId: 'cat-doors-closer',
    shortDescription: 'Ferme-porte hydraulique réglable pour portes de 45kg à 100kg avec bras articulé en acier trempé.',
    fullDescription: 'Ferme-porte de classe commerciale assurant une fermeture douce, contrôlée et sécurisée de vos portes en verre, bois ou aluminium. Vitesse de fermeture et d’à-coup réglable.',
    features: [
      'Capacité de charge de 45 kg à 100 kg',
      'Double valve de réglage vitesse & force de butée',
      'Corps en aluminium coulé sous pression',
      'Testé sur plus de 500 000 cycles d’ouverture'
    ],
    isAvailable: true,
    isFeatured: true,
    showOnHome: true,
    order: 5,
    status: 'published',
    images: [
      {
        id: 'img-p5-1',
        url: '/assets/haitian_technician_door_closer.jpg',
        alt: 'Technicien haïtien en uniforme maillot violet GLOBAL GLASS AND WINDOWS installant un ferme-porte hydraulique',
        isPrimary: true,
        order: 1
      }
    ],
    createdAt: '2026-01-22T08:00:00Z',
    updatedAt: '2026-02-01T12:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'Profilés Aluminium & Barres de Menuiserie',
    nameHt: 'Pwofile Aliminyòm pou Menwizri',
    nameEn: 'Aluminium Extrusion Profiles',
    slug: 'profiles-aluminium-menuiserie',
    categoryId: 'cat-aluminium',
    shortDescription: 'Large choix de profilés aluminium tubulaires, cornières, rails et montants pour vitrage.',
    fullDescription: 'Matériaux de premier choix pour artisans, constructeurs et fabricants de fenêtres en Haïti. Disponibles en finitions blanc brillant, bronze anodisé, noir mat et argent naturel.',
    features: [
      'Alliage d’aluminium 6063 T5 de haute résistance',
      'Traitement de surface anodisé ou thermo-laqué',
      'Longueurs standards de 6 mètres ou coupes personnalisées',
      'Disponibilité en gros et au détail'
    ],
    isAvailable: true,
    isFeatured: false,
    showOnHome: true,
    order: 6,
    status: 'published',
    images: [
      {
        id: 'img-p6-1',
        url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
        alt: 'Profilés aluminium de haute qualité',
        isPrimary: true,
        order: 1
      }
    ],
    createdAt: '2026-01-25T16:00:00Z',
    updatedAt: '2026-02-01T12:00:00Z'
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'serv-1',
    title: 'Vente de verre & vitres',
    titleHt: 'Vant vè & vit',
    titleEn: 'Glass & Glazing Sales',
    shortDesc: 'Vente en gros et au détail de verre clair, teinté (bronze, gris), feuilleté et trempé à la découpe.',
    fullDesc: 'Nous fournissons du verre de haute qualité pour tous vos chantiers résidentiels, commerciaux et industriels. Découpe numérique et façonnage des bords avec précision.',
    icon: 'Layers',
    image: '/assets/haitian_artisan_glass_cutting.jpg',
    features: ['Verre clair 3mm à 12mm', 'Verre teinté bronze et fumé gris', 'Verre feuilleté securit 33.2 / 44.2', 'Verre trempé grande dimension'],
    order: 1,
    isFeatured: true
  },
  {
    id: 'serv-2',
    title: 'Vente de miroirs sur mesure',
    titleHt: 'Vant miwon sou mezi',
    titleEn: 'Custom Mirror Sales',
    shortDesc: 'Miroirs argentés de première qualité, biseautés, polis et découpés selon vos formes et dimensions.',
    fullDesc: 'Miroirs clairs, miroirs teintés bronze ou gris, miroirs de salle de bain, miroirs muraux panoramiques et habillages de placards pour sublimer vos espaces.',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    features: ['Biseautage de 10 à 30mm', 'Découpe droite ou courbée', 'Miroirs anti-éclats', 'Miroirs décoratifs design'],
    order: 2,
    isFeatured: true
  },
  {
    id: 'serv-3',
    title: "Vente d'aluminium & profilés",
    titleHt: 'Vant aliminyòm & pwofile',
    titleEn: 'Aluminium & Extrusion Sales',
    shortDesc: 'Profilés aluminium pour menuiserie, fenêtres coulissantes, portes battantes et cloisons.',
    fullDesc: 'Distribution de profilés et barres d’aluminium conformes aux normes internationales, résistants aux rayons solaires et à la corrosion marine.',
    icon: 'Columns',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    features: ['Finitions blanc, noir, bronze, naturel', 'Tubes carrés et rectangulaires', 'Rails de guidage et coulisses', 'Vente au détail et par lot'],
    order: 3,
    isFeatured: true
  },
  {
    id: 'serv-4',
    title: "Vente d'accessoires & quincaillerie",
    titleHt: 'Vant aksesswa & kenkayri',
    titleEn: 'Hardware & Accessories Sales',
    shortDesc: 'Vis inox, charnières, poignées, serrures, roulettes, joints d’étanchéité et outillage spécialisé.',
    fullDesc: 'Tout l’outillage et la quincaillerie indispensables aux professionnels et particuliers : visières, ventouses de vitrier, silicones neutres et colles structurales.',
    icon: 'Wrench',
    image: '/assets/haitian_technician_door_closer.jpg',
    features: ['Visserie inox tous calibres', 'Poignées aluminium & inox 304', 'Roulettes à roulement étanche', 'Silicone pro anti-moisissure'],
    order: 4,
    isFeatured: true
  },
  {
    id: 'serv-5',
    title: 'Fabrication de portes en verre',
    titleHt: 'Fabrikasyon pòt an vit',
    titleEn: 'Glass Door Manufacturing',
    shortDesc: 'Conception sur mesure de portes vitrées coulissantes, pivotantes et automatiques de prestige.',
    fullDesc: 'Nous créons des portes d’entrée vitrées, portes de séparation de bureaux et cloisons coulissantes intégrant du verre sécurit de forte épaisseur et des armatures raffinées.',
    icon: 'DoorClosed',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    features: ['Portes coulissantes à galandage', 'Portes battantes double action', 'Portes vitrées de magasin & façades', 'Portes acoustiques isolantes'],
    order: 5,
    isFeatured: true
  },
  {
    id: 'serv-6',
    title: 'Fabrication de fenêtres en aluminium',
    titleHt: 'Fabrikasyon fenèt an aliminyòm',
    titleEn: 'Aluminium Window Fabrication',
    shortDesc: 'Assemblage de fenêtres coulissantes, jalousies, fenêtres françaises et impostes haute performance.',
    fullDesc: 'Nos techniciens fabriquent dans nos ateliers de Petit-Goâve des fenêtres sur mesure adaptées aux conditions architecturales et climatiques d’Haïti.',
    icon: 'Grid',
    image: '/assets/haitian_installation_team.jpg',
    features: ['Fenêtres 2, 3 et 4 vantaux', 'Fenêtres à soufflet et basculantes', 'Jalousies vitrées et aluminium', 'Intégration de moustiquaires'],
    order: 6,
    isFeatured: true
  },
  {
    id: 'serv-7',
    title: 'Installation & Pose de fenêtres',
    titleHt: 'Enstalasyon fenèt',
    titleEn: 'Window Installation & Fitting',
    shortDesc: 'Pose experte sur site par des équipes qualifiées avec garantie d’étanchéité et d’isolation.',
    fullDesc: 'Nous intervenons directement sur vos chantiers avec nos camions équipés pour garantir une mise en place au millimètre, sans fuite d’air ni d’eau.',
    icon: 'Hammer',
    image: '/assets/haitian_installation_team.jpg',
    features: ['Pose en neuf et rénovation', 'Calage de précision au laser', 'Jointoiement étanche garanti', 'Respect des délais convenus'],
    order: 7,
    isFeatured: false
  },
  {
    id: 'serv-8',
    title: 'Installation de portes vitrées',
    titleHt: 'Enstalasyon pòt vit',
    titleEn: 'Glass Door Installation',
    shortDesc: 'Mise en œuvre soignée de systèmes de portes battantes, va-et-vient et coulissantes.',
    fullDesc: 'Installation de rails encastrés, pivots au sol et ferme-portes hydrauliques pour une utilisation sans effort et une durée de vie maximale.',
    icon: 'ShieldCheck',
    image: '/assets/haitian_technician_door_closer.jpg',
    features: ['Fixation des pivots de sol', 'Ajustement parfait des jeux', 'Vérification du freinage', 'Test d’endurance sur place'],
    order: 8,
    isFeatured: false
  },
  {
    id: 'serv-9',
    title: 'Fabrication de douches en verre',
    titleHt: 'Fabrikasyon douch an vit',
    titleEn: 'Custom Glass Shower Enclosures',
    shortDesc: 'Création de cabines de douche et parois sur mesure en verre trempé 8/10mm anti-calcaire.',
    fullDesc: 'Design minimaliste et élégant pour moderniser votre salle de bain avec des ferrures en inox résistant à l’eau et des finitions soignées.',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    features: ['Verre trempé clair ou satiné', 'Ferrures inox 304 / noir mat', 'Barres de renfort murales', 'Joints silicone translucides'],
    order: 9,
    isFeatured: false
  },
  {
    id: 'serv-10',
    title: 'Travaux de vitrage & façades',
    titleHt: 'Travay vitraj & fasad',
    titleEn: 'Glazing & Facade Works',
    shortDesc: 'Remplacement de vitres cassées, vitrines de magasins et habillages muraux vitrés.',
    fullDesc: 'Service d’intervention rapide pour sécuriser et rénover vos vitrines de commerce, bureaux et résidences privées partout en Haïti.',
    icon: 'Building2',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    features: ['Vitrines commerciales', 'Remplacement d’urgence', 'Films de protection solaire', 'Vitrages anti-effraction'],
    order: 10,
    isFeatured: false
  },
  {
    id: 'serv-11',
    title: "Travaux d'aluminium & structures",
    titleHt: 'Travay aliminyòm & estrikti',
    titleEn: 'Aluminium Structural Works',
    shortDesc: 'Fabrication de cloisons amovibles, garde-corps, verrières et fermetures de vérandas.',
    fullDesc: 'Solutions techniques et légères en aluminium pour structurer vos espaces professionnels et résidentiels avec style et solidité.',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    features: ['Cloisons de bureaux modulaires', 'Garde-corps vitrés sur rail alu', 'Pergolas et toitures vitrées', 'Structures autoportantes'],
    order: 11,
    isFeatured: false
  },
  {
    id: 'serv-12',
    title: 'Prise de mesures à domicile & sur chantier',
    titleHt: 'Pran mezi sou chantye',
    titleEn: 'On-Site Measurements',
    shortDesc: 'Relevé précis de vos cotes par nos métreurs expérimentés avec équipement laser.',
    fullDesc: 'Nous nous déplaçons directement chez vous pour inspecter les ouvertures, vérifier les niveaux et garantir un dimensionnement irréprochable.',
    icon: 'Ruler',
    image: '/assets/haitian_installation_team.jpg',
    features: ['Prise de cote laser de précision', 'Diagnostic des supports et maçonneries', 'Conseils sur les ouvertures', 'Déplacement à Petit-Goâve et environs'],
    order: 12,
    isFeatured: false
  },
  {
    id: 'serv-13',
    title: 'Solutions sur mesure & ingénierie',
    titleHt: 'Solisyon sou mezi & enjenyri',
    titleEn: 'Custom Engineering & Solutions',
    shortDesc: 'Études techniques, calculs de charge de vent et plans d’exécution personnalisés.',
    fullDesc: 'Notre bureau technique étudie vos plans d’architecte et propose les meilleures alternatives en termes de coûts, de durabilité et d’esthétique.',
    icon: 'FileText',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    features: ['Conception 2D/3D détaillée', 'Optimisation des coûts matières', 'Adaptation aux contraintes du bâtiment', 'Accompagnement d’architectes'],
    order: 13,
    isFeatured: true
  },
  {
    id: 'serv-14',
    title: "Conseils d'experts & devis gratuit",
    titleHt: 'Konsèy ekspè & devis gratis',
    titleEn: 'Expert Consultation & Free Quote',
    shortDesc: 'Orientation personnalisée dans le choix des verres, épaisseurs, finitions et quincaillerie.',
    fullDesc: 'Bénéficiez de l’expérience de GLOBAL GLASS AND WINDOWS pour choisir les matériaux les plus adaptés à vos besoins et à votre budget.',
    icon: 'Lightbulb',
    image: '/assets/haitian_delivery_team_truck.jpg',
    features: ['Devis détaillé sous 24h', 'Échantillons de verre et profilés', 'Conseils d’entretien', 'Service après-vente dédié'],
    order: 14,
    isFeatured: false
  }
];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_VIDEOS: VideoItem[] = [];

export const INITIAL_REVIEWS: CommentReview[] = [
  {
    id: 'rev-1',
    firstName: 'Jean-Marc',
    lastName: 'Célestin',
    email: 'jm.celestin@gmail.com',
    phone: '(509) 3788-1234',
    rating: 5,
    comment: 'Travail impeccable pour les portes vitrées et les fenêtres de ma maison à Petit-Goâve. L’équipe est ponctuelle, professionnelle et les finitions en aluminium sont impeccables. Je recommande vivement GLOBAL GLASS AND WINDOWS !',
    status: 'approved',
    isFeatured: true,
    projectType: 'Portes & Fenêtres Résidentielles',
    date: '2026-02-12'
  },
  {
    id: 'rev-2',
    firstName: 'Marie',
    lastName: 'Dorval',
    email: 'dorval.marie@hotmail.com',
    phone: '(509) 4890-5678',
    rating: 5,
    comment: 'J’ai commandé un grand miroir mural biseauté pour mon salon de coiffure. Le résultat dépasse mes attentes. Le slogan dit vrai : ma pièce a complètement changé de vue !',
    status: 'approved',
    isFeatured: true,
    projectType: 'Miroir Mural Sur Mesure',
    date: '2026-02-18'
  },
  {
    id: 'rev-3',
    firstName: 'Ingénieur Patrick',
    lastName: 'Auguste',
    email: 'p.auguste.btp@gmail.com',
    phone: '(509) 3450-9988',
    rating: 5,
    comment: 'En tant qu’entrepreneur en construction, je collabore régulièrement avec GLOBAL GLASS AND WINDOWS pour la fourniture de profilés alu et verre sécurit. Prix très compétitifs et livraison rapide avec leur camion.',
    status: 'approved',
    isFeatured: true,
    projectType: 'Fourniture Chantier BTP',
    date: '2026-02-26'
  },
  {
    id: 'rev-4',
    firstName: 'Fabienne',
    lastName: 'Pierre-Louis',
    email: 'fabienne.pl@yahoo.fr',
    phone: '(509) 4200-1122',
    rating: 5,
    comment: 'Superbe douche en verre trempé installée chez moi. Très bonne écoute du responsable et conseils d’experts sur le choix des ferrures inox.',
    status: 'approved',
    isFeatured: false,
    projectType: 'Cabine de Douche',
    date: '2026-03-01'
  }
];

export const INITIAL_SETTINGS: CompanySettings = {
  companyName: 'GLOBAL GLASS AND WINDOWS',
  tagline: "Changer de vue et de vie en un clin d'œil !",
  taglineSecondary: "Vente, fabrication et solutions sur mesure en verre, miroirs, fenêtres, portes et aluminium.",
  aboutText: "GLOBAL GLASS AND WINDOWS est une entreprise haïtienne leader dans la transformation du verre architectural, la menuiserie aluminium et la fabrication sur mesure. Établie à Borne Soldat, Petit-Goâve, notre société met à votre disposition un savoir-faire artisanal de pointe, des matériaux certifiés et une flotte logistique prête à intervenir partout où la lumière et le design ont leur place.",
  aboutMission: "Fournir aux particuliers, architectes et entrepreneurs des solutions de vitrage et d’aluminium alliant esthétique, sécurité, durabilité et précision technique.",
  aboutVision: "Devenir la référence incontournable en Haïti pour tous travaux de verre moderne et menuiserie métallique haut de gamme.",
  aboutValues: [
    'Qualité supérieure & matériaux durables',
    'Fabrication artisanale sur mesure au millimètre',
    'Conseils d’experts transparents & écoute',
    'Service de livraison & installation rapide'
  ],
  address: 'Rte Nle #2, Borne Soldat',
  addressDetails: 'En face de la zone commerciale, Petit-Goâve, Haïti',
  city: 'Petit-Goâve',
  country: 'Haïti',
  gpsCoordinates: {
    lat: 18.4312,
    lng: -72.8624,
    mapsUrl: 'https://maps.google.com/?q=18.4312,-72.8624'
  },
  phone1: '(509) 4467-5506',
  phone2: '3599-5664',
  phone3: '2910-1818',
  whatsappNumber: '+50944675506',
  whatsappDefaultMessage: 'Bonjour GLOBAL GLASS AND WINDOWS, je souhaite obtenir des informations sur vos produits et services.',
  email: 'globalglassandw.2023@gmail.com',
  openingHours: {
    days: 'Lundi – Samedi',
    hours: '7h30 – 16h00',
    note: 'Fermé le Dimanche. Service d’urgence vitrerie sur rendez-vous.'
  },
  glassPricePerSqFt: {
    clear6mm: 4.5,
    clear8mm: 6.5,
    clear10mm: 8.5,
    clear12mm: 11.0,
    tintedBronze: 7.5,
    tintedGrey: 7.5,
    mirror4mm: 5.5,
    mirror6mm: 7.8,
    laminated6mm: 9.5,
    tempered10mm: 13.0
  },
  currency: 'USD',
  socialLinks: {
    facebook: 'https://facebook.com/globalglassandwindows',
    whatsapp: 'https://wa.me/50944675506',
    instagram: 'https://instagram.com/globalglasswindows',
    tiktok: 'https://tiktok.com/@globalglasswindows',
    youtube: 'https://youtube.com/@globalglasswindows',
    linkedin: ''
  },
  seo: {
    metaTitle: 'GLOBAL GLASS AND WINDOWS — Vente, Fabrication & Pose de Verre et Aluminium à Petit-Goâve',
    metaDescription: 'Site officiel de GLOBAL GLASS AND WINDOWS. Vente et fabrication de vitres, miroirs, fenêtres, portes en verre, profilés aluminium et accessoires à Petit-Goâve, Haïti.',
    keywords: 'verre Haïti, fenêtres aluminium Petit-Goâve, miroir sur mesure, porte vitrée, quincaillerie vitrage, Borne Soldat, GLOBAL GLASS AND WINDOWS',
    ogImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  homeSections: {
    hero: true,
    carousel: true,
    companySpotlight: true,
    products: true,
    services: true,
    projects: true,
    videos: true,
    calculator: true,
    reviews: true,
    quoteForm: true,
    contact: true
  }
};

export const INITIAL_ADMINS: UserAdmin[] = [
  {
    id: 'admin-super',
    name: 'Directeur Global Glass',
    email: 'admin@globalglass.ht',
    role: 'super_admin',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'admin-manager',
    name: 'Responsable Technique',
    email: 'atelier@globalglass.ht',
    role: 'admin',
    createdAt: '2026-01-05T00:00:00Z'
  },
  {
    id: 'admin-moderator',
    name: 'Modérateur Avis & Devis',
    email: 'contact@globalglass.ht',
    role: 'moderator',
    createdAt: '2026-01-10T00:00:00Z'
  }
];

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: 'quote-101',
    fullName: 'Robert Desrosiers',
    phone: '(509) 3812-4455',
    whatsapp: '(509) 3812-4455',
    email: 'r.desrosiers@gmail.com',
    address: 'Acul, Route Nationale #2',
    city: 'Petit-Goâve',
    productOrService: 'Portes & Fenêtres en Verre',
    dimensions: {
      lengthInches: 80,
      widthInches: 48,
      areaSqFt: 26.67
    },
    quantity: 3,
    glassType: 'Verre teinté bronze 8mm',
    description: 'Besoin de 3 fenêtres coulissantes en aluminium blanc avec moustiquaires intégrées pour ma maison de campagne.',
    budgetEstimate: '800 - 1200 USD',
    attachments: [],
    status: 'in_review',
    notes: 'Client contacté par téléphone le 01/03. Visite sur chantier prévue samedi matin.',
    createdAt: '2026-03-01T09:30:00Z'
  },
  {
    id: 'quote-102',
    fullName: 'Clinique Médicale Saint-Luc',
    phone: '(509) 2911-7788',
    email: 'admin@saintluc-medical.ht',
    address: 'Centre Ville',
    city: 'Petit-Goâve',
    productOrService: 'Porte Vitrée Battante',
    dimensions: {
      lengthInches: 84,
      widthInches: 72,
      areaSqFt: 42
    },
    quantity: 2,
    glassType: 'Verre trempé dépoli 10mm',
    description: 'Deux portes vitrées doubles avec ferme-portes hydrauliques pour l’entrée principale et la salle d’attente.',
    budgetEstimate: '1500 USD',
    attachments: [],
    status: 'quoted',
    notes: 'Devis officiel envoyé par email avec plan technique.',
    createdAt: '2026-02-28T14:15:00Z'
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    fullName: 'Ing. Jacques Valbrun',
    email: 'j.valbrun@construct-haiti.com',
    phone: '(509) 4722-0099',
    subject: 'Demande de catalogue prix profilés aluminium en gros',
    message: 'Bonjour, nous avons un projet d’immeuble à Léogâne et souhaitons obtenir vos tarifs par barres de 6m pour les profilés aluminium anodisés noirs.',
    isRead: false,
    createdAt: '2026-03-01T11:20:00Z'
  }
];
