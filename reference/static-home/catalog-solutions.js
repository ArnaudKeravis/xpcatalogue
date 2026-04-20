/**
 * Extracted from Claude prototype SOLUTIONS (merged at runtime into CATALOG).
 * Source: agent transcript; sync with catalogue when content changes.
 */
(function (global) {
  global.CATALOG_EXTRA = global.CATALOG_EXTRA || {};
  global.CATALOG_EXTRA.solutions = {
  "circles": {
    "id": "circles",
    "title": "Circles",
    "serviceLabel": "Service",
    "tags": [
      "#BeyondFood",
      "#WorkLifeBalance",
      "#Engagement"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "In today's competitive work environment, organizations face challenges in attracting and retaining top talent. Employees seek a holistic work experience supporting well-being, work-life balance, and personal growth.",
    "descriptionHtml": "<p>Circles by Sodexo is a premier workplace concierge and lifestyle service platform with 25+ years of expertise. Offers assistance with everyday tasks, coordination of corporate events, social events and wellness programs.</p>",
    "kpis": [
      "20+: Flagship clients",
      "85%: Feel more valued",
      "+78: NPS Score",
      "Multi: Countries"
    ],
    "contact": "Yohan DEHE",
    "benefits": [
      {
        "role": "Client",
        "text": "Boosts satisfaction, productivity and talent retention."
      },
      {
        "role": "Consumer",
        "text": "Simplifies daily life and improves work-life balance."
      },
      {
        "role": "Sodexo",
        "text": "Strengthens brand reputation and drives business growth."
      }
    ],
    "module": "Conciergerie",
    "status": "Scaled",
    "url": "https://www.circles.com",
    "claudeKey": "Circles"
  },
  "sodexoWrxConciergerie": {
    "id": "sodexoWrxConciergerie",
    "title": "Sodexo WRX",
    "serviceLabel": "Application",
    "tags": [
      "#OneApp",
      "#DigitalExperience"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Sodexo WRX is Sodexo's new unified container app.",
    "descriptionHtml": "<p>One-stop platform for Food, FM, and Workplace Experience. 5 countries, 5 active sites.</p>",
    "kpis": [
      "5: Countries",
      "5: Active sites",
      "1 app: Unified",
      "Scaling: Status"
    ],
    "contact": "Katie HANSON",
    "benefits": [
      {
        "role": "Client",
        "text": "One digital gateway."
      },
      {
        "role": "Consumer",
        "text": "Simple, personalized."
      },
      {
        "role": "Sodexo",
        "text": "Strategic tool."
      }
    ],
    "module": "Conciergerie",
    "status": "Scaling",
    "url": "https://www.sodexo.com",
    "claudeKey": "Sodexo WRX (Conciergerie)"
  },
  "aifi": {
    "id": "aifi",
    "title": "AiFi",
    "serviceLabel": "Device",
    "tags": [
      "#BeyondFood",
      "#Autonomous"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Traditional retail creates friction through checkout lines and staffing challenges.",
    "descriptionHtml": "<p>AI-powered autonomous stores using computer vision. 270+ stores deployed worldwide.</p>",
    "kpis": [
      "270+: Stores worldwide",
      "9M+: Customers served",
      "23M+: Products sold",
      "2/week: Deploy rate"
    ],
    "contact": "Thomas PELEGRIN",
    "benefits": [
      {
        "role": "Client",
        "text": "24/7 operations."
      },
      {
        "role": "Consumer",
        "text": "Zero wait times."
      },
      {
        "role": "Sodexo",
        "text": "Service differentiation."
      }
    ],
    "module": "Autonomous Stores",
    "status": "Scaled",
    "url": "https://www.aifi.com",
    "claudeKey": "AiFi"
  },
  "amazonJwo": {
    "id": "amazonJwo",
    "title": "Amazon JWO",
    "serviceLabel": "Device",
    "tags": [
      "#BeyondFood",
      "#AutonomousStore"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "High-traffic venues need to serve more customers with limited labor.",
    "descriptionHtml": "<p>Just Walk Out technology. 3 Sodexo Live! NorAm sites (7 stores). Exploring Healthcare.</p>",
    "kpis": [
      "3: NorAm sites",
      "7: Active stores",
      "Scaling: Status",
      "Healthcare: Next"
    ],
    "contact": "Topher LARSON",
    "benefits": [
      {
        "role": "Client",
        "text": "Innovative image."
      },
      {
        "role": "Consumer",
        "text": "Frictionless."
      },
      {
        "role": "Sodexo",
        "text": "Reduce labor."
      }
    ],
    "module": "Autonomous Stores",
    "status": "Scaling",
    "url": "https://www.amazon.com",
    "claudeKey": "Amazon JWO"
  },
  "zippin": {
    "id": "zippin",
    "title": "Zippin by Fujitsu",
    "serviceLabel": "Device",
    "tags": [
      "#BeyondFood",
      "#AutonomousStore"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "High-traffic venues require fast, frictionless retail.",
    "descriptionHtml": "<p>Cashierless platform. Piloted at Roland-Garros 2024. Revenues up to +80%.</p>",
    "kpis": [
      "88%: Conversion RG",
      "€14: Avg cart",
      "54 sec: In-shop time",
      "+80%: Revenue"
    ],
    "contact": "Thomas PELEGRIN",
    "benefits": [
      {
        "role": "Client",
        "text": "Innovative."
      },
      {
        "role": "Consumer",
        "text": "Instant checkout."
      },
      {
        "role": "Sodexo",
        "text": "Optimize ops."
      }
    ],
    "module": "Autonomous Stores",
    "status": "Pilot",
    "url": "https://www.getzippin.com",
    "claudeKey": "Zippin"
  },
  "totem": {
    "id": "totem",
    "title": "Totem",
    "serviceLabel": "Service",
    "tags": [
      "#SmartOffice",
      "#MicroMarkets"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Traditional office cafeterias fail to meet modern workplace needs.",
    "descriptionHtml": "<p>Office micro stores. 10,000+ users. €4M Series A.</p>",
    "kpis": [
      "10k+: Users",
      "€4M: Series A",
      "Multiple: Clients",
      "24/7: Access"
    ],
    "contact": "Romain MEGGLE",
    "benefits": [
      {
        "role": "Client",
        "text": "Cost reduction."
      },
      {
        "role": "Consumer",
        "text": "24/7 food."
      },
      {
        "role": "Sodexo",
        "text": "New revenues."
      }
    ],
    "module": "Smart Vending",
    "status": "Pilot",
    "url": "https://www.totem.co",
    "claudeKey": "Totem"
  },
  "mashgin": {
    "id": "mashgin",
    "title": "Mashgin",
    "serviceLabel": "Device",
    "tags": [
      "#BeyondFood",
      "#TrayRecognition"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "High-traffic foodservice faces pressure with labor constraints.",
    "descriptionHtml": "<p>World's fastest AI-powered self-checkout. ~10 seconds. 136 University + 7 Live! sites.</p>",
    "kpis": [
      "10 sec: Transaction",
      "136: University sites",
      "7: Live! sites",
      "Scaling: Status"
    ],
    "contact": "Thomas PELEGRIN",
    "benefits": [
      {
        "role": "Client",
        "text": "Time-saving."
      },
      {
        "role": "Consumer",
        "text": "No queues."
      },
      {
        "role": "Sodexo",
        "text": "Boost revenues."
      }
    ],
    "module": "Self-Checkout AI",
    "status": "Scaled",
    "url": "https://www.mashgin.com",
    "claudeKey": "Mashgin"
  },
  "trayvisor": {
    "id": "trayvisor",
    "title": "Trayvisor",
    "serviceLabel": "Device",
    "tags": [
      "#BeyondFood",
      "#TrayRecognition"
    ],
    "flags": [
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "High-traffic canteens face pressure to reduce queue times.",
    "descriptionHtml": "<p>AI product recognition, 10 seconds. 30+ CS France. 95% accuracy.</p>",
    "kpis": [
      "10 sec: Payment",
      "95%: Accuracy",
      "30+: CS sites",
      "Scaling: France"
    ],
    "contact": "Laura MARCHAL",
    "benefits": [
      {
        "role": "Client",
        "text": "Time-saving."
      },
      {
        "role": "Consumer",
        "text": "Instant payment."
      },
      {
        "role": "Sodexo",
        "text": "Boost revenues."
      }
    ],
    "module": "Self-Checkout AI",
    "status": "Scaling",
    "url": "https://www.trayvisor.com",
    "claudeKey": "Trayvisor"
  },
  "everyday": {
    "id": "everyday",
    "title": "Everyday",
    "serviceLabel": "Application",
    "tags": [
      "#BeyondFood",
      "#Workplace",
      "#Digital"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Employees expect flexible on-demand access to quality meals.",
    "descriptionHtml": "<p>1M+ users, 4.76/5 satisfaction, 30M orders/year, +50% mobile.</p>",
    "kpis": [
      "1M+: Users",
      "4.76/5: Satisfaction",
      "30M: Orders/year",
      "+50%: Mobile"
    ],
    "contact": "Solal STENOU",
    "benefits": [
      {
        "role": "Client",
        "text": "Enhanced experience."
      },
      {
        "role": "Consumer",
        "text": "One-stop food app."
      },
      {
        "role": "Sodexo",
        "text": "Actionable insights."
      }
    ],
    "module": "Digital Apps",
    "status": "Scaled",
    "url": "https://www.sodexo.com",
    "claudeKey": "Everyday"
  },
  "sodexoWrx": {
    "id": "sodexoWrx",
    "title": "Sodexo WRX",
    "serviceLabel": "Application",
    "tags": [
      "#OneApp",
      "#Digital"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Unified app for all Sodexo services.",
    "descriptionHtml": "<p>Food, FM, and Workplace in one app. 5 countries.</p>",
    "kpis": [
      "5: Countries",
      "5: Sites",
      "1 app: Unified",
      "Scaling: Status"
    ],
    "contact": "Katie HANSON",
    "benefits": [
      {
        "role": "Client",
        "text": "One gateway."
      },
      {
        "role": "Consumer",
        "text": "Convenient."
      },
      {
        "role": "Sodexo",
        "text": "Strategic."
      }
    ],
    "module": "Digital Apps",
    "status": "Scaling",
    "url": "https://www.sodexo.com",
    "claudeKey": "Sodexo WRX"
  },
  "kikleo": {
    "id": "kikleo",
    "title": "Kikleo",
    "serviceLabel": "Software",
    "tags": [
      "#AI",
      "#Sustainability",
      "#FoodWaste"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Food waste is a persistent challenge in foodservice.",
    "descriptionHtml": "<p>AI + 3D cameras. -20% food cost year 1, -50% after 3 years. 160+ locations.</p>",
    "kpis": [
      "-20%: Food cost yr1",
      "-50%: After 3 yrs",
      "160+: Locations",
      "3 sec: Recording"
    ],
    "contact": "Laura MARCHAL",
    "benefits": [
      {
        "role": "Client",
        "text": "Cost reduction."
      },
      {
        "role": "Consumer",
        "text": "Sustainability."
      },
      {
        "role": "Sodexo",
        "text": "Automated insights."
      }
    ],
    "module": "Food Waste",
    "status": "Scaled",
    "url": "https://www.kikleo.com",
    "claudeKey": "Kikleo"
  },
  "leanpath": {
    "id": "leanpath",
    "title": "Leanpath: WasteWatch",
    "serviceLabel": "Software",
    "tags": [
      "#AI",
      "#Sustainability",
      "#FoodWaste"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Food waste drives up costs in commercial kitchens.",
    "descriptionHtml": "<p>Smart scale + tablet. 3,851 sites, 37 countries, -50% food waste.</p>",
    "kpis": [
      "3,851: Sites",
      "37: Countries",
      "-50%: Waste",
      "85%: Target 2025"
    ],
    "contact": "Jérôme LEMOUCHOUX",
    "benefits": [
      {
        "role": "Client",
        "text": "Reduced costs."
      },
      {
        "role": "Consumer",
        "text": "Sustainable dining."
      },
      {
        "role": "Sodexo",
        "text": "Improved profitability."
      }
    ],
    "module": "Food Waste",
    "status": "Scaled",
    "url": "https://www.leanpath.com",
    "claudeKey": "Leanpath"
  },
  "menuai": {
    "id": "menuai",
    "title": "MenuAI",
    "serviceLabel": "Device",
    "tags": [
      "#AI",
      "#Sustainability"
    ],
    "flags": [
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Menu planning is complex with regulatory requirements.",
    "descriptionHtml": "<p>Generates complete seasonal menus in minutes. 50x faster.</p>",
    "kpis": [
      "50x: Faster",
      "Scaled: Status",
      "Minutes: Full menu",
      "Local: Compliant"
    ],
    "contact": "Kevin ALBRAND",
    "benefits": [
      {
        "role": "Client",
        "text": "Streamlined ops."
      },
      {
        "role": "Consumer",
        "text": "N/A"
      },
      {
        "role": "Sodexo",
        "text": "Cost improvement."
      }
    ],
    "module": "AI Tools",
    "status": "Scaled",
    "url": "https://www.sodexo.com",
    "claudeKey": "MenuAI"
  },
  "powerchef": {
    "id": "powerchef",
    "title": "Powerchef",
    "serviceLabel": "Software",
    "tags": [
      "#Data",
      "#AI"
    ],
    "flags": [
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Misalignment between demand and staffing impacts profitability.",
    "descriptionHtml": "<p>Workforce optimization. 250 sites, 87% accuracy, €5M GP impact.</p>",
    "kpis": [
      "250: Sites",
      "87%: Accuracy",
      "€5M: GP impact",
      "Scaled: Status"
    ],
    "contact": "Benjamin BARRAU",
    "benefits": [
      {
        "role": "Client",
        "text": "Enhanced ops."
      },
      {
        "role": "Consumer",
        "text": "N/A"
      },
      {
        "role": "Sodexo",
        "text": "Workforce mgmt."
      }
    ],
    "module": "AI Tools",
    "status": "Scaled",
    "url": "https://www.sodexo.com",
    "claudeKey": "Powerchef"
  },
  "productSwap": {
    "id": "productSwap",
    "title": "Product Swap",
    "serviceLabel": "Device",
    "tags": [
      "#Data",
      "#AI"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Supply chains face cost, availability, and sustainability pressure.",
    "descriptionHtml": "<p>AI product swap optimization. €4.5M savings Q2 FY25.</p>",
    "kpis": [
      "€4.5M: Savings Q2 FY25",
      "Scaled: Status",
      "AI: Ranking",
      "Carbon: Optimization"
    ],
    "contact": "Corentin GINISTRY",
    "benefits": [
      {
        "role": "Client",
        "text": "Cost control."
      },
      {
        "role": "Consumer",
        "text": "Continuity."
      },
      {
        "role": "Sodexo",
        "text": "Simplifies decisions."
      }
    ],
    "module": "AI Tools",
    "status": "Scaled",
    "url": "https://www.sodexo.com",
    "claudeKey": "Product Swap"
  },
  "soproAi": {
    "id": "soproAi",
    "title": "SoPro AI",
    "serviceLabel": "Device",
    "tags": [
      "#AI",
      "#Bids"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Bid teams face increasing RFP volumes.",
    "descriptionHtml": "<p>Gen AI for proposals. 100+ proposals, 100 users, -15% hours.</p>",
    "kpis": [
      "100+: Proposals",
      "100: Users",
      "-15%: Hours target",
      "Scaling: Status"
    ],
    "contact": "Ria STONE",
    "benefits": [
      {
        "role": "Client",
        "text": "N/A"
      },
      {
        "role": "Consumer",
        "text": "N/A"
      },
      {
        "role": "Sodexo",
        "text": "Productivity."
      }
    ],
    "module": "AI Tools",
    "status": "Scaling",
    "url": "https://www.sodexo.com",
    "claudeKey": "SoPro AI"
  },
  "salus": {
    "id": "salus",
    "title": "SALUS",
    "serviceLabel": "Software",
    "tags": [
      "#Safety",
      "#Digital"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Managing HSE incidents globally needs consistent reporting.",
    "descriptionHtml": "<p>Global HSE platform. 423,500 employees. 81.5% retention rate.</p>",
    "kpis": [
      "423,500: Employees",
      "81.5%: Retention",
      "Global: Multi-lingual",
      "App+Web: Formats"
    ],
    "contact": "Arnaud KERAVIS",
    "benefits": [
      {
        "role": "Client",
        "text": "Safety compliance."
      },
      {
        "role": "Consumer",
        "text": "Safer environments."
      },
      {
        "role": "Sodexo",
        "text": "Real-time analytics."
      }
    ],
    "module": "Safety & Compliance",
    "status": "Scaled",
    "url": "https://www.sodexo.com",
    "claudeKey": "SALUS"
  },
  "starship": {
    "id": "starship",
    "title": "Starship Technologies",
    "serviceLabel": "Machine",
    "tags": [
      "#BeyondFood",
      "#Robotics"
    ],
    "flags": [
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Students on large campuses struggle to get food quickly.",
    "descriptionHtml": "<p>Last-mile robotic delivery. 60 robots at Manson University.</p>",
    "kpis": [
      "60: Robots",
      "Real-time: Tracking",
      "Contactless: Delivery",
      "Pilot: Status"
    ],
    "contact": "Sofya VETROVA",
    "benefits": [
      {
        "role": "Client",
        "text": "Campus image."
      },
      {
        "role": "Consumer",
        "text": "Fast meals."
      },
      {
        "role": "Sodexo",
        "text": "Innovation."
      }
    ],
    "module": "Delivery Robots",
    "status": "Pilot",
    "url": "https://www.starship.xyz",
    "claudeKey": "Starship"
  },
  "userveRobot": {
    "id": "userveRobot",
    "title": "uServe Robot",
    "serviceLabel": "Machine",
    "tags": [
      "#BeyondFood",
      "#Robotics"
    ],
    "flags": [
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Staff in hospitality transport heavy loads limiting interaction.",
    "descriptionHtml": "<p>Adopted at Coeur Défense Paris. 3x table clearing, 150kg crockery/service.</p>",
    "kpis": [
      "3x: Clearing speed",
      "150kg: Crockery/service",
      "Adopted: Coeur Défense",
      "Pilot: Completed"
    ],
    "contact": "Laura MARCHAL",
    "benefits": [
      {
        "role": "Client",
        "text": "Reduces strain."
      },
      {
        "role": "Consumer",
        "text": "Better dining."
      },
      {
        "role": "Sodexo",
        "text": "Labor optimization."
      }
    ],
    "module": "Service Robots",
    "status": "Scaled",
    "url": "https://www.useRobotics.com",
    "claudeKey": "uServe Robot"
  },
  "circularPlace": {
    "id": "circularPlace",
    "title": "Circular Place",
    "serviceLabel": "Software",
    "tags": [
      "#Sustainability",
      "#WasteReduction"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Companies struggle with underutilized internal assets.",
    "descriptionHtml": "<p>Platform for second-life assets. €156k saved, 20.5t CO₂, 1,631 users.</p>",
    "kpis": [
      "€156k: Value saved",
      "20.5t: CO₂ saved",
      "1,631: Users",
      "782: Active"
    ],
    "contact": "Romain MEGGLE",
    "benefits": [
      {
        "role": "Client",
        "text": "Reduced procurement."
      },
      {
        "role": "Consumer",
        "text": "Shared resources."
      },
      {
        "role": "Sodexo",
        "text": "Waste reduction."
      }
    ],
    "module": "Circular Economy",
    "status": "Scaled",
    "url": "https://www.circularplace.com",
    "claudeKey": "Circular Place"
  },
  "qualtrics": {
    "id": "qualtrics",
    "title": "Qualtrics",
    "serviceLabel": "Software",
    "tags": [
      "#Feedback",
      "#ClientNPS"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Companies struggle to understand customer and employee experience.",
    "descriptionHtml": "<p>AI-powered XM platform. USA Sep 2025. Australia Oct 2025.</p>",
    "kpis": [
      "FY26: Target",
      "Sep 2025: USA Campus",
      "Oct 2025: Australia",
      "Global: Rollout"
    ],
    "contact": "Arnaud AICARDI",
    "benefits": [
      {
        "role": "Client",
        "text": "Feedback insights."
      },
      {
        "role": "Consumer",
        "text": "Easy feedback."
      },
      {
        "role": "Sodexo",
        "text": "Growth monitoring."
      }
    ],
    "module": "Feedback",
    "status": "Scaling",
    "url": "https://www.qualtrics.com",
    "claudeKey": "Qualtrics"
  },
  "icertainty": {
    "id": "icertainty",
    "title": "iCertainty",
    "serviceLabel": "Device",
    "tags": [
      "#BeyondFood",
      "#HSEQ"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Manual temperature checks are time-consuming and error-prone.",
    "descriptionHtml": "<p>Remote temperature monitoring. 115+ USA sites. 4-5 month payback.</p>",
    "kpis": [
      "115+: USA sites",
      "4-5mo: Payback",
      "Worldwide: Available",
      "Real-time: Alerts"
    ],
    "contact": "Daniel FREDERICKSEN",
    "benefits": [
      {
        "role": "Client",
        "text": "Food freshness."
      },
      {
        "role": "Consumer",
        "text": "Safety."
      },
      {
        "role": "Sodexo",
        "text": "Digitize safety."
      }
    ],
    "module": "Food Safety",
    "status": "Scaling",
    "url": "https://www.icertainty.com",
    "claudeKey": "iCertainty"
  },
  "affluences": {
    "id": "affluences",
    "title": "Affluences",
    "serviceLabel": "Software",
    "tags": [
      "#FootTraffic",
      "#Predictive",
      "#AI"
    ],
    "flags": [
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Organizations face challenges managing foot traffic.",
    "descriptionHtml": "<p>Measure, forecast, manage building flows. Olympics 2024.</p>",
    "kpis": [
      "Olympics: 2024",
      "2+: CS pilots",
      "Real-time: Occupancy",
      "Scaling: France"
    ],
    "contact": "Laura MARCHAL",
    "benefits": [
      {
        "role": "Client",
        "text": "Predictive analytics."
      },
      {
        "role": "Consumer",
        "text": "Less waiting."
      },
      {
        "role": "Sodexo",
        "text": "Staff allocation."
      }
    ],
    "module": "Analytics",
    "status": "Scaling",
    "url": "https://www.affluences.com",
    "claudeKey": "Affluences"
  },
  "4site": {
    "id": "4site",
    "title": "4Site",
    "serviceLabel": "Dashboard",
    "tags": [
      "#Efficiency",
      "#AI",
      "#Data"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Organizations need to turn operational data into insights.",
    "descriptionHtml": "<p>AI+ML analytics. Combines Everyday app data. €5M GP impact.</p>",
    "kpis": [
      "€5M: GP impact",
      "Deployed: Status",
      "AI+ML: Engine",
      "Real-time: Data"
    ],
    "contact": "Charles BEHRA2A",
    "benefits": [
      {
        "role": "Client",
        "text": "Business intelligence."
      },
      {
        "role": "Consumer",
        "text": "Better experience."
      },
      {
        "role": "Sodexo",
        "text": "Operational efficiency."
      }
    ],
    "module": "Analytics",
    "status": "Scaled",
    "url": "https://www.sodexo.com",
    "claudeKey": "4Site"
  },
  "aquablu": {
    "id": "aquablu",
    "title": "Aquablu",
    "serviceLabel": "Device",
    "tags": [
      "#BeyondFood",
      "#Sustainability"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Organizations seek sustainable alternatives to bottled beverages.",
    "descriptionHtml": "<p>Smart water dispenser. APM: 466L, 932 bottles saved, 482kg CO₂.</p>",
    "kpis": [
      "466L: APM 1 month",
      "932: Bottles saved",
      "482kg: CO₂ saved",
      "Scaled: NL/UK/BE/DE"
    ],
    "contact": "Laura MARCHAL",
    "benefits": [
      {
        "role": "Client",
        "text": "Reduce single-use."
      },
      {
        "role": "Consumer",
        "text": "Healthier."
      },
      {
        "role": "Sodexo",
        "text": "Sustainability."
      }
    ],
    "module": "Hydration",
    "status": "Scaled",
    "url": "https://www.aquablu.com",
    "claudeKey": "Aquablu"
  },
  "inspekly": {
    "id": "inspekly",
    "title": "Inspekly",
    "serviceLabel": "Application",
    "tags": [
      "#AR",
      "#Efficiency"
    ],
    "flags": [
      "./assets/placeholder.svg",
      "./assets/placeholder.svg",
      "./assets/placeholder.svg"
    ],
    "heroImage": "./assets/figma/work-area-info-iso.png",
    "context": "Managing assets in complex indoor environments is resource-heavy.",
    "descriptionHtml": "<p>Indoor AR digital twins. -80% time, -10% resources, +3% satisfaction.</p>",
    "kpis": [
      "-80%: Time on site",
      "-10%: Resources",
      "+3%: Satisfaction",
      "AR: Tech"
    ],
    "contact": "Michael GREGG",
    "benefits": [
      {
        "role": "Client",
        "text": "Time savings."
      },
      {
        "role": "Consumer",
        "text": "Consistent quality."
      },
      {
        "role": "Sodexo",
        "text": "FM digital."
      }
    ],
    "module": "FM Operations",
    "status": "Pilot",
    "url": "https://www.inspekly.com",
    "claudeKey": "Inspekly"
  }
};
  global.CATALOG_EXTRA.solutionTabOrder = [
  "circles",
  "sodexoWrxConciergerie",
  "aifi",
  "amazonJwo",
  "zippin",
  "totem",
  "mashgin",
  "trayvisor",
  "everyday",
  "sodexoWrx",
  "kikleo",
  "leanpath",
  "menuai",
  "powerchef",
  "productSwap",
  "soproAi",
  "salus",
  "starship",
  "userveRobot",
  "circularPlace",
  "qualtrics",
  "icertainty",
  "affluences",
  "4site",
  "aquablu",
  "inspekly"
];
})(typeof window !== 'undefined' ? window : globalThis);
