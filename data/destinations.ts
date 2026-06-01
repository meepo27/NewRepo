export interface DestinationData {
  city: string;
  country: string;
  countryCode: string;
  slug: string;
  overview: string;
  bestTime: string;
  budgetRange: { low: number; high: number; currency: string };
  topActivities: string[];
  heroUnsplashQuery: string;
}

export const DESTINATION_DATA: DestinationData[] = [
  {
    city: 'Bangkok', country: 'Thailand', countryCode: 'TH', slug: 'bangkok',
    overview: 'Bangkok is a city of contrasts — gleaming temples rise beside neon-lit street markets, and rooftop bars overlook ancient canals. It is one of Southeast Asia\'s most exciting capitals, endlessly layered and always surprising. From the Grand Palace to the chaos of Chatuchak Weekend Market, Bangkok rewards curious travellers who embrace its pace.',
    bestTime: 'November to March (cool and dry season)',
    budgetRange: { low: 40, high: 120, currency: 'USD' },
    topActivities: ['Visit the Grand Palace and Wat Phra Kaew', 'Explore Chatuchak Weekend Market', 'Take a Chao Phraya river cruise', 'Street food tour of Yaowarat (Chinatown)', 'Day trip to Ayutthaya ancient city'],
    heroUnsplashQuery: 'Bangkok temple golden',
  },
  {
    city: 'Paris', country: 'France', countryCode: 'FR', slug: 'paris',
    overview: 'Paris is the city everyone has imagined and few can fully describe after visiting. The Eiffel Tower at dusk, croissants from the corner boulangerie, the Seine at golden hour — these clichés exist because they are genuinely magnificent. Beyond the landmarks lies a city of arrondissements with distinct personalities, world-class museums, and some of the finest food on earth.',
    bestTime: 'April–June and September–October',
    budgetRange: { low: 100, high: 300, currency: 'USD' },
    topActivities: ['Climb the Eiffel Tower at sunset', 'Walk through the Louvre (book ahead)', 'Stroll Montmartre and visit Sacré-Cœur', 'Day trip to Versailles Palace', 'Wine and cheese tasting in the Marais'],
    heroUnsplashQuery: 'Paris Eiffel Tower sunset',
  },
  {
    city: 'Tokyo', country: 'Japan', countryCode: 'JP', slug: 'tokyo',
    overview: 'Tokyo is one of the world\'s great cities — a place where tradition and ultra-modernity coexist without friction. Ancient Shinto shrines sit between glass towers; izakayas open onto streets lit by vending machines. The city is safe, efficient, obsessively detailed, and one of the best places on earth to eat. From Shibuya crossing to the quiet temples of Yanaka, Tokyo is endlessly fascinating.',
    bestTime: 'March–May (cherry blossom) and October–November',
    budgetRange: { low: 80, high: 200, currency: 'USD' },
    topActivities: ['Cross the Shibuya scramble intersection', 'Visit Senso-ji temple in Asakusa', 'Explore Tsukiji outer market for breakfast', 'Day trip to Nikko or Kamakura', 'Wander Harajuku and Takeshita Street'],
    heroUnsplashQuery: 'Tokyo Shibuya night',
  },
  {
    city: 'Bali', country: 'Indonesia', countryCode: 'ID', slug: 'bali',
    overview: 'Bali is the dream island — rice terraces cascading down volcanic hillsides, temples draped in smoke and marigolds, surf breaks that draw riders from every continent. Ubud is the cultural heartland, Seminyak is the party coast, and Uluwatu is the cliff-top paradise. Bali works for every kind of traveller, from budget backpackers to honeymoon couples.',
    bestTime: 'April–October (dry season)',
    budgetRange: { low: 30, high: 100, currency: 'USD' },
    topActivities: ['Sunrise trek on Mount Batur volcano', 'Visit Tanah Lot sea temple at sunset', 'Take a cooking class in Ubud', 'Surf at Kuta or Canggu beach', 'Explore the Sacred Monkey Forest Sanctuary'],
    heroUnsplashQuery: 'Bali rice terraces temple',
  },
  {
    city: 'Rome', country: 'Italy', countryCode: 'IT', slug: 'rome',
    overview: 'Rome is the eternal city — two thousand years of history in a single afternoon walk. The Colosseum, the Forum, the Pantheon, the Vatican — Rome\'s monuments are so iconic it takes conscious effort to see them freshly. But beyond the big sites, Rome rewards slow travellers: a neighbourhood trattoria, a perfect espresso at a marble bar, a piazza that feels unchanged since the Renaissance.',
    bestTime: 'April–June and September–October',
    budgetRange: { low: 80, high: 220, currency: 'USD' },
    topActivities: ['Visit the Colosseum and Roman Forum (book ahead)', 'Explore the Vatican Museums and Sistine Chapel', 'Toss a coin in the Trevi Fountain', 'Eat supplì and pizza al taglio in Trastevere', 'Day trip to the Appian Way'],
    heroUnsplashQuery: 'Rome Colosseum golden hour',
  },
  {
    city: 'Dubai', country: 'UAE', countryCode: 'AE', slug: 'dubai',
    overview: 'Dubai is a city that refuses to be subtle. It has the world\'s tallest building, largest shopping mall, longest indoor ski slope, and most expensive hotel. But beneath the superlatives is a genuinely exciting city — a desert metropolis that built itself from sand in a single generation. The old Gold and Spice Souks, the Creek dhow rides, and the Al Fahidi neighbourhood reveal a different, quieter story.',
    bestTime: 'November to March (cooler weather)',
    budgetRange: { low: 100, high: 350, currency: 'USD' },
    topActivities: ['Ascend the Burj Khalifa At The Top deck', 'Desert safari with dune bashing and BBQ dinner', 'Explore the Gold and Spice Souks in Deira', 'Visit the Frame and Dubai Museum', 'Swim at Jumeirah Beach'],
    heroUnsplashQuery: 'Dubai Burj Khalifa skyline night',
  },
  {
    city: 'Singapore', country: 'Singapore', countryCode: 'SG', slug: 'singapore',
    overview: 'Singapore punches well above its size. This tiny island city-state is impossibly clean, staggeringly efficient, and genuinely multicultural — Malay, Chinese, Indian, and colonial British influences all visible within a few city blocks. Gardens by the Bay, the hawker centres, the colonial district, and a string of world-class restaurants make it one of Asia\'s most compelling destinations.',
    bestTime: 'February to April (least rainfall)',
    budgetRange: { low: 80, high: 250, currency: 'USD' },
    topActivities: ['Explore Gardens by the Bay and the Supertrees', 'Eat your way through Maxwell Food Centre', 'Walk the Singapore Botanic Gardens', 'Visit Chinatown and Little India in one morning', 'Day trip to Sentosa island'],
    heroUnsplashQuery: 'Singapore Gardens Bay night',
  },
  {
    city: 'Barcelona', country: 'Spain', countryCode: 'ES', slug: 'barcelona',
    overview: 'Barcelona is Gaudí\'s city and the Mediterranean\'s playground — Modernista architecture dissolving into golden beaches, tapas bars opening as the city\'s nightlife accelerates. La Sagrada Família is still being finished after 140 years. Las Ramblas is a tourist gauntlet but exits onto the Gothic Quarter, which is genuinely ancient and beautiful. Barcelona rewards early mornings and late nights.',
    bestTime: 'May–June and September–October',
    budgetRange: { low: 70, high: 200, currency: 'USD' },
    topActivities: ['Visit La Sagrada Família (book months ahead)', 'Stroll Park Güell in the morning', 'Walk the Gothic Quarter\'s medieval lanes', 'Eat pintxos in the Eixample', 'Day trip to Montserrat monastery'],
    heroUnsplashQuery: 'Barcelona Sagrada Familia architecture',
  },
  {
    city: 'New Delhi', country: 'India', countryCode: 'IN', slug: 'new-delhi',
    overview: 'Delhi is India\'s capital in every sense — a city of staggering size, contradictions, history, and energy. Old Delhi\'s labyrinthine bazaars and Mughal monuments sit alongside New Delhi\'s wide colonial boulevards and the modern glass towers of Gurgaon. The food alone is worth the journey: parathas in Chandni Chowk, street-side chai, and kebabs from ITO\'s roadside grills.',
    bestTime: 'October to March',
    budgetRange: { low: 25, high: 100, currency: 'USD' },
    topActivities: ['Explore Chandni Chowk and the spice market', 'Visit the Red Fort and Jama Masjid', 'Walk around Humayun\'s Tomb at dusk', 'Day trip to the Taj Mahal in Agra', 'Eat breakfast at Paranthe Wali Gali'],
    heroUnsplashQuery: 'Delhi India Humayun tomb',
  },
  {
    city: 'Istanbul', country: 'Turkey', countryCode: 'TR', slug: 'istanbul',
    overview: 'Istanbul is the only city in the world on two continents, and it wears this distinction with casual magnificence. The Hagia Sophia and the Blue Mosque face each other across a square that has hosted 1,500 years of history. The Grand Bazaar remains one of the world\'s great markets. The Bosphorus divides Europe from Asia, and a sunset ferry crossing is one of travel\'s great free pleasures.',
    bestTime: 'April–June and September–October',
    budgetRange: { low: 50, high: 150, currency: 'USD' },
    topActivities: ['Visit Hagia Sophia and the Blue Mosque', 'Get lost in the Grand Bazaar', 'Take a Bosphorus sunset ferry', 'Explore the Spice Bazaar and Eminönü', 'Day trip to Princes\' Islands'],
    heroUnsplashQuery: 'Istanbul Bosphorus mosque',
  },
  {
    city: 'Marrakech', country: 'Morocco', countryCode: 'MA', slug: 'marrakech',
    overview: 'Marrakech is a city designed to overwhelm — and it succeeds. The Djemaa el-Fna square transforms from market to carnival as the sun sets, acrobats and snake charmers giving way to food stalls and storytellers. The medina\'s souks are a labyrinth of spices, leather, and lanterns. The riad hotel culture turns ordinary lodging into an extraordinary experience.',
    bestTime: 'March–May and October–November',
    budgetRange: { low: 40, high: 130, currency: 'USD' },
    topActivities: ['Explore the Djemaa el-Fna at sunset', 'Get lost in the souk labyrinth', 'Visit the Bahia Palace and Saadian Tombs', 'Day trip to the Atlas Mountains or Essaouira', 'Hammam and spa experience in the medina'],
    heroUnsplashQuery: 'Marrakech medina Morocco',
  },
  {
    city: 'Sydney', country: 'Australia', countryCode: 'AU', slug: 'sydney',
    overview: 'Sydney is the city everyone pictures when they think of Australia: the Opera House, the Harbour Bridge, Bondi Beach. These icons are real and genuinely magnificent. But Sydney is also a city of brilliant beaches beyond Bondi, a world-class food scene, and surrounding national parks that put wilderness within an hour of the CBD. The harbour at sunset remains one of the world\'s great urban views.',
    bestTime: 'September to November and March to May',
    budgetRange: { low: 100, high: 280, currency: 'USD' },
    topActivities: ['Walk the Bondi to Coogee coastal path', 'Climb the Sydney Harbour Bridge', 'Tour the Sydney Opera House', 'Day trip to the Blue Mountains', 'Ferry to Manly beach and village'],
    heroUnsplashQuery: 'Sydney Opera House harbour',
  },
  {
    city: 'Lisbon', country: 'Portugal', countryCode: 'PT', slug: 'lisbon',
    overview: 'Lisbon is Europe\'s most underrated capital — a city of seven hills, tiled facades, melancholy fado music, and some of the continent\'s best value for money. The Alfama neighbourhood tumbles down towards the Tagus with medieval grace. The food is quietly world-class. The wine (especially Vinho Verde) is affordable and outstanding. Lisbon rewards wandering without a plan.',
    bestTime: 'March–May and September–October',
    budgetRange: { low: 60, high: 160, currency: 'USD' },
    topActivities: ['Ride Tram 28 through the Alfama', 'Visit Jerónimos Monastery in Belém', 'Eat a pastel de nata at Pastéis de Belém', 'Watch fado at a traditional casa de fado', 'Day trip to Sintra and its fairy-tale palaces'],
    heroUnsplashQuery: 'Lisbon Alfama tram Portugal',
  },
  {
    city: 'Prague', country: 'Czech Republic', countryCode: 'CZ', slug: 'prague',
    overview: 'Prague is one of Europe\'s most beautiful cities, its medieval old town miraculously surviving WWII intact. The Astronomical Clock, Charles Bridge, and Prague Castle all live up to the photographs. The city is also a delight to explore beyond the famous sights — the Art Nouveau cafés, the jazz bars, and the incredible Czech beer culture (Pilsner Urquell was invented here). ',
    bestTime: 'May–June and September–October',
    budgetRange: { low: 50, high: 130, currency: 'USD' },
    topActivities: ['Watch the Astronomical Clock strike on Old Town Square', 'Walk Charles Bridge at dawn', 'Explore Prague Castle complex', 'Visit the Jewish Quarter (Josefov)', 'Beer tasting in a traditional pivnice (pub)'],
    heroUnsplashQuery: 'Prague old town castle bridge',
  },
  {
    city: 'Maldives', country: 'Maldives', countryCode: 'MV', slug: 'maldives',
    overview: 'The Maldives is the world\'s most dramatic expression of the overwater bungalow fantasy — a thousand coral islands scattered across the Indian Ocean, some barely a few feet above sea level. The water is impossibly turquoise, the reefs alive with manta rays and whale sharks, and the private island resorts deliver a level of seclusion that feels like the edge of the world. Budget options exist via guesthouses on local islands.',
    bestTime: 'November to April (dry northeast monsoon)',
    budgetRange: { low: 150, high: 1000, currency: 'USD' },
    topActivities: ['Snorkelling on the house reef', 'Dolphin watching sunset cruise', 'Diving with manta rays at Hanifaru Bay', 'Sandbank picnic excursion', 'Bioluminescent beach walk at night'],
    heroUnsplashQuery: 'Maldives overwater bungalow turquoise',
  },
  {
    city: 'Kyoto', country: 'Japan', countryCode: 'JP', slug: 'kyoto',
    overview: 'Kyoto is Japan\'s ancient capital and cultural soul — a city of 1,600 Buddhist temples, 400 Shinto shrines, and the country\'s most intact geisha district. Arashiyama\'s bamboo groves, Fushimi Inari\'s 10,000 torii gates, and the Philosopher\'s Path lined with cherry blossoms are among Japan\'s most iconic sights. Kyoto rewards early mornings before the crowds arrive.',
    bestTime: 'March–May (cherry blossom) and November (autumn foliage)',
    budgetRange: { low: 70, high: 200, currency: 'USD' },
    topActivities: ['Walk through the Fushimi Inari torii gates at dawn', 'Explore Arashiyama bamboo grove', 'Visit Kinkaku-ji (Golden Pavilion)', 'Stroll Gion district hoping to spot a geisha', 'Tea ceremony experience in a machiya townhouse'],
    heroUnsplashQuery: 'Kyoto temple cherry blossom Japan',
  },
  {
    city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', slug: 'amsterdam',
    overview: 'Amsterdam is a city built on water and liberalism, its famous canal ring a UNESCO World Heritage Site that doubles as the world\'s most liveable urban design. Golden Age merchant houses line the Herengracht. The Rijksmuseum holds Rembrandt\'s Night Watch. The Anne Frank House speaks softly and devastatingly. And at night, Leidseplein and Rembrandtplein fill with the energy that has defined Amsterdam for centuries.',
    bestTime: 'April–May (tulip season) and September–October',
    budgetRange: { low: 80, high: 220, currency: 'USD' },
    topActivities: ['Cycle along the canals at golden hour', 'Visit the Rijksmuseum (book ahead)', 'Tour the Anne Frank House (book weeks ahead)', 'Day trip to Keukenhof tulip gardens (April–May)', 'Evening canal boat tour'],
    heroUnsplashQuery: 'Amsterdam canal bicycles Netherlands',
  },
  {
    city: 'Cape Town', country: 'South Africa', countryCode: 'ZA', slug: 'cape-town',
    overview: 'Cape Town is the most dramatically beautiful city in the world — Table Mountain presides over a city at the tip of a continent, where two oceans meet, and where wine estates, penguins, great white sharks, and some of Africa\'s finest cuisine coexist within an hour\'s drive. The V&A Waterfront, Bo-Kaap\'s colourful streets, and the Cape Winelands make it genuinely difficult to plan a bad day here.',
    bestTime: 'November to March (austral summer)',
    budgetRange: { low: 50, high: 160, currency: 'USD' },
    topActivities: ['Take the cable car up Table Mountain', 'Drive the Cape Point scenic route', 'Visit the penguins at Boulders Beach', 'Wine tasting in Stellenbosch or Franschhoek', 'Walk through Bo-Kaap neighbourhood'],
    heroUnsplashQuery: 'Cape Town Table Mountain ocean',
  },
  {
    city: 'New York', country: 'United States', countryCode: 'US', slug: 'new-york',
    overview: 'New York is the most famous city on earth and still manages to exceed expectations. The skyline from the Brooklyn Bridge is real. Central Park in autumn is real. The energy of Midtown at rush hour is overwhelming in the best possible way. Every neighbourhood is its own city — Williamsburg, Chinatown, Harlem, Greenwich Village — and the food scene represents every cuisine on earth at every price point.',
    bestTime: 'September–November and April–June',
    budgetRange: { low: 120, high: 400, currency: 'USD' },
    topActivities: ['Walk the Brooklyn Bridge at dawn', 'Explore Central Park on a weekend morning', 'Visit the Metropolitan Museum of Art', 'Take the free Staten Island Ferry for Statue of Liberty views', 'Eat bagels, pizza, and pastrami in their spiritual homes'],
    heroUnsplashQuery: 'New York skyline Manhattan night',
  },
  {
    city: 'Vienna', country: 'Austria', countryCode: 'AT', slug: 'vienna',
    overview: 'Vienna is the Austro-Hungarian Empire crystallised in stone — grand palaces, cream-coloured coffee houses, and concert halls where Mozart and Beethoven premiered their greatest works. The Kunsthistorisches Museum holds one of Europe\'s finest art collections. The Ringstrasse is a boulevard built to impress. And the coffee house culture — Wiener Melange, Sachertorte, newspapers on cane holders — remains wonderfully intact.',
    bestTime: 'April–June and September–October',
    budgetRange: { low: 80, high: 200, currency: 'USD' },
    topActivities: ['Visit Schönbrunn Palace and gardens', 'Attend an evening concert at the Musikverein or Staatsoper', 'Linger in a traditional Viennese Kaffeehaus', 'Explore the Kunsthistorisches Museum', 'Walk the Ringstrasse and admire the Habsburg architecture'],
    heroUnsplashQuery: 'Vienna Schonbrunn Palace Austria',
  },
  {
    city: 'Seoul', country: 'South Korea', countryCode: 'KR', slug: 'seoul',
    overview: 'Seoul is one of the great modern metropolises — a city of 10 million people that somehow manages to feel both ancient and cutting-edge at the same time. Gyeongbok Palace stands surrounded by glass towers. The Bukchon Hanok Village preserves 600-year-old courtyard houses. The street food in Gwangjang Market is world-class. And the city\'s café culture, K-pop fashion in Hongdae, and night markets run until dawn.',
    bestTime: 'March–May and September–November',
    budgetRange: { low: 60, high: 160, currency: 'USD' },
    topActivities: ['Visit Gyeongbokgung Palace at opening time', 'Explore Bukchon Hanok Village', 'Eat tteokbokki and bindaetteok in Gwangjang Market', 'Take the cable car to Namsan Tower', 'Shop and eat in Myeongdong and Hongdae'],
    heroUnsplashQuery: 'Seoul Korea Gyeongbokgung Palace',
  },
  {
    city: 'Budapest', country: 'Hungary', countryCode: 'HU', slug: 'budapest',
    overview: 'Budapest is perhaps Europe\'s most underestimated capital — divided by the Danube into Buda\'s hilly, castle-crowned west bank and Pest\'s flat, café-lined east bank. The Parliament building is one of Europe\'s most spectacular, the Chain Bridge is iconic, and the thermal bath culture (Széchenyi, Gellért) is unlike anywhere else on the continent. Budapest is also extraordinarily affordable.',
    bestTime: 'April–June and September–October',
    budgetRange: { low: 45, high: 120, currency: 'USD' },
    topActivities: ['Soak in Széchenyi or Gellért thermal baths', 'Walk across the Chain Bridge at sunset', 'Explore Buda Castle and the Fishermen\'s Bastion', 'Take a Danube evening cruise', 'Eat lángos and goulash in the Great Market Hall'],
    heroUnsplashQuery: 'Budapest Parliament Danube night',
  },
  {
    city: 'Phuket', country: 'Thailand', countryCode: 'TH', slug: 'phuket',
    overview: 'Phuket is Thailand\'s largest island and one of Southeast Asia\'s most popular beach destinations — for good reason. Patong Beach is the rowdy centrepiece, but the island stretches well beyond: the limestone karsts of Phang Nga Bay, the serene beaches of Kata and Kamala, the temple culture of Phuket Town, and world-class snorkelling and diving. Phuket works for families, couples, and solo travellers equally.',
    bestTime: 'November to April (dry season)',
    budgetRange: { low: 35, high: 120, currency: 'USD' },
    topActivities: ['Day trip to Phang Nga Bay by longtail boat', 'Snorkelling at Ko Phi Phi or Similan Islands', 'Visit Big Buddha viewpoint at sunset', 'Explore Phuket Old Town\'s Sino-Portuguese shophouses', 'Take a Thai cooking class'],
    heroUnsplashQuery: 'Phuket Thailand beach limestone',
  },
  {
    city: 'Hanoi', country: 'Vietnam', countryCode: 'VN', slug: 'hanoi',
    overview: 'Hanoi is Vietnam\'s ancient, complex capital — a city of 1,000 years of history with French colonial boulevards, narrow Old Quarter streets where each lane sells a single trade, and one of the world\'s great street food cultures. The Hoan Kiem Lake at dawn, the chaos of motorbike traffic, the smell of pho from pavement kitchens — Hanoi is sensory overload in the most wonderful way.',
    bestTime: 'October to April (cool dry season)',
    budgetRange: { low: 25, high: 80, currency: 'USD' },
    topActivities: ['Walk around Hoan Kiem Lake at dawn', 'Explore the Old Quarter\'s 36 ancient streets', 'Take a 2-day cruise on Ha Long Bay', 'Eat bun cha, pho, and banh mi from street stalls', 'Visit the Ho Chi Minh Mausoleum and Temple of Literature'],
    heroUnsplashQuery: 'Hanoi Ha Long Bay Vietnam',
  },
  {
    city: 'Goa', country: 'India', countryCode: 'IN', slug: 'goa',
    overview: 'Goa is India\'s smallest state and most un-Indian destination — a former Portuguese colony where Catholic churches stand beside Hindu temples, where beach shacks serve fresh seafood and cold Kingfisher, and where the pace of life drops to something approaching tropical. North Goa\'s Baga and Calangute are festive and busy; South Goa\'s Palolem and Agonda are quieter and more beautiful. Goa works in all its moods.',
    bestTime: 'November to February',
    budgetRange: { low: 20, high: 80, currency: 'USD' },
    topActivities: ['Beach hopping from Anjuna to Palolem', 'Visit the Basilica of Bom Jesus in Old Goa', 'Eat fish curry rice at a local village restaurant', 'Sunset cruise on the Mandovi River', 'Explore Fontainhas (Latin Quarter) in Panaji'],
    heroUnsplashQuery: 'Goa beach India sunset',
  },
  {
    city: 'Jaipur', country: 'India', countryCode: 'IN', slug: 'jaipur',
    overview: 'Jaipur is the Pink City — its old town painted terracotta-rose by order of the Maharaja to welcome the Prince of Wales in 1876, and still that colour today. The Amber Fort is one of India\'s most spectacular, the Hawa Mahal (Palace of the Winds) its most photographed, and the City Palace its most opulent. Jaipur is the jewel of Rajasthan and the ideal first stop on the Golden Triangle circuit.',
    bestTime: 'October to March',
    budgetRange: { low: 20, high: 80, currency: 'USD' },
    topActivities: ['Explore Amber Fort by sunrise light', 'Visit the Hawa Mahal (Palace of Winds)', 'Shop for textiles and jewellery in Johari Bazaar', 'See the City Palace and Jantar Mantar', 'Elephant and camel rides at Chokhi Dhani village'],
    heroUnsplashQuery: 'Jaipur Amber Fort Rajasthan India',
  },
  {
    city: 'London', country: 'United Kingdom', countryCode: 'GB', slug: 'london',
    overview: 'London is one of the world\'s great cities — a place where the oldest institutions of civilisation (Parliament, the British Museum, Westminster Abbey) coexist with the most dynamic restaurant scene in Europe, art galleries that are free to enter, and 33 boroughs each with their own distinct character. The tube connects it all. Rain is likely. It is absolutely worth it.',
    bestTime: 'May–June and September (shoulder season)',
    budgetRange: { low: 120, high: 350, currency: 'USD' },
    topActivities: ['Walk along the South Bank and cross the Millennium Bridge', 'Visit the British Museum (free entry)', 'Borough Market for breakfast and lunch', 'Tower of London and Tower Bridge at dusk', 'Day trip to Oxford or Bath'],
    heroUnsplashQuery: 'London Big Ben Thames bridge',
  },
  {
    city: 'Dubai', country: 'UAE', countryCode: 'AE', slug: 'dubai',
    overview: 'Dubai is a city that refuses to be subtle. It has the world\'s tallest building, largest shopping mall, and an indoor ski slope in the desert. Beneath the superlatives is a genuinely exciting city built from sand in a single generation. The old Gold and Spice Souks, Creek dhow rides, and Al Fahidi neighbourhood reveal a quieter story.',
    bestTime: 'November to March',
    budgetRange: { low: 100, high: 350, currency: 'USD' },
    topActivities: ['Ascend the Burj Khalifa At The Top', 'Desert safari with dune bashing', 'Explore Gold and Spice Souks', 'Visit the Frame', 'Swim at Jumeirah Beach'],
    heroUnsplashQuery: 'Dubai Burj Khalifa skyline',
  },
];

export function getDestinationData(city: string, countryCode: string): DestinationData | null {
  return DESTINATION_DATA.find(
    (d) => d.city.toLowerCase() === city.toLowerCase() && d.countryCode === countryCode
  ) ?? DESTINATION_DATA.find(
    (d) => d.slug === city.toLowerCase().replace(/\s+/g, '-')
  ) ?? null;
}
