/**
 * XP Catalogue Flow — authoritative data from `Catalogue_XP_solutions.xlsx`.
 *
 * GENERATED FILE — edit the source Excel and run:
 *   python3 scripts/ingest-xp-catalogue-xlsx.py
 *
 * Structure:
 *   - `modules`: 55 modules + 7 new proposed (Consumer + Operator personas)
 *   - `consumerWorkMoments`: White-collar consumer journey moments → modules → solutions
 *   - `operatorMoments`: Operator journey moments → modules → solutions
 *   - `solutions`: All solutions with Excel descriptions + mapping flags
 */

export interface XpFlowModule {
  /** URL-safe slug derived from module name + persona */
  slug: string;
  /** Display name */
  name: string;
  /** Who owns this module journey — 'Consumer' or 'Operator' */
  persona: string | null;
  /** Description sourced from the Excel Modules tab */
  description: string;
  /** Solution names (Excel spelling) mapped to this module */
  solutions: string[];
  /** True when the module is marked as new/proposed (orange) */
  isNew: boolean;
}

export interface XpFlowMomentModule {
  module: string;
  solutions: string[];
}

export interface XpFlowMoment {
  name: string;
  modules: XpFlowMomentModule[];
}

export interface XpFlowSolutionMeta {
  description: string;
  mappedConsumerWC: boolean;
  mappedOperator: boolean;
}

export interface XpCatalogueFlow {
  modules: XpFlowModule[];
  consumerWorkMoments: XpFlowMoment[];
  operatorMoments: XpFlowMoment[];
  solutions: Record<string, XpFlowSolutionMeta>;
}

export const XP_CATALOGUE_FLOW: XpCatalogueFlow = {
  "modules": [
    {
      "slug": "parking-management-consumer",
      "name": "Parking Management",
      "persona": "Consumer",
      "description": "Smart parking system with real-time availability tracking, reservation capabilities, and automated access control for efficient space utilization.",
      "solutions": [
        "Pegasus",
        "Placer.ai",
        "Affluence"
      ],
      "isNew": false
    },
    {
      "slug": "wayfinding-consumer",
      "name": "Wayfinding",
      "persona": "Consumer",
      "description": "Interactive navigation system using digital maps, directional signage, and mobile integration to help users locate destinations within the building.",
      "solutions": [
        "My Village"
      ],
      "isNew": false
    },
    {
      "slug": "conciergerie-consumer",
      "name": "Conciergerie",
      "persona": "Consumer",
      "description": "Personalized concierge services providing assistance with reservations, errands, local recommendations, and lifestyle support for building occupants.",
      "solutions": [
        "Circles",
        "Sodexo WRX"
      ],
      "isNew": false
    },
    {
      "slug": "sustainability-awareness-consumer",
      "name": "Sustainability awareness",
      "persona": "Consumer",
      "description": "Educational programs and real-time data displays highlighting environmental impact, energy consumption, and green initiatives to promote eco-conscious behavior.",
      "solutions": [
        "Pavegen"
      ],
      "isNew": false
    },
    {
      "slug": "display-consumer",
      "name": "Display",
      "persona": "Consumer",
      "description": "Digital signage and information screens showing announcements, wayfinding, events, and real-time building data throughout the facility.",
      "solutions": [
        "Orbital Bloom"
      ],
      "isNew": false
    },
    {
      "slug": "digital-reception-consumer",
      "name": "Digital reception",
      "persona": "Consumer",
      "description": "Virtual reception desk with touchscreen interfaces for visitor check-in, directory services, and building information without physical staff.",
      "solutions": [
        "Neat frame",
        "HandTalk",
        "Blue Frog"
      ],
      "isNew": false
    },
    {
      "slug": "battery-charger-consumer",
      "name": "Battery charger",
      "persona": "Consumer",
      "description": "Charging stations for electric vehicles, e-bikes, and personal devices, promoting sustainable mobility and connectivity.",
      "solutions": [
        "Nono"
      ],
      "isNew": false
    },
    {
      "slug": "alternative-fandb-consumer",
      "name": "Alternative F&B",
      "persona": "Consumer",
      "description": "Non-traditional food and beverage options including healthy choices, specialty diets, and innovative catering solutions beyond standard offerings.",
      "solutions": [
        "Botrista",
        "Eat Curious",
        "Kumulus",
        "EBar beerwall",
        "Nespresso Intervallo",
        "Cubo",
        "Foodini",
        "SavorEat",
        "Bibak"
      ],
      "isNew": false
    },
    {
      "slug": "robots-consumer",
      "name": "Robots",
      "persona": "Consumer",
      "description": "Various automated robots performing tasks such as cleaning, security patrols, and assistance services to enhance building operations.",
      "solutions": [
        "Bear Robotics",
        "GoodBytz",
        "uServe Robot"
      ],
      "isNew": false
    },
    {
      "slug": "store-micromarket-consumer",
      "name": "Store / micromarket",
      "persona": "Consumer",
      "description": "Self-checkout convenience store or open market concept offering fresh food, snacks, and essentials available 24/7 within the building.",
      "solutions": [
        "Aifi",
        "Amazon JWO",
        "Zippin by Fujitsu"
      ],
      "isNew": false
    },
    {
      "slug": "ai-tray-scanning-consumer",
      "name": "AI tray scanning",
      "persona": "Consumer",
      "description": "Automated checkout system using AI to instantly recognize food items on trays, eliminating manual input and reducing wait times.",
      "solutions": [
        "Mashgin",
        "Trayvisor",
        "Deligo",
        "VisioLab"
      ],
      "isNew": false
    },
    {
      "slug": "advanced-smart-vending-consumer",
      "name": "Advanced / smart vending",
      "persona": "Consumer",
      "description": "Intelligent vending machines with cashless payment, product tracking, and personalized recommendations based on user preferences.",
      "solutions": [
        "Alberts",
        "Totem",
        "InReach",
        "Selecta",
        "Cubo",
        "Solato",
        "Smoodi",
        "Costa coffee machine"
      ],
      "isNew": false
    },
    {
      "slug": "delivery-robots-consumer",
      "name": "Delivery Robots",
      "persona": "Consumer",
      "description": "Autonomous robots that transport food, packages, and supplies throughout the building, improving efficiency and reducing human touchpoints.",
      "solutions": [
        "Kiwibot",
        "Starship",
        "Ottonomy"
      ],
      "isNew": false
    },
    {
      "slug": "digital-xp-consumer",
      "name": "Digital XP",
      "persona": "Consumer",
      "description": "Integrated digital experience platform connecting all building services through mobile apps and interactive displays for seamless user engagement.",
      "solutions": [
        "Everyday",
        "Sodexo Direct",
        "Eat Curious"
      ],
      "isNew": false
    },
    {
      "slug": "robot-cooking-consumer",
      "name": "Robot cooking",
      "persona": "Consumer",
      "description": "Robots de cuisine on-demand préparant des plats chauds et personnalisés à la demande, sans cuisinier dédié.",
      "solutions": [
        "Adial pizzador",
        "SavorEat",
        "Botrista"
      ],
      "isNew": true
    },
    {
      "slug": "hydration-water-consumer",
      "name": "Hydration / Water",
      "persona": "Consumer",
      "description": "Solutions de distribution d'eau de qualité, filtrée ou aromatisée, alternatives durables aux bouteilles plastiques.",
      "solutions": [
        "Aquablu",
        "Aqualibra",
        "Kumulus"
      ],
      "isNew": true
    },
    {
      "slug": "room-booking-consumer",
      "name": "Room booking",
      "persona": "Consumer",
      "description": "Digital reservation system for meeting rooms, collaborative spaces, and amenities with real-time availability and integrated calendars.",
      "solutions": [
        "K1nect",
        "Keystone",
        "MyDevices"
      ],
      "isNew": false
    },
    {
      "slug": "service-request-consumer",
      "name": "Service Request",
      "persona": "Consumer",
      "description": "Centralized platform for submitting and tracking maintenance requests, IT support, and facility services with automated ticketing and updates.",
      "solutions": [
        "Sodexo WRX",
        "MyDevices"
      ],
      "isNew": false
    },
    {
      "slug": "feedback-consumer",
      "name": "Feedback",
      "persona": "Consumer",
      "description": "User feedback collection system allowing occupants to rate services, report issues, and share suggestions for continuous improvement.",
      "solutions": [
        "Qualtrics",
        "Tawny",
        "Emoticonnect"
      ],
      "isNew": false
    },
    {
      "slug": "catering-consumer",
      "name": "Catering",
      "persona": "Consumer",
      "description": "On-demand food ordering and delivery services for meetings, events, and individual meals with customizable menu options.",
      "solutions": [
        "Everyday",
        "Sodexo WRX"
      ],
      "isNew": false
    },
    {
      "slug": "circular-economy-consumer",
      "name": "Circular economy",
      "persona": "Consumer",
      "description": "Waste reduction initiatives including recycling programs, composting, reusable containers, and sustainable resource management practices.",
      "solutions": [
        "CircularPlace"
      ],
      "isNew": false
    },
    {
      "slug": "gym-consumer",
      "name": "Gym",
      "persona": "Consumer",
      "description": "Fitness facilities equipped with exercise equipment, wellness programs, and sometimes personal training services for building occupants.",
      "solutions": [
        "Neurabody",
        "Somatic",
        "Relearn (Nando) IH"
      ],
      "isNew": false
    },
    {
      "slug": "air-quality-consumer",
      "name": "Air quality",
      "persona": "Consumer",
      "description": "Real-time monitoring and display of indoor air quality metrics including CO2, temperature, and humidity to ensure optimal workspace conditions.",
      "solutions": [
        "Bioteos",
        "Oxygen at work",
        "Sensio Air",
        "Airomas"
      ],
      "isNew": false
    },
    {
      "slug": "alternative-fandb-consumer-2",
      "name": "Alternative F&B",
      "persona": "Consumer",
      "description": "Non-traditional food and beverage options including healthy choices, specialty diets, and innovative catering solutions beyond standard offerings.",
      "solutions": [
        "Smoodi",
        "Aqualibra",
        "Aquablu",
        "Bibak"
      ],
      "isNew": false
    },
    {
      "slug": "snacking-consumer",
      "name": "Snacking",
      "persona": "Consumer",
      "description": "Convenient access to healthy snacks, beverages, and quick food options through vending, micro-markets, or self-service stations.",
      "solutions": [
        "Cubo",
        "Solato",
        "Alberts"
      ],
      "isNew": false
    },
    {
      "slug": "physical-health-consumer",
      "name": "Physical health",
      "persona": "Consumer",
      "description": "Wellness initiatives promoting physical activity, ergonomic workspaces, health screenings, and fitness challenges for occupant wellbeing.",
      "solutions": [
        "Metronaps",
        "Neurabody"
      ],
      "isNew": false
    },
    {
      "slug": "mental-health-consumer",
      "name": "Mental health",
      "persona": "Consumer",
      "description": "Resources and programs supporting psychological wellbeing including quiet rooms, meditation spaces, counseling services, and stress management tools.",
      "solutions": [
        "Tawny"
      ],
      "isNew": false
    },
    {
      "slug": "cleaning-efficiency-operator",
      "name": "Cleaning efficiency",
      "persona": "Operator",
      "description": "Smart cleaning management using IoT sensors, scheduled optimization, and performance tracking to maintain hygiene standards while reducing resource consumption.",
      "solutions": [
        "Blue Ocean",
        "TAQT",
        "Lionsbot",
        "Gausium",
        "ABS Urizap",
        "Hivebotics",
        "Somatic"
      ],
      "isNew": false
    },
    {
      "slug": "iot-operator",
      "name": "IOT",
      "persona": "Operator",
      "description": "Internet of Things sensors and connected devices collecting data from equipment, spaces, and systems to enable smart automation and informed decision-making.",
      "solutions": [
        "Toolsense",
        "MyDevices"
      ],
      "isNew": false
    },
    {
      "slug": "energy-management-operator",
      "name": "Energy management",
      "persona": "Operator",
      "description": "Intelligent monitoring and control system tracking energy consumption across facilities, identifying savings opportunities, and optimizing usage patterns for sustainability.",
      "solutions": [
        "Cool Roof",
        "REPG"
      ],
      "isNew": false
    },
    {
      "slug": "maintenance-and-asset-mgmt-operator",
      "name": "Maintenance & Asset mgmt",
      "persona": "Operator",
      "description": "GMAO et outils de gestion du cycle de vie des équipements pour planifier, suivre et optimiser les interventions préventives et curatives.",
      "solutions": [
        "Pegasus",
        "KTV working drone",
        "Toolsense"
      ],
      "isNew": true
    },
    {
      "slug": "reception-operator",
      "name": "Reception",
      "persona": "Operator",
      "description": "Front desk services managing visitor welcome, check-in procedures, inquiries, and first-point-of-contact support for building occupants and guests.",
      "solutions": [
        "Blue Frog"
      ],
      "isNew": false
    },
    {
      "slug": "training-operator",
      "name": "Training",
      "persona": "Operator",
      "description": "Employee development programs including onboarding, skill enhancement, safety protocols, and continuous education to ensure workforce competency and engagement.",
      "solutions": [
        "Visionaries777",
        "VR Kitchen Training",
        "Relearn (Nando) IH"
      ],
      "isNew": false
    },
    {
      "slug": "work-order-management-operator",
      "name": "Work Order Management",
      "persona": "Operator",
      "description": "Digital ticketing system for maintenance requests, facility issues, and service tasks with priority assignment, tracking, and completion verification.",
      "solutions": [
        "Inspekly",
        "SoCampus",
        "SALUS",
        "Sodexo WRX"
      ],
      "isNew": false
    },
    {
      "slug": "sustainability-measured-operator",
      "name": "Sustainability measured",
      "persona": "Operator",
      "description": "Tracking and reporting system quantifying environmental impact through metrics like carbon footprint, waste diversion, water usage, and energy consumption.",
      "solutions": [
        "SEA",
        "Kikleo",
        "Leanpath"
      ],
      "isNew": false
    },
    {
      "slug": "real-time-insights-operator",
      "name": "Real time insights",
      "persona": "Operator",
      "description": "Live dashboard displaying operational metrics, performance indicators, and facility data enabling immediate decision-making and proactive issue resolution.",
      "solutions": [
        "4site",
        "DBFM",
        "Wobot",
        "Brand performance",
        "Placer.ai"
      ],
      "isNew": false
    },
    {
      "slug": "space-planning-operator",
      "name": "Space planning",
      "persona": "Operator",
      "description": "Data-driven workspace optimization analyzing utilization patterns, occupancy rates, and user needs to maximize efficiency and improve layout configurations.",
      "solutions": [
        "Placer.ai",
        "Affluence",
        "VisioLab"
      ],
      "isNew": false
    },
    {
      "slug": "circular-economy-operator",
      "name": "Circular economy",
      "persona": "Operator",
      "description": "A regenerative model that eliminates waste and keeps resources in use as long as possible, closing the loop across operations and supply chains.",
      "solutions": [
        "CircularPlace"
      ],
      "isNew": false
    },
    {
      "slug": "visitor-management-and-access-control-operator",
      "name": "Visitor Management & Access control",
      "persona": "Operator",
      "description": "Integrated security system managing guest registration, badge issuance, access permissions, and real-time monitoring for building safety and compliance.",
      "solutions": [
        "K1nect",
        "Keystone",
        "Noponto"
      ],
      "isNew": false
    },
    {
      "slug": "footfall-and-space-analytics-operator",
      "name": "Footfall & Space analytics",
      "persona": "Operator",
      "description": "Analyse des flux de visiteurs et comportements dans les espaces pour orienter les décisions d'aménagement et de staffing.",
      "solutions": [
        "Affluence",
        "Placer.ai",
        "Brand performance"
      ],
      "isNew": true
    },
    {
      "slug": "workforce-management-operator",
      "name": "Workforce management",
      "persona": "Operator",
      "description": "Staff scheduling, time tracking, and resource allocation platform optimizing labor deployment, managing shift coverage, and ensuring adequate staffing levels.",
      "solutions": [
        "Powerchef",
        "Foresight HR",
        "Noponto",
        "SoPro AI"
      ],
      "isNew": false
    },
    {
      "slug": "price-management-operator",
      "name": "Price management",
      "persona": "Operator",
      "description": "Dynamic pricing system analyzing costs, demand, and market trends to optimize profitability while maintaining competitive and fair pricing strategies.",
      "solutions": [
        "VusionGroup",
        "GoSpot check",
        "Pricing",
        "Keystone"
      ],
      "isNew": false
    },
    {
      "slug": "food-safety-operator",
      "name": "Food Safety",
      "persona": "Operator",
      "description": "Digital monitoring and compliance tools ensuring proper food handling, temperature control, hygiene standards, and regulatory requirements throughout the supply chain.",
      "solutions": [
        "icertainty",
        "Cluix",
        "Wobot",
        "VR Kitchen Training"
      ],
      "isNew": false
    },
    {
      "slug": "hr-and-staff-management-operator",
      "name": "HR & Staff management",
      "persona": "Operator",
      "description": "Outils RH spécialisés restauration et FM : pointage, plannings, formation et suivi de la performance des équipes.",
      "solutions": [
        "Noponto",
        "SoPro AI",
        "Wando",
        "Relearn (Nando) IH"
      ],
      "isNew": true
    },
    {
      "slug": "3d-printing-operator",
      "name": "3D Printing",
      "persona": "Operator",
      "description": "On-demand additive manufacturing technology for creating custom parts, prototypes, and specialized equipment directly on-site, reducing lead times and costs.",
      "solutions": [
        "Foodini"
      ],
      "isNew": false
    },
    {
      "slug": "automated-food-processing-operator",
      "name": "Automated food processing",
      "persona": "Operator",
      "description": "Robotic systems and smart equipment that automate food preparation, cooking, and portioning to increase consistency, efficiency, and food safety.",
      "solutions": [
        "Sormac",
        "GoodBytz",
        "Eatch",
        "Botinkit",
        "Beyond Oil"
      ],
      "isNew": false
    },
    {
      "slug": "real-time-insights-operator-2",
      "name": "Real time insights",
      "persona": "Operator",
      "description": "Live dashboard displaying operational metrics, performance indicators, and facility data enabling immediate decision-making and proactive issue resolution.",
      "solutions": [
        "4site",
        "SoPro AI",
        "VisioLab"
      ],
      "isNew": false
    },
    {
      "slug": "waste-management-operator",
      "name": "Waste management",
      "persona": "Operator",
      "description": "Systematic approach to waste collection, sorting, recycling, and disposal with tracking analytics to reduce landfill contribution and promote sustainability.",
      "solutions": [
        "Kikleo",
        "Leanpath",
        "Notpla",
        "DBFM",
        "BOXXTECH",
        "DishTracker",
        "Trayvisor"
      ],
      "isNew": false
    },
    {
      "slug": "menu-planning-operator",
      "name": "Menu planning",
      "persona": "Operator",
      "description": "Digital tools for creating balanced, diverse menus with nutritional analysis, dietary accommodation, seasonal ingredients, and customer preference integration.",
      "solutions": [
        "Menu AI",
        "Powerchef",
        "Product Swap",
        "SoPro AI"
      ],
      "isNew": false
    },
    {
      "slug": "food-delivery-serving-operator",
      "name": "Food delivery / serving",
      "persona": "Operator",
      "description": "Automated or streamlined systems for distributing meals including robotic delivery, smart lockers, and efficient serving solutions for cafeterias and offices.",
      "solutions": [
        "Bear Robotics",
        "uServe Robot"
      ],
      "isNew": false
    },
    {
      "slug": "inventory-management-operator",
      "name": "Inventory management",
      "persona": "Operator",
      "description": "Real-time tracking system for food stocks, supplies, and equipment with automated reordering, expiration alerts, and waste reduction analytics.",
      "solutions": [
        "Zebra Smartgloves"
      ],
      "isNew": false
    },
    {
      "slug": "quality-operator",
      "name": "Quality",
      "persona": "Operator",
      "description": "Comprehensive quality control processes including regular inspections, customer feedback analysis, and continuous improvement protocols to maintain service excellence.",
      "solutions": [
        "Qualipad",
        "Wobot"
      ],
      "isNew": false
    },
    {
      "slug": "hygiene-and-sanitation-operator",
      "name": "Hygiene & Sanitation",
      "persona": "Operator",
      "description": "Solutions de nettoyage et d'hygiénisation des équipements et espaces cuisine, avec traçabilité des interventions.",
      "solutions": [
        "Instarinse",
        "Realco",
        "Lesieur",
        "Greese to goodness",
        "BOXXTECH"
      ],
      "isNew": true
    },
    {
      "slug": "circular-and-upcycling-operator",
      "name": "Circular & Upcycling",
      "persona": "Operator",
      "description": "Valorisation des déchets organiques et emballages : compostage, biogaz, emballages biosourcés et économie circulaire.",
      "solutions": [
        "Ecoloop",
        "Les alchimistes",
        "Releaf Paper",
        "Notpla",
        "Zeroimpack",
        "Greese to goodness"
      ],
      "isNew": true
    }
  ],
  "consumerWorkMoments": [
    {
      "name": "Commute",
      "modules": [
        {
          "module": "Parking Management",
          "solutions": []
        },
        {
          "module": "Wayfinding",
          "solutions": [
            "My Village"
          ]
        }
      ]
    },
    {
      "name": "Welcome Area",
      "modules": [
        {
          "module": "Conciergerie",
          "solutions": [
            "Circles",
            "Sodexo WRX"
          ]
        },
        {
          "module": "Sustainability awareness",
          "solutions": [
            "Pavegen"
          ]
        },
        {
          "module": "Display",
          "solutions": [
            "Orbital bloom"
          ]
        },
        {
          "module": "Digital reception",
          "solutions": [
            "Neatframe",
            "Handtalk",
            "Bluefrog"
          ]
        },
        {
          "module": "Battery charger",
          "solutions": [
            "nono"
          ]
        }
      ]
    },
    {
      "name": "F&B",
      "modules": [
        {
          "module": "Alternative F&B",
          "solutions": [
            "Arsene",
            "Eatcurious",
            "Kumulus",
            "Ebar beerwall ( Live!)",
            "Nespresso Intervallo",
            "Cubo",
            "Foodini ( Health )",
            "SavorEat"
          ]
        },
        {
          "module": "Robots",
          "solutions": [
            "Botrista",
            "Goodbytz",
            "Bear robotic",
            "Userve"
          ]
        },
        {
          "module": "store/ micromarket",
          "solutions": [
            "Aifi",
            "Amazon JWO"
          ]
        },
        {
          "module": "AI tray scanning",
          "solutions": [
            "Mashgin",
            "Trayvisor",
            "Deligo"
          ]
        },
        {
          "module": "advanced/ smart vending",
          "solutions": [
            "Alberts",
            "Totem",
            "InReach",
            "Selecta",
            "Cubo",
            "Solato"
          ]
        },
        {
          "module": "Delivery Robots",
          "solutions": [
            "Kiwibot",
            "Starship",
            "Ottonomy"
          ]
        },
        {
          "module": "Digital XP",
          "solutions": [
            "Everyday",
            "Sodexo WRX",
            "SoEze",
            "My Village",
            "Toqla",
            "Sodexo Direct"
          ]
        }
      ]
    },
    {
      "name": "WP",
      "modules": [
        {
          "module": "Concierge",
          "solutions": [
            "Circles",
            "Sodexo WRX"
          ]
        },
        {
          "module": "Room booking",
          "solutions": []
        },
        {
          "module": "Service Request",
          "solutions": [
            "Sodexo WRX",
            "Mydevices"
          ]
        },
        {
          "module": "Feedback",
          "solutions": [
            "Qualtrics",
            "Tawny"
          ]
        },
        {
          "module": "Catering",
          "solutions": [
            "Everyday",
            "Sodexo WRX"
          ]
        },
        {
          "module": "Circular economy",
          "solutions": [
            "Circular place"
          ]
        }
      ]
    },
    {
      "name": "Wellbeing",
      "modules": [
        {
          "module": "Gym",
          "solutions": []
        },
        {
          "module": "Air quality",
          "solutions": [
            "Bioteos",
            "Oxygen at work",
            "Sensio Air",
            "Airomas"
          ]
        },
        {
          "module": "Alternative F&B",
          "solutions": []
        },
        {
          "module": "Snacking",
          "solutions": [
            "Cubo",
            "Solato",
            "Alberts"
          ]
        },
        {
          "module": "Physical health",
          "solutions": [
            "metronaps",
            "neurabody"
          ]
        },
        {
          "module": "Mental health",
          "solutions": [
            "Tawny"
          ]
        }
      ]
    }
  ],
  "operatorMoments": [
    {
      "name": "FMChecking round",
      "modules": [
        {
          "module": "Cleaning efficiency",
          "solutions": [
            "Blue Ocean",
            "TAQT",
            "Lionsbot",
            "Gausium",
            "ABS Urizap",
            "Hivebotics",
            "KTV working drone"
          ]
        },
        {
          "module": "IOT",
          "solutions": [
            "Toolsense",
            "Mydevices"
          ]
        },
        {
          "module": "Energy management",
          "solutions": [
            "Coolroof",
            "REPG"
          ]
        }
      ]
    },
    {
      "name": "Kick off & early check",
      "modules": [
        {
          "module": "Reception",
          "solutions": [
            "Bluefrog"
          ]
        },
        {
          "module": "Training",
          "solutions": [
            "Visionaries 77",
            "VR Kitchen training"
          ]
        }
      ]
    },
    {
      "name": "Office time",
      "modules": [
        {
          "module": "Work Order Management",
          "solutions": [
            "Inspekly",
            "SoCampus",
            "Salus",
            "Sodexo WRX",
            "MyApps"
          ]
        },
        {
          "module": "sustainability measured",
          "solutions": [
            "SEA",
            "Kikleo",
            "Leanpath"
          ]
        },
        {
          "module": "Real time insights",
          "solutions": [
            "4site",
            "DBFM",
            "Wobot",
            "MyApps",
            "Wando D&I"
          ]
        },
        {
          "module": "Space planning",
          "solutions": []
        },
        {
          "module": "Circular economy",
          "solutions": [
            "Circular place"
          ]
        },
        {
          "module": "Visitor Management & Accesscontrol",
          "solutions": []
        }
      ]
    },
    {
      "name": "Order, planning & maintenance management",
      "modules": [
        {
          "module": "Workforce management",
          "solutions": [
            "Powerchef",
            "Foresight HR"
          ]
        },
        {
          "module": "Price management",
          "solutions": [
            "Vusion Group",
            "GoSpot check",
            "Pricing"
          ]
        },
        {
          "module": "Food Safety",
          "solutions": [
            "icertainty",
            "Cluix",
            "Wobot",
            "VR kitchen training"
          ]
        }
      ]
    },
    {
      "name": "F&B",
      "modules": [
        {
          "module": "3D Printing",
          "solutions": [
            "Foodini"
          ]
        },
        {
          "module": "Automated food processing",
          "solutions": [
            "Sormac",
            "Goodbytz",
            "Eatch",
            "Bootingkit",
            "Notpla",
            "Emoticonnect"
          ]
        },
        {
          "module": "Real time insights",
          "solutions": [
            "4site",
            "B2B Platform"
          ]
        },
        {
          "module": "Waste management",
          "solutions": [
            "Kikleo",
            "Leanpath",
            "Notpla",
            "DBFM"
          ]
        },
        {
          "module": "Menu planning",
          "solutions": [
            "Menu AI"
          ]
        },
        {
          "module": "Food delivery /serving",
          "solutions": [
            "Bear robotic (HC)",
            "userve"
          ]
        },
        {
          "module": "Inventory management",
          "solutions": [
            "Zebra smart gloves"
          ]
        },
        {
          "module": "Quality",
          "solutions": [
            "Qualipad",
            "Wobot"
          ]
        }
      ]
    }
  ],
  "solutions": {
    "4site": {
      "description": "4site generates business insights to support our Sales and Operational teams during their conversations with clients. It embeds Artificial Intelligence and Machine Learning to provide us with the latest consumer and operational analytics, from sales trends and customer feedback analysis to mobile app engagement, to help us make informed decisions that improve your employees' experience. It combines data from our digital ordering apps like 'Everyday' from Salesforce and SAP. Everyone can collect data, we can make it talk on dimensions that are key to our clients’ strategic agenda",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "ABS- Urizap": {
      "description": "ABS provides bacterial treatmen​ts for waste and water management. URIZAP is a patented, world-first microbial formulation that eliminates urinal blockages and foul odours. Suitable for all types of urinals, it digests built-up uric acid without the need for harsh chemicals. One scoop a week, with one cup of water, is all it takes to maintain free-flowing urinals! ABS will help us save:_x000B_ • 8.4m litres of water_x000B_ • 33,600 litres of chemical usage_x000B_ • 12 tons of plastic, equalling 67 tonnes of CO2_x000B_ • 1,500 air fresheners, equalling 0.8 Tonnes of CO2_x000B_ • 7 tonnes of CO2 due to fewer urinal-related callouts",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Adial pizzador": {
      "description": "Adial delivers fully automated pizza vending machines that provide freshly cooked pizzas 24/7 in just three minutes. Each machine manages inventory, pricing, promotions, and sales tracking through an integrated backend, enabling reliable, low-touch foodservice operations. By combining speed, capacity, and automation, Adial creates a scalable solution for continuous hot food availability, generating additional revenue while meeting consumer expectations for convenience and quality with limited operational effort. Available in 22 countries.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Affluence": {
      "description": "An integrated solution to measure, forecast, communicate, and manage flows within buildings. It utilizes various sensors and data analysis techniques to measure real-time occupancy, predict foot traffic, recommend the fastest food option in real-time, manage bookings, virtual waiting lines but also to support security activities. Optimize space utilization, reallocate staff given real-time occupancy, improve visitors experience, enhance security through real-time flow management and predictive analytics. Use for the Olympics and at 2 CS sites.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Aifi": {
      "description": "AiFi provides AI-powered autonomous stores using computer vision technology that enables cashierless shopping experiences. Customers can enter, select items, and leave without checkout lines while the system tracks purchases automatically. The Sodexo partnership delivers these solutions to challenging locations like remote mining villages and high-traffic convention centers. The technology streamlines operations, reduces staffing needs, and provides valuable shopping behavior insights for retail optimization.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Airomas- Air freshener": {
      "description": "Professional Aromatization provided through programmable automated equipment or sprays that infuse pleasant fragrances in Sodexo restaurants and cafeterias. Better experience for the end consumer, directly impacting their perception of value, and increasing the desire for Sodexo products",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Alberts Smoothie and Soups Vending": {
      "description": "Alberts offers smart vending machines that serve personalized smoothies and soups made from frozen ingredients, ensuring freshness, zero food waste, and consistent quality. Consumers can customize recipes directly on the machine or via an app, while operators benefit from minimal maintenance, low water usage, and sustainable serving formats. The solution expands healthy food access with a scalable, low-effort, and eco-friendly model. Protein enriched and vegetal milk options also available.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Amazon JWO": {
      "description": "Just Walk Out technology allows shoppers to enter a store, grab whatever they want, and quickly get back to their day, without having to wait in a checkout line or stop at a cashier. The technology uses camera vision and sensor fusion, or RFID technology which allows them to simply walk away with their items. By removing the checkout, retailers can increase merchandising space, move more customers through the store, and provide a frictionless shopping experience.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Aquablu (IH)": {
      "description": "Aquablu offers a sustainable, smart alternative to bottled and canned beverages by dispensing still, sparkling, purified water enriched with vitamins, minerals, electrolytes, and natural flavors. The solution reduces single-use plastic and CO₂ emissions while delivering a healthier, customizable hydration experience on-site. Available in built-in or standalone formats, Aquablu combines premium design, real-time usage insights, and flexible deployment to enhance consumer experience and support sustainability goals at scale.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Aqualibra": {
      "description": "Aqualibra specializes in eco-friendly water treatment solutions, offering innovative technology for purification, filtration and flavour enhancement. The flavoured water station is stand alone or plumbed in. Sustainable, healthy and attractive hydration alternative to bottled / canned waters. Free from sugar, calories, colours and preservatives. Delivers data on real time usage & impact",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Bear Robotics": {
      "description": "The Servi robot supports table bussing and item delivery by autonomously transporting food, trays, and supplies between kitchen, dining, and patient areas. It helps fill front-of-house labor gaps, improves delivery speed, and reduces physical strain on staff. By offloading repetitive transport tasks, Servi enhances working conditions, extends service hours, and enables consistent service quality in environments facing staffing constraints.",
      "mappedConsumerWC": true,
      "mappedOperator": true
    },
    "Beyond Oil": {
      "description": "",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Bibak": {
      "description": "A smart kiosk with a deposit system for consumers to return reusable food packaging, along with reusable food bowls and lids in glass or plastic. QR codes on the bowls link to deposit amounts and content, with charges for non-return within 14 days. Works with credit card and employee badge. Smart kiosk and reusable food packaging solution streamline sustainability efforts, promoting reuse and reducing waste.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Bioteos": {
      "description": "Patented technology harnessing microalgae potential integrated into a 2.3-meter-high, 80-centimeter-wide column. OXYLON acts as a carbon sink using microalgae to purify ambient air BioteosX, capturing harmful particles and transforming them into harmless biomass through living organisms.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Blue Frog": {
      "description": "Buddy, an emotional robot with a friendly demeanor, engages users with its expressive features and interactive capabilities. Standing at 60 cm tall, Buddy offers emotional experiences when welcoming visitors, managing building’s access, entertaining seniors or providing educational content. Emotional engagement and valuable assistance in various settings, including offices, schools and public spaces. Significantly enhances user experience.",
      "mappedConsumerWC": true,
      "mappedOperator": true
    },
    "Blue ocean- UVD robots": {
      "description": "Self-driving disinfection robots using UV-C light in empty rooms in healthcare / pharmaceutical environments to eliminate pathogens such as bacteria, viruses and other harmful microorganisms. Ensures proper disinfection protocols are followed. Avoids exposing staff to UV light",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Botinkit": {
      "description": "Smart cooking assistant with automated and precise dispensing of all sauces, fats and spices along the cooking process, automated stirring, automated management of cooking temperatures and time, also guiding the user on when to add which ingredient of the recipe and in which quantity. Customizable recipes on the embedded screen or App and ability to produce up to 7kg batches. The pot is self-cleaning between 2 dishes. 100 units deployed and 1000 in production. It reduces waste, ensures consistent quality, and adapts to diverse culinary preferences",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Botrista": {
      "description": "Botrista provides automated beverage solutions to foodservice operators. Operators can increase ticket size and beverage attachment by serving non-alcoholic craft beverages to younger generation consumers. The trendy innovative craft beverages include boba teas, smoothies, iced coffee, flavored lemonades, energy drinks, and more. Importantly, data shows these new options drive overall drink sales higher without cannibalizing existing soda sales. Revolutionizing craft-beverage service through automation.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "BOXXTECH": {
      "description": "Secure vending machine for canned and bottled alcoholic beverages. Uses AI to determine age of guest and request additional identification, if needed. Can scan physical IDs as a secondary form of ID. Able to limit number of drinks sold in a certain time limit. Addresses pain point of long lines for drinks in stadiums / sporting arenas.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Brand performance": {
      "description": "As Sodexo increasingly operates branded food concepts across multiple regions, brand performance can vary significantly by site, format, and customer segment. Traditional reporting often lacks a consolidated, real time view of how brands are performing against their original business case. A centralized brand performance assessment solution enables brand owners to track financial, operational, and customer metrics in one place, supporting faster decisions, improved profitability, and a shift toward a data driven, brand led growth model.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Circles": {
      "description": "Circles by Sodexo is a premier workplace concierge and lifestyle service platform designed to enhance employee experience and well-being. With over 25 years of expertise, Circles offers tailored solutions that include: Assistance with everyday tasks such as dry cleaning, home repairs, & travel planning. Coordination of corporate events, team-building activities, and special occasions. Fostering a sense of belonging through social events and wellness programs. Providing resources to help employees manage work and personal life seamlessly. By integrating these services, Circles aims to create a supportive and engaging work environment that empowers employees to thrive both professionally and personally.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "CircularPlace": {
      "description": "CircularPlace is the all-in-one platform to give a second life to underused assets, reduce waste, and generate new revenue. This SaaS B2B platform empowers companies to turn reuse into a profitable opportunity through a comprehensive digital marketplace. The platform facilitates internal resource sharing and exchange, as well as external resale, donation to associations, and recycling. Users can easily add products using barcode scanning (EAN) and access a simple, fast and secure marketplace experience for managing unused assets across their organization.",
      "mappedConsumerWC": true,
      "mappedOperator": true
    },
    "Cluix": {
      "description": "CLUIX's IoT-enabled Water Quality Analyzer is a compact rechargeable solution for testing drinking water. Packed with features like Wi-Fi, Bluetooth, Touchscreen, Mobile app, GPS, and IP67 rating, it measures eight vital parameters using advanced methods such as colorimetry, potentiometry, conductivity, and nephelometry.Transmitting data in real-time, including GPS coordinates, to a central server enhances monitoring capabilities. It covers essential parameters such as turbidity, pH, chlorine levels, hardness, colour, dissolved solids, conductivity, lead, fluoride, iron, nitrate, and bacterial content",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Cool Roof": {
      "description": "Many buildings struggle with overheating during warm seasons, leading to uncomfortable indoor environments, higher energy consumption, and increased CO₂ emissions from cooling systems. Traditional insulation upgrades can be costly, disruptive, and difficult to implement across large surfaces. Facility teams need a practical solution to improve thermal comfort while reducing dependence on air conditioning. A simple, scalable approach is required to lower indoor temperatures, cut energy costs, and support sustainability goals without major structural changes. A white paint solution applied to rooftops, drastically reducing indoor temperatures during hot weather by -6°C to -7°Celsius. This innovative paint solution provides significant temperature reduction indoors, saving 36kg of CO2 per square meter over 20 years.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Costa coffee machine": {
      "description": "Premium self-serve hot, iced and cold drinks kiosk machine. Serving premium coffee fair-trade sourced that can come in multiple combinations with fresh milk, syrups, chocolate but also fruit smoothies. Costa ensure the cups recycling. 24/7 offer of premium quality coffee and various hot, iced and cold drinks without manpower. All fair-trade sourced",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Cubo": {
      "description": "Cubo is a compact beverage machine designed for workplace wellness programs and small-scale food service environments. Wellness beverages at the push of a button! A small, counter-top device that produces hot and cold wellness beverages in ~90 seconds. All products are vegan, GF, and clean label. Wellness beverages in under 2 minutes •Counter-top appliance – no water hook up needed •Pod based convenience •Self-cleaning machine •Categories: Enhanced Juices & Lattes, Hot Soups & Protein Shakes",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "DBFM": {
      "description": "DBFM is an advanced analytics platform that delivers comprehensive insights on governance, compliance, KPIs, financial performance, and onsite service demand. By providing a forward-looking perspective, it enables site managers to predict upcoming operational needs and adjust plans proactively. This predictive capability allows for optimized resource allocation, improved efficiency, and better-informed decision-making.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Deligo": {
      "description": "High-traffic canteens and micro-markets are under increasing pressure to serve more guests in less time, while coping with labor constraints, peak-hour congestion, and rising operating costs. Traditional staffed checkouts struggle to scale efficiently during demand spikes and often create bottlenecks that negatively impact the dining experience. There is a growing need for fast, reliable, and scalable self-checkout solutions that reduce queues, optimize staffing, and maintain a smooth, frictionless payment experience for consumers. Self-checkout solution for canteens or micro-markets. Powered by AI technology, it automatically recognizes a selection of products in just a few seconds for immediate billing. •Reduce queuing time. •Increase revenue. •Avoid hiring extras for periods with greater occupancy",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "DishTracker": {
      "description": "AI-based computer vision self-checkout solution for food establishments. It enables efficient SKU recognition through image input, with operational readiness achieved in just two weeks. •Reduce queuing time. •Increase revenue. •Avoid hiring extras for periods with greater occupancy. Can also leverage the built-in camera ofbasic tablets avoiding extra hardware",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Eat Curious": {
      "description": "Eat Curious offers a versatile range of plant-based dehydrated proteins from fava bean and chickpea. Free from the 14 major allergens (incl. soy and wheat), the products hydrate in 30 minutes and can be used for a variety of applications, from fully plant-based to hybrid dishes blended with meat. Once hydrated, it is more affordable than animal protein, provides a good source of protein and fibre, and can be stored ambiently with a long shelf life. Carbon footprint is only 1kg CO₂ per kg of hydrated product.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Eatch": {
      "description": "An autonomous robotic back-of-house solution designed for central production kitchens. Equipped with 40+ home-size self-cleaning pans, automated dispensers and sensors, it prepares significant volumes of hot meals with consistent chef-quality and 2 operators only. Deliver up to 900 Chef-quality meals of 300g per hour Enable greater variety of pan-fried recipes. Minimize food waste. 50% less energy usage. Reduced LTI rate.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "EBar beerwall": {
      "description": "EBAR Beerwall is a fully automated, self-service beer dispensing solution designed for high-traffic live venues. It delivers pints in under 30 seconds, significantly reducing queues while maximizing throughput and fan satisfaction. By optimizing pouring precision, Beerwall reduces keg waste and increases yield per keg, generating additional revenue with fewer staff and a consistent, premium self-serve experience.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Ecoloop": {
      "description": "Ecoloop provides a gamified recycling solution through smart collection machines for packaging such as PET bottles and cans. Users recycle items and earn points that can be redeemed for rewards like cashback, discounts, or benefits, driving higher recycling participation. The solution makes recycling easier and more engaging in the workplace, while strengthening sustainability awareness and customer engagement for Sodexo and its clients.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Emoticonnect": {
      "description": "Emoticonnect is a digital emotion intelligence platform that helps organizations measure, understand, and improve employee and customer emotional well being. By analyzing real time emotional signals and feedback, the platform provides actionable insights into engagement, satisfaction, and pain points. This enables organizations to move beyond traditional surveys, identify drivers of performance and well being, and take targeted actions to improve experience, trust, and operational effectiveness.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Everyday": {
      "description": "Everyday seamless digital experience makes it easy to enjoy healthy, delicious food at any time. From choice & convenience to seamless interactions, employees’ needs are covered, bringing the same delicious experience through dedicated channels: mobile, kiosk…​ With Everyday, we deliver cutting-edge FoodTech to enable authentic, inclusive and insights-led food experiences that elevate everyday moments​.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Foodini": {
      "description": "Innovative treatment based on a 3D-printed texture-modified diet. This technology provides the ability to manufacture healthy and nutritionally balanced food while restoring the desire to eat and quality perception. Improve the perception of food in while maintaining the safety factor for Senior people, Oncology unit patients, including Pediatrics or adults and another patient with dysphagia or swallowing problems.",
      "mappedConsumerWC": true,
      "mappedOperator": true
    },
    "Foresight HR": {
      "description": "Sodexo has a high turnover rate primarily due to the nature of our operations. In FY24, we had over 10,000 voluntary resignations. We developed ForesightHR, a predictive model of turnover. Understanding our employees better to prevent voluntary resignations through proactive action plans before the resignation occurs.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Gausium": {
      "description": "Self-navigating cleaning robots with different models for routine vacuuming or scrubbing of large flat floor surfaces (factory floor, lobby, corridors, conference room) by the self-navigating robots. •Enhances the cleaners productivity and enables to redeploy them to other tasks •Both robots can handle hard surfaces and the vacuuming robot also handles carpets •The robots self deploys and returns to docking station autonomously",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "GoodBytz": {
      "description": "Goodbytz revolutionizes food service with its versatile robotic kitchen, capable of cooking multiple fresh meals simultaneously in minutes. It streamlines operations, offers diverse culinary options, and provides convenient ordering and payment methods for consumers.",
      "mappedConsumerWC": true,
      "mappedOperator": true
    },
    "GoSpot check": {
      "description": "Revolutionary AI for planogram compliance. Survey accounts 75% faster with GoSpotCheck's mobile AI that detects, recognizes, and analyzes Products and prices from photos captured on shelves, displays, menus, back bars, and in coolers. Get real-time insights into position, price share, competitors, and out-of-stocks, so you can be smarter in the market and sell more, faster.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Greese to goodness": {
      "description": "Grease to Goodness is a sustainable waste management initiative targeting commercial kitchens and food service operations that generate large volumes of used cooking oil and organic food waste. Applied in restaurants, hotels, catering services, and institutional kitchens seeking environmentally responsible disposal solutions within circular economy frameworks, Grease to Goodness proposes environmental-friendly reuse of kitchen used oil and food waste, to transform them into sustainable, handmade soaps. Won the Sodexo internal “Innov Challenge”.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "HandTalk": {
      "description": "Virtual translator that ensures the description of texts and images on Sodexo_Net and our website for employees, suppliers, and customers. This new tool will allow users who access our website and need Libras (Brazilian Sign Language) to communicate to stay informed about our information and updates. Ensuring accessibility and autonomy",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Hivebotics": {
      "description": "Robotics startup that builds autonomous robotic arm cleaning solution. Early Mover. One of the first in the world building autonomous restroom cleaning robot with the other competitor solely focusing on US market. Industry partnership. The cleaning system is powered by Karcher which ensure the performance and reliability of our cleaning operation. Cleaning Quality Assurance. Built-in intelligence model can detect stains on restroom surfaces for more targeted cleaning. The model can also compare the cleanliness level before and after cleaning and generate report for site manager.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "icertainty": {
      "description": "Software and sensors for remote temperature monitoring, ensuring compliance and preventing food waste. It offers critical control point visibility, expiring product alerts, and integrates with Maximo for regulatory reporting. Streamlines temperature monitoring, saving time and ensuring compliance with a 4-5 month payback period. It prevents food waste, enhances operational efficiency, and offers worldwide availability.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "In reach (a sodexo brand)": {
      "description": "Smart fridges providing a convenient self-service solution for fresh food, packaged snacks and a variety of beverages at any time. Users can access the InReach smart fridge though an app, mobile wallet, or credit card, select items, and are charged accordingly upon purchase completion. A seamless and convenient shopping experience, allowing users to browse products, make selections, and complete purchases effortlessly through various payment methods.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Inspekly": {
      "description": "Offer indoor positioning in augmented reality through digital twins. Use cases examples: AI asset registration / self training / guiding staff to follow step by step routine maintenance / security / failure protocol / cleaning routines / CAD update, wayfinding by indicating most efficient route on a site, Remote site measurements 90% time saved in measuring equipment on site (vs physically) 90% reduction of resources required when counting equipment on site 30 % routine optimization with visual guidance to asset location 5% increased staff motivation with dynamic routine",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Instarinse (through Bunzl)": {
      "description": "A convenient cup rinsing solution that cleans reusable cups in just 15 seconds using only 25ml of water. With a modular design for easy maintenance and an 8-year lifecycle, it's available as a freestanding unit or can be embedded into worktops. Simplifies cup cleaning with rapid, water and electricity efficient rinsing compared to traditional cup washing methods., offering convenience for sustainable practices.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Intervallo- Nespresso": {
      "description": "Premium 24/7 self-serve hot and iced coffee, chocolate and milk-based drinks in multiple combinations and sizes (also works with consumer’s own cups). Offering 3 different origin of arabica grains (Columbia, Brazil, Guatemala), classic dairy or oat milk and 3 syrups. Consumer orders through digital screen or dedicated App. Payment works with badges, credit card, QR code or through the App. Provides regular data on consumption.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Sodexo WRX": {
      "description": "Sodexo Wrx acts as a one-stop platform for accessing Sodexo’s full ecosystem of services. Key features include: Food Services: online ordering, click & collect, delivery, personalized menus, and promotions. Facility Management: service requests, room reservations, maintenance follow-up. Workplace Experience: well-being programs, hospitality services, events, and employee perks. The app ensures consistency across geographies while adapting to local needs.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Keystone": {
      "description": "",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Kikleo": {
      "description": "Innovative tools based on AI and 3D cameras (wall-mounted or countertop) to automatically recognize wasted food on diner’s trays (or when thrown in garbage), providing precise data on wastage and avoiding the time-consuming step of manual weighing. Provides dashboard and monthly report with action list to reduce waste for site and can also engage consumers in real-time. Rolled-out at 160+ locations.​ Also able to tell nutritional intake when scanning the tray before and after the meal. Identify and record food waste in 3 seconds, offering granular data to help optimize menus and reduce overall waste.​ Food cost reduction is on average 20% the 1st year and up to 50% or more after 3 years.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "KTV working drone": {
      "description": "KTV Working Drone provides an autonomous drone-based solution for cleaning and maintaining high-rise façades, windows, solar panels, and other hard-to-reach surfaces. It uses purified or lightly treated water, controlled pressure, and precise navigation to clean safely and efficiently while avoiding scaffolding or rope access.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Kumulus": {
      "description": "A smart machine that produces 30-50L/day drinking water from ambient air, offering an autonomous, sustainable and cost efficiency water supply. Plug and play units equipped with filters and mineralization systems to deliver high quality potable water. Offers a sustainable alternative to bottled water, delivering water 30% to 50% cheaper and generating 10 times less CO2 emissions than bottled solutions.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Leanpath": {
      "description": "Leanpath’s WasteWatch is a smart scale and tablet system that makes tracking food waste simple and efficient. Staff place discarded food on the scale and press three buttons, and the system captures detailed data for analysis and reporting. By providing actionable insights, kitchens can identify patterns, optimize production, and reduce waste by up to 50%.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Les alchimistes": {
      "description": "Collects and transforms organic waste into high-quality compost through local and eco-friendly processes, promoting a circular economy for urban communities. Local and eco-friendly waste management.​ Environmental impact reduction.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Lesieur": {
      "description": "",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Lionsbot": {
      "description": "Self-navigating cleaning robots with different models for routine vacuuming or scrubbing of large flat floor surfaces (factory floor, lobby, corridors, conference room) by the self-navigating robots. •Enhances the cleaners productivity and enables to redeploy them to other tasks •Both robots can handle hard surfaces and the vacuuming robot also handles carpets •The robots self deploys and returns to docking station autonomously",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Mashgin": {
      "description": "Mashgin delivers the world’s fastest AI-powered self-checkout, using computer vision to recognize items instantly and complete transactions in ~10 seconds—significantly reducing queues, increasing throughput, and driving higher revenue in high-volume foodservice locations.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Metronaps": {
      "description": "A workplace solution for employees to conveniently take short breaks. Equipped with noise-cancelling and music helmets from Jabra and timers, it enhances productivity and alertness discreetly which effectively boosts workplace well-being and performance.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "MyDevices": {
      "description": "Distributes plug-and-play solution integrated with Sodexo platforms since 2015, offering various use cases such as temperature control, energy management, water management, flow management, and space availability detection, sourced from multiple IoT vendors. Seamless integration with Sodexo platforms for efficient and real-time monitoring and management of temperature, energy, water, occupancy and space availability.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Neat frame- Digital reception": {
      "description": "Neat Frame with Neat Pulse delivers a seamless digital reception and virtual kiosk solution, enabling users to instantly start a video call with a pre-configured contact through an intuitive “Press here to Call” interface connected to MS Teams call queues. The device can be configured and managed remotely, making it scalable and easy to adapt across multiple sites without on-site technical intervention.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Neurabody": {
      "description": "Neurabody provides an innovative AI-powered solution for posture analysis and correction. By using sensors attached to clothing, the platform continuously monitors posture and provides personalized exercise recommendations to improve spinal health. •AI-powered posture monitoring with personalized exercise recommendations •Interactive and engaging experience beyond typical dashboards •Supports well-being and sustainability for businesses",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Nono": {
      "description": "Provides self-service external battery stations for recharging mobile phones. Available with or without a deposit, users can access batteries via QR codes and choose from free or paid models. Stations offer 6 to 48 batteries and are remotely monitored. Convenient and flexible mobile phone charging solutions for users on the go. With options for free or paid usage, easy access, and remote monitoring, it enhances customer convenience and satisfaction.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Noponto": {
      "description": "Miro market to offer food products to our customers, using an honest market format. Our solution covers the store structure, sales management and digital payment method (Scan&Go) •Convenience: Snacks and Drinks offer 24hs •Self-Service Model •Offering complementary value to the traditional food model",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Notpla": {
      "description": "Notpla is a sustainable packaging company that applies a seaweed based coating over cellulose to provide a range of plastic-free home-compostable packaging. Their products range from edible water bubbles (known as Ooho), to seaweed-coated food containers and rigid cutlery for take-away, flexible films, paper alternatives, and packaging solutions for single-use items—all designed to be compostable, biodegradable, or dissolve in water without leaving harmful residues. Enables to reduce CO² emissions by 70%.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Orbital Bloom": {
      "description": "Orbital Bloom™ is a graphics platform that expresses and incentivizes the sustainability of buildings and places. We combine interactive storytelling and data processing to make sustainability data emotionally engaging and accessible to wide audiences. •More engaging and interactive experiences than typical dashboards and smart meters • Platform valuable for businesses that care about both their occupants' well-being and environmental impact • Part of 'InnovationRCA' (Royal College of Arts, London)",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Ottonomy": {
      "description": "Click & delivery with autonomous robots, featuring insulated cabins and live monitoring for efficient and reliable transportation of goods. Seamless delivery experience with autonomous robots, opening new revenue streams, reducing operating costs and enhancing customer satisfaction.​",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Oxygen at work": {
      "description": "Selects, installs and regularly maintains natural plants that have a positive effect on the indoor climate. Provides IoT technology and analysis software to follow the effect of the plants. 450+ projects supplied. Makes the air quality in the office noticeably better and healthier on top of bringing a much-appreciated green touch",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Pavegen": {
      "description": "Patented flooring technology with tiles that generate renewable electricity and data from footsteps, usable indoors or outdoors. The generated energy powers low-power applications and provides a tracking dashboard. An accompanying App rewards users and can be used for gamification / donations. Per project / per brand personalization.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Pegasus": {
      "description": "Through advanced AI labelling, Pegasus empowers our Supply Management teams by categorizing Sodexo-purchased articles with unprecedented accuracy. This innovative tool provides a unified vision of our catalogues, enhancing visibility and unlocking better purchasing opportunities. Pegasus leverages advanced AI to label all articles in our catalogues swiftly and accurately. This enables a unified vision of our purchasing catalogue, providing complete visibility and unlocking better purchasing opportunities",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Placer.ai": {
      "description": "Provides mobile based foot traffic information on any geographic area, showing demographics of customers and provides insights into their preferred food and shopping brands. Shows where customers are going when they eat off site. Able to differentiate between different types of customers (e.g. students vs. visitors). Supports identifying which culinary concepts should be included on-site, using real customer behavior data.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Powerchef": {
      "description": "The inability to analyze attendance and working hours in real-time can hinder operational efficiency, affecting overall productivity and profitability. PowerChef addresses these challenges by providing advanced insights to help businesses optimize their workforce management, ensuring they can meet consumer demand while minimizing costs and enhancing service quality. PowerChef leverages data on attendance, working hours, and standard operating procedures to spot productivity gaps and predict staffing needs accordingly.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Pret-a-generer - Menu AI": {
      "description": "Prêt-à-Générer generates menus that comply with local constraints such as pricing, preparation complexity, marketing offer, consumer preferences, sourcing and more… Taking all these constraints into account, our algorithm will automatically generate a complete seasonal menu in minutes , ready to be used on site within a day. Through advanced algorithms and data-driven insights, Prêt-à-Générer empowers our culinary experts and site managers to create compliant and optimized menus, ensuring high-quality culinary experiences while conforming to local constraints",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Pricing": {
      "description": "Pricing’s capabilities use three key data sources—attendance levels, working hours, and standard operating procedures—to monitor and adjust POS pricing performance. By analyzing monthly POS data, central finance and regional managers can manage price revisions, ensure compliance, and drive improvements across units. In a tight-margin, inflationary environment, our Pricing solution supports profitability with a dashboard that monitors key pricing indicators to track on-site performance.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Product Swap": {
      "description": "Are you looking to optimize costs, availability, and carbon footprint in your supply chain? Product Swap will help you by using data analysis and artificial intelligence to source the right items from the right suppliers. Product Swap dynamically ranks products based on similarity, identifies swap opportunities, and evaluates their impact on recipes, carbon footprint, and total cost. By leveraging data analysis and AI, Product Swap empowers Sodexo’s Supply Management and Food Platform teams with real-time insights into sourcing options, ensuring that the right ingredients are sourced at the best price.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Qualipad": {
      "description": "Traceability software integrated with Dragino temperature sensors for digitalizing food traceability from goods reception to serving. It links with SOL order management system for feedback input. Saves time and improves food safety",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Qualtrics": {
      "description": "Qualtrics is an AI-powered experience management (XM) platform that enables organizations to collect, analyze, and act on feedback from customers, employees, products, and brands. It helps businesses measure satisfaction, identify friction points, and provide actionable recommendations to enhance experiences at scale.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Realco": {
      "description": "Offers a safer and more efficient way to ensure deep hygiene while reducing the carbon footprint with a full range of enzymatic based solutions for daily cleaning services in hyper concentrated format (1%). Also provides : •Biofilm control kit to verify cleaning quality. •Biofilm decontamination curative interventions. •Chemical-free preventive and curative hygiene treatment for every use case.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Releaf Paper": {
      "description": "Releaf Paper is a Ukrainian startup that produces eco-friendly packaging made from fallen tree leaves. Their innovative technology uses fiber from fallen leaves to create sustainable paper, providing a green alternative to traditional paper production while reducing deforestation. •Sustainable packaging solutions using fallen leaves, reducing environmental impact. •Eco-friendly alternative to traditional paper, minimizing deforestation. •Supports circular economy practices by utilizing a naturally renewable resource",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Relearn (Nando) IH": {
      "description": "Nando is an AI based image recognition solution for smart waste management. Our operators take a picture of the QR code on a bin before taking a picture of the content for Nando’s AI to provide key analytics (type of waste with great level of details, estimated weight per type of waste, segregation errors, fill levels for dynamic cleaning…)",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "REPG": {
      "description": "An integrated renewable energy and water solution that converts waste heat, solar energy, and ambient air humidity into electricity, heating, cooling, and clean water. RePG enables sites to reduce energy and water dependency, lower operating costs, and improve sustainability performance through on-site resource generation. The solution supports resilient facility operations by combining energy recovery and clean water production in a single system, making it particularly relevant for energy-intensive sites and locations with water constraints.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "SALUS": {
      "description": "SALUS is used to: Report Incident/Accidents, Near Miss and Safety Actions Manage HSE incidents end-to-end including investigations, root cause analysis, action tracking and issuing alerts. Analyse HSE performance using comprehensive data to indentify gaps and drive continuous improvement. SALUS is described as Sodexo's \"global, multi-lingual, web-based platform\" deployed worldwide across all regions where Sodexo operates. Available as an application and a website.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "SavorEat": {
      "description": "BOH 3D printing tech that produces plant-based burgers. Customers can customize the protein content, texture, and fat levels of their burgers. Creates a burger in ~4 min. Enhance customer ability to personalize their plant-based burgers. Support BOH labor gaps with culinary robotics",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "SEA": {
      "description": "Comprehensive carbon footprint assessment service that measures, analyzes, and minimizes organizational carbon emissions. The solution collects data across food supply chain, energy consumption, refrigerants, employee commuting, and waste through the SEA platform. Led by site managers with support from local CSR teams, the service delivers detailed carbon footprint reports with reduction recommendations and tailored action plans to achieve Net Zero targets.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Selecta": {
      "description": "Smart fridges equipped with electronic scales, providing a convenient self-service solution for purchasing products. Users can access the Selecta Deli through an app, mobile wallet, or credit card, select items, and are charged accordingly upon purchase completion. A seamless and convenient self-service shopping experience, allowing users to browse products, make selections, and complete purchases effortlessly through various payment methods. Glassdoors increase consumption by 30%",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Sensio air Ltd": {
      "description": "An optical particle sensor that provides real-time information on air allergens, along with recommendations for improving air quality. Additionally, it offers an App for users to input symptoms and receive allergy type identification and solutions. Provides actionable insights into air quality, helping users understand through an App the allergen presence and take steps to mitigate allergies. Provides a platform and reports for Sodexo FM team to leverage on data and take actions to support air quality.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Smoodi": {
      "description": "Smoodi offers a self-serve smoothie service using smart blending technology, allowing consumers to enjoy fresh smoothies in under a minute. The fruits are pre-packaged, sealed, and flash frozen, with a shelf life of over a year. This service provides a cost-effective wellness beverage option for small kitchens and lower volume accounts, targeting students and consumers.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "So campus": {
      "description": "SoCampus is an FM Digital experience solution developed for Sodexo to encompass End user, Operations and Client experiences. The solution is built ensuring Sodexo IP ownership, fast change management and customization and bringing together the best-in-class features across Asset lifecycle management, Service request, Digital Checklist, PPM, AMC – supported by dashboards. Real time data update and availability. Rapid deployment and scalability. Ability to enable/disable features as per sites",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Sodexo Direct": {
      "description": "A new app aimed at end consumers, adapted to the profile and needs of the site. It provides greater interactivity and the possibility for the user to make online purchases. - Better customer experience. - Generation of consumption habit data. - Convenience and reduction of queues. - Generate more revenue sources",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Solato": {
      "description": "Offers elegant and intuitive countertop ice-cream machine that produces single-serve gelato, sorbet, and frozen yogurt with perfect texture in just 60 seconds using individual capsules. 100+ flavours available (on-demand signature flavour also possible). Sustainable solution for ice cream as prepared on demand (reduces waste) and as the capsules require less space for storage (half of the storage is linked to the air incorporated with traditional ice-creams) and they are kept in the fridge instead of freezer.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Somatic": {
      "description": "Fully autonomous bathroom cleaning robot – cleans toilets, floors, and sinks with no human intervention. Can open doors, empty and fill chemicals, plug itself all on its own and even call an elevator autonomously. Improve bathroom cleaning frequency and quality for FM clients that are struggling with labor shortages.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "SoPro AI": {
      "description": "With multiple sources of content, lack of flexibility in adjusting tone, and the significant costs and time involved in content production, it is challenging to handle a high volume of RFPs. In most cases, the process of locating, validating and rewriting content stays manual. SoPro AI addresses these issues by enhancing productivity, ensuring consistency, and minimizing variabilities, leveraging generative AI to support proposal writing. SoPro AI empowers you to effortlessly generate high-quality, client-focused proposals and B2B communication, transforming your workflow and driving success like never before",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Sormac": {
      "description": "A fully automated vegetable and fruit processing line that eliminates manual handling and transfers across all processing steps. The solution combines automated bin tipping, precision cutting, abrasive peeling, washing, and controlled chlorine-based disinfection into a continuous and high-efficiency workflow. By standardizing operations, it improves processing yield, reduces labor requirements and operating costs, lowers safety risks and LTIR through improved ergonomics, and optimizes water consumption across washing and screening stages",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Starship Technologies": {
      "description": "Starship technologies offers a last-mile robotic delivery service designed for campuses and large outdoor environments. With a subscription-based model, users can prepay and enjoy efficient, contactless food deliveries directly to their location. The service thrives in open areas without elevators or stairs, offering smooth, autonomous navigation. Each delivery comes with a unique tracking link, allowing users to follow their robot’s journey in real time — combining convenience, innovation, and sustainability in every order.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "TAQT": {
      "description": "TAQT is a French solution for smart, digital cleaning and maintenance operations that replaces paper-based processes with connected devices and no-touch requests. It improves efficiency, enables faster issue response, and streamlines follow-up. TaqtOne enables to digitally follow-up of cleaning and maintenance activities, but also offers a no-touch solution to send maintenance request.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Tawny": {
      "description": "AI powered video analytics that transforms standard camera feeds into real time insights on human behavior. The platform analyzes people flow, attention, and emotional signals at both group and individual levels, enabling organizations to better understand engagement, experience, and behavior patterns. Built to work with existing camera infrastructure, the solution delivers scalable, cost efficient insights while fully complying with GDPR requirements.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Toolsense": {
      "description": "ToolSense is an IoT-based asset operations platform that connects equipment through QR, IoT tags or integration with equipment providers to centralize inspections, maintenance tasks, and issue reporting in one place. It enables early detection of problems, automates recurring maintenance routines, digitizes safety and compliance records, and allows frontline teams to report issues easily through QR scan or WhatsApp. The solution helps extend equipment lifespan, reduce downtime, and streamline operations across facilities",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Totem": {
      "description": "TOTEM installs customisable office micro-stores for employees, to use mostly for healthy snacking rather than full-blown meals, in companies of all sizes. The solution combines connected fridges and digital platforms to provide 24/7 access to food, beverages, and everyday essentials directly in office spaces.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "Trayvisor": {
      "description": "Self-checkout solution for canteens or micro-markets. Powered by AI technology, it automatically recognizes a selection of products and enables to complete payment instantaneously in just 10 seconds. •Reduce queuing time. •Enables real-time information on the amount charged. •Increase revenue. •Avoid hiring extras for periods with greater occupancy.",
      "mappedConsumerWC": true,
      "mappedOperator": false
    },
    "uServe Robot": {
      "description": "The robot carries heavy loads and can navigate autonomously or in follower mode and even take elevators for multiple use cases including setting and bussing tables or serving food and drinks (at the restaurant or in cocktail setting, to Sodexo team taking care of the client interaction piece or directly to consumers) Enables staff to refocus on high value added tasks and avoid wasting time between production and service zones.​ Avoids carrying heavy loads",
      "mappedConsumerWC": true,
      "mappedOperator": true
    },
    "VisioLab": {
      "description": "AI-based computer vision self-checkout solution proven successful in high-volume canteens or micro-markets environments. Light on hardware as it relies on Apple's iPad to ensure an easy and efficient maintenance and Google Cloud for advanced analytics. •Reduce queuing time. •Increase revenue. •Avoid hiring extras for periods with greater occupancy.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Visionaries777": {
      "description": "Immersive VR experience that allows managers to train employees on workplace accident prevention in realistic kitchen environments using HTC Vive headsets and MSI Backpacks for movement freedom. Guides employees through completing operations in different scenarios to minimize injury risks in real life.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "VusionGroup": {
      "description": "A connected platform providing smart digit price tags and AI powered technology to optimize pricing, inventory management and shopper engagement in real time. A modern and sustainable customer experience with interactive displays, full transparency and reduced food waste.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Wando": {
      "description": "Wando aims to streamline your employees’ experience with digitized workplace services. Whether on-site, at home or travelling, the Wando app adapts to employees needs and connects employees to their workplace with a wide range of features easily accessible MODULAR, it adapts to your local needs. Choose the right experience & features. EFFICIENT so employees can focus on the essential at work and for our onsite teams to track & prioritize work orders. PERFORMANCE at its best : onsite teams can proactively report issues, flag recurring ones and get feedback from consumers. It’s also reporting made easier: track out of scope work orders, capture maintenance work data to demonstrate value and improve our services",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Wobot": {
      "description": "Wobot.ai started in 2017 with an aim to harness real time insights from cameras to unleash their full potential. Automatically detect and supervise regulatory compliance using pre-defined industry specific checklists​. Workflows that notify users of relevant and actionable events in real time while taking feedback, to close the event loop​. Analytics that provide mission critical data for increased operational efficiency",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Zebra Smartgloves": {
      "description": "The Zebra RS2100 is an ergonomic, wearable wireless barcode scanner designed to keep logistics and inventory staff hands-free while performing their duties. By allowing operators to scan items without interrupting their workflow, it improves speed, accuracy, and operational efficiency. The device can be equipped with an optional display to provide real-time guidance, task instructions, or inventory information directly to the user, further reducing errors and boosting confidence.",
      "mappedConsumerWC": false,
      "mappedOperator": true
    },
    "Zeroimpack": {
      "description": "Zeroimpack provides reusable food packaging and dishware as a service, combined with centralized collection, industrial washing, and redistribution. Using QR coded reusable containers, the solution enables sites to outsource washing of packaging, plates, glasses, and cutlery to high efficiency cleaning hubs that minimize water, energy, and chemical use. This simplifies on site operations, reduces costs, and significantly lowers single use waste, CO2 emissions, and water consumption while supporting large scale reuse programs.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    },
    "Zippin by Fujitsu": {
      "description": "Zippin's cashierless stores and retail solutions. Checkout-free platform helps you increase throughput, drive profits and delight customers. Zip in. Zip out. Zippin’s AI-powered platform uses machine learning and sensor fusion technology to boost retailer profitability with our entirely checkout-free shopping platform. Reduce the time it takes to buy a drink or snack from 20 minutes to 20 seconds. Zippin-powered stores have seen revenues increase up to 80% or more.",
      "mappedConsumerWC": false,
      "mappedOperator": false
    }
  }
};
