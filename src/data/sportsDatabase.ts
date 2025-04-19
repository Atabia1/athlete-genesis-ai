
// Comprehensive sports database with categorization
export type Sport = {
  id: string;
  name: string;
  category: string;
  description?: string;
};

export const sportsCategories = [
  "Team Sports",
  "Individual Sports",
  "Combat Sports",
  "Water Sports",
  "Winter Sports",
  "Track & Field",
  "Racket Sports",
  "Strength Sports",
  "Cycling",
  "Outdoor/Adventure",
  "Mind Sports",
  "Motor Sports",
  "Gymnastics",
  "Target Sports",
  "Extreme Sports",
  "Fitness Activities"
];

export const sportsList: Sport[] = [
  // Team Sports
  { id: "soccer", name: "Soccer", category: "Team Sports", description: "A team sport played with a spherical ball between two teams of 11 players." },
  { id: "basketball", name: "Basketball", category: "Team Sports", description: "A team sport in which two teams attempt to score points by shooting a ball through a hoop." },
  { id: "baseball", name: "Baseball", category: "Team Sports", description: "A bat-and-ball game played between two teams of nine players each." },
  { id: "volleyball", name: "Volleyball", category: "Team Sports", description: "A team sport in which two teams of six players are separated by a net." },
  { id: "american-football", name: "American Football", category: "Team Sports", description: "A team sport played by two teams of 11 players on a rectangular field." },
  { id: "rugby", name: "Rugby", category: "Team Sports", description: "A team sport played with an oval ball by two teams of 15 players." },
  { id: "cricket", name: "Cricket", category: "Team Sports", description: "A bat-and-ball game played between two teams of 11 players on a field." },
  { id: "field-hockey", name: "Field Hockey", category: "Team Sports", description: "A team sport played on turf with a small, hard ball and hockey sticks." },
  { id: "ice-hockey", name: "Ice Hockey", category: "Team Sports", description: "A team sport played on ice, with players using sticks to direct a puck into the opposing team's goal." },
  { id: "handball", name: "Handball", category: "Team Sports", description: "A team sport in which two teams of seven players pass a ball using their hands." },
  { id: "lacrosse", name: "Lacrosse", category: "Team Sports", description: "A team sport played with a lacrosse stick and a lacrosse ball." },
  { id: "water-polo", name: "Water Polo", category: "Team Sports", description: "A team water sport played in a swimming pool with a ball and goals." },
  { id: "ultimate-frisbee", name: "Ultimate Frisbee", category: "Team Sports", description: "A non-contact team sport played with a flying disc." },
  { id: "netball", name: "Netball", category: "Team Sports", description: "A ball sport played by two teams of seven players." },
  { id: "futsal", name: "Futsal", category: "Team Sports", description: "A variant of association football played on a hard court with five players per side." },
  
  // Individual Sports
  { id: "tennis", name: "Tennis", category: "Racket Sports", description: "A racket sport played on a rectangular court with a net in the middle." },
  { id: "golf", name: "Golf", category: "Individual Sports", description: "A club-and-ball sport in which players use various clubs to hit balls into a series of holes." },
  { id: "swimming", name: "Swimming", category: "Water Sports", description: "A water-based activity involving movement through water using limbs." },
  { id: "running", name: "Running", category: "Track & Field", description: "A method of terrestrial locomotion allowing humans to move rapidly on foot." },
  { id: "cycling", name: "Cycling", category: "Cycling", description: "The use of bicycles for transport, recreation, exercise, or sport." },
  { id: "badminton", name: "Badminton", category: "Racket Sports", description: "A racket sport played using rackets to hit a shuttlecock across a net." },
  { id: "table-tennis", name: "Table Tennis", category: "Racket Sports", description: "A sport in which two or four players hit a lightweight ball back and forth across a table." },
  { id: "squash", name: "Squash", category: "Racket Sports", description: "A racket sport played by two or four players in a four-walled court." },
  
  // Combat Sports
  { id: "boxing", name: "Boxing", category: "Combat Sports", description: "A combat sport in which two people throw punches at each other wearing padded gloves." },
  { id: "mma", name: "Mixed Martial Arts", category: "Combat Sports", description: "A full-contact combat sport that allows striking and grappling." },
  { id: "wrestling", name: "Wrestling", category: "Combat Sports", description: "A combat sport involving grappling techniques such as throws and takedowns." },
  { id: "judo", name: "Judo", category: "Combat Sports", description: "A modern martial art and Olympic sport created in Japan in 1882." },
  { id: "taekwondo", name: "Taekwondo", category: "Combat Sports", description: "A Korean martial art characterized by its emphasis on head-height kicks." },
  { id: "karate", name: "Karate", category: "Combat Sports", description: "A martial art developed in the Ryukyu Kingdom, now part of Japan." },
  { id: "fencing", name: "Fencing", category: "Combat Sports", description: "A group of three related combat sports using different bladed weapons." },
  { id: "brazilian-jiu-jitsu", name: "Brazilian Jiu-Jitsu", category: "Combat Sports", description: "A martial art and combat sport based on ground fighting and submission holds." },
  { id: "muay-thai", name: "Muay Thai", category: "Combat Sports", description: "A combat sport of Thailand that uses stand-up striking and clinching techniques." },
  
  // Water Sports
  { id: "surfing", name: "Surfing", category: "Water Sports", description: "A surface water sport in which the wave rider stands on a surfboard." },
  { id: "diving", name: "Diving", category: "Water Sports", description: "The sport of jumping or falling into water from a platform or springboard." },
  { id: "sailing", name: "Sailing", category: "Water Sports", description: "The propulsion of a boat by harnessing the power of wind with sails." },
  { id: "rowing", name: "Rowing", category: "Water Sports", description: "A sport in which athletes race against each other on rivers, lakes, or oceans." },
  { id: "kayaking", name: "Kayaking", category: "Water Sports", description: "A water sport using a small, narrow boat propelled by a double-bladed paddle." },
  { id: "canoeing", name: "Canoeing", category: "Water Sports", description: "A paddling sport in which you kneel or sit facing forward in an open vessel." },
  { id: "kitesurfing", name: "Kitesurfing", category: "Water Sports", description: "A surface water sport combining aspects of wakeboarding, windsurfing, surfing, and paragliding." },
  { id: "windsurfing", name: "Windsurfing", category: "Water Sports", description: "A form of sailing where a board is powered across the water by wind." },
  { id: "paddleboarding", name: "Paddleboarding", category: "Water Sports", description: "A surface water sport in which participants are propelled by a paddle." },
  
  // Winter Sports
  { id: "skiing", name: "Skiing", category: "Winter Sports", description: "A recreational activity and competitive winter sport using skis to glide on snow." },
  { id: "snowboarding", name: "Snowboarding", category: "Winter Sports", description: "A winter sport that involves descending a snow-covered slope on a snowboard." },
  { id: "figure-skating", name: "Figure Skating", category: "Winter Sports", description: "A sport in which individuals or pairs perform on figure skates on ice." },
  { id: "ice-skating", name: "Ice Skating", category: "Winter Sports", description: "Moving on ice by using ice skates." },
  { id: "bobsleigh", name: "Bobsleigh", category: "Winter Sports", description: "A winter sport in which teams of two or four make timed runs down narrow, twisting, banked tracks." },
  { id: "curling", name: "Curling", category: "Winter Sports", description: "A sport in which players slide stones on a sheet of ice toward a target area." },
  { id: "speed-skating", name: "Speed Skating", category: "Winter Sports", description: "A competitive form of ice skating in which competitors race each other." },
  { id: "cross-country-skiing", name: "Cross-Country Skiing", category: "Winter Sports", description: "A form of skiing where skiers rely on their own locomotion to move across snow-covered terrain." },
  
  // Track & Field
  { id: "sprinting", name: "Sprinting", category: "Track & Field", description: "Running over a short distance in a limited period of time." },
  { id: "long-distance-running", name: "Long Distance Running", category: "Track & Field", description: "A form of continuous running over distances of at least 3 kilometers." },
  { id: "marathon", name: "Marathon", category: "Track & Field", description: "A long-distance running race with an official distance of 42.195 kilometers." },
  { id: "high-jump", name: "High Jump", category: "Track & Field", description: "A track and field event in which competitors must jump over a horizontal bar." },
  { id: "long-jump", name: "Long Jump", category: "Track & Field", description: "A track and field event in which athletes combine speed and agility to jump for distance." },
  { id: "triple-jump", name: "Triple Jump", category: "Track & Field", description: "A track and field event similar to the long jump but with a hop, step, and jump." },
  { id: "pole-vault", name: "Pole Vault", category: "Track & Field", description: "A track and field event in which a person uses a long flexible pole to jump over a bar." },
  { id: "shot-put", name: "Shot Put", category: "Track & Field", description: "A track and field event involving 'putting' a heavy spherical object as far as possible." },
  { id: "javelin-throw", name: "Javelin Throw", category: "Track & Field", description: "A track and field event where the javelin is thrown for distance." },
  { id: "discus-throw", name: "Discus Throw", category: "Track & Field", description: "A track and field event in which an athlete throws a heavy disc for distance." },
  { id: "hammer-throw", name: "Hammer Throw", category: "Track & Field", description: "A track and field event in which a heavy metal ball on a wire is thrown for distance." },
  { id: "hurdles", name: "Hurdles", category: "Track & Field", description: "A race where runners must jump over obstacles called hurdles." },
  
  // Strength Sports
  { id: "weightlifting", name: "Weightlifting", category: "Strength Sports", description: "A sport in which competitors attempt to lift heavyweights in a prescribed manner." },
  { id: "powerlifting", name: "Powerlifting", category: "Strength Sports", description: "A strength sport that consists of three attempts at maximal weight on three lifts." },
  { id: "bodybuilding", name: "Bodybuilding", category: "Strength Sports", description: "The use of progressive resistance exercise to control and develop one's musculature." },
  { id: "crossfit", name: "CrossFit", category: "Strength Sports", description: "A branded fitness regimen involving constantly varied functional movements performed at high intensity." },
  { id: "strongman", name: "Strongman", category: "Strength Sports", description: "A sport which tests competitors' strength in a variety of different ways." },
  
  // Cycling
  { id: "road-cycling", name: "Road Cycling", category: "Cycling", description: "The sport of bicycle racing on paved roads." },
  { id: "mountain-biking", name: "Mountain Biking", category: "Cycling", description: "The sport of riding bicycles off-road, over rough terrain." },
  { id: "bmx", name: "BMX", category: "Cycling", description: "A cycle sport performed on BMX bikes on dirt, street, or ramp tracks." },
  { id: "track-cycling", name: "Track Cycling", category: "Cycling", description: "A bicycle racing sport held on specially built banked tracks or velodromes." },
  { id: "cyclocross", name: "Cyclocross", category: "Cycling", description: "A form of bicycle racing consisting of many laps of a short course featuring pavement, wooded trails, and obstacles." },
  
  // Outdoor/Adventure
  { id: "rock-climbing", name: "Rock Climbing", category: "Outdoor/Adventure", description: "A sport in which participants climb up, down, or across natural rock formations or artificial rock walls." },
  { id: "hiking", name: "Hiking", category: "Outdoor/Adventure", description: "A long, vigorous walk, usually on trails or footpaths in the countryside." },
  { id: "trail-running", name: "Trail Running", category: "Outdoor/Adventure", description: "A sport-activity which combines running and hiking on trails." },
  { id: "orienteering", name: "Orienteering", category: "Outdoor/Adventure", description: "A group of sports that require navigational skills using a map and compass to navigate." },
  { id: "parkour", name: "Parkour", category: "Outdoor/Adventure", description: "A training discipline using movement that developed from military obstacle course training." },
  { id: "skateboarding", name: "Skateboarding", category: "Outdoor/Adventure", description: "An action sport which involves riding and performing tricks using a skateboard." },
  { id: "snowshoeing", name: "Snowshoeing", category: "Outdoor/Adventure", description: "A form of hiking in which participants wear specialized footwear to walk on snow." },
  
  // Mind Sports
  { id: "chess", name: "Chess", category: "Mind Sports", description: "A board game of strategic skill for two players." },
  { id: "esports", name: "Esports", category: "Mind Sports", description: "A form of competition using video games." },
  { id: "poker", name: "Poker", category: "Mind Sports", description: "A family of card games involving betting and individual play." },
  
  // Motor Sports
  { id: "formula1", name: "Formula 1", category: "Motor Sports", description: "The highest class of single-seater auto racing sanctioned by the FIA." },
  { id: "motocross", name: "Motocross", category: "Motor Sports", description: "A form of off-road motorcycle racing held on enclosed off-road circuits." },
  { id: "rally", name: "Rally", category: "Motor Sports", description: "A form of motorsport that takes place on public or private roads with modified production or specially built road-legal cars." },
  
  // Gymnastics
  { id: "artistic-gymnastics", name: "Artistic Gymnastics", category: "Gymnastics", description: "A discipline of gymnastics in which athletes perform short routines on different apparatus." },
  { id: "rhythmic-gymnastics", name: "Rhythmic Gymnastics", category: "Gymnastics", description: "A sport in which individuals or teams of competitors manipulate one or more apparatus." },
  { id: "trampoline", name: "Trampoline", category: "Gymnastics", description: "A competitive sport in which gymnasts perform acrobatics while bouncing on a trampoline." },
  
  // Target Sports
  { id: "archery", name: "Archery", category: "Target Sports", description: "The art, sport, practice, or skill of using a bow to shoot arrows." },
  { id: "shooting", name: "Shooting", category: "Target Sports", description: "The act or sport of firing a rifle, shotgun, or handgun." },
  { id: "darts", name: "Darts", category: "Target Sports", description: "A form of throwing sport in which darts are thrown at a circular target." },
  
  // Extreme Sports
  { id: "base-jumping", name: "BASE Jumping", category: "Extreme Sports", description: "Parachuting from a fixed structure or cliff." },
  { id: "bungee-jumping", name: "Bungee Jumping", category: "Extreme Sports", description: "An activity that involves jumping from a tall structure while connected to a large elastic cord." },
  { id: "paragliding", name: "Paragliding", category: "Extreme Sports", description: "The recreational and competitive adventure sport of flying paragliders." },
  
  // Fitness Activities
  { id: "pilates", name: "Pilates", category: "Fitness Activities", description: "A physical fitness system developed in the early 20th century by Joseph Pilates." },
  { id: "yoga", name: "Yoga", category: "Fitness Activities", description: "A group of physical, mental, and spiritual practices which originated in ancient India." },
  { id: "zumba", name: "Zumba", category: "Fitness Activities", description: "A fitness program that combines Latin and international music with dance moves." },
  { id: "hiit", name: "HIIT", category: "Fitness Activities", description: "High-intensity interval training, a cardiovascular exercise strategy." },
  { id: "functional-training", name: "Functional Training", category: "Fitness Activities", description: "Training that focuses on building a body capable of performing real-life activities." },
  { id: "group-fitness", name: "Group Fitness", category: "Fitness Activities", description: "Exercise performed by a group of individuals led by an instructor." },
  { id: "aerobics", name: "Aerobics", category: "Fitness Activities", description: "A form of physical exercise that combines rhythmic aerobic exercise with stretching and strength training." },
  { id: "calisthenics", name: "Calisthenics", category: "Fitness Activities", description: "A form of exercise consisting of a variety of movements which exercise large muscle groups." }
];

// Helper function to get sports by category
export const getSportsByCategory = (category: string): Sport[] => {
  return sportsList.filter(sport => sport.category === category);
};

// Helper function to search sports
export const searchSports = (query: string): Sport[] => {
  const lowerCaseQuery = query.toLowerCase();
  return sportsList.filter(sport => 
    sport.name.toLowerCase().includes(lowerCaseQuery) || 
    sport.category.toLowerCase().includes(lowerCaseQuery) ||
    (sport.description && sport.description.toLowerCase().includes(lowerCaseQuery))
  );
};
