import { Occasion, TemplateItem, CategoryItem, Testimonial } from '../types';
import birthdayImg from '../assets/images/birthday.png';
import coupleImg from '../assets/images/couple.jpg';
import valantinesImg from '../assets/images/valantines.png';
import bestfriendImg from '../assets/images/bestfriend.jpg';
import familyImg from '../assets/images/family.jpg';
import festivalsImg from '../assets/images/festivals.jpg';

export const OCCASIONS: Occasion[] = [
  {
    id: 'birthday',
    name: 'Birthday',
    iconUrl: '🎉',
    tagline: 'Interactive cake, fireworks & music',
    image: birthdayImg,
  },
  {
    id: 'couple',
    name: 'Couple',
    iconUrl: '💑',
    tagline: 'Relationship timeline & secret notes',
    image: coupleImg,
  },
  {
    id: 'valentines',
    name: "Valentine's",
    iconUrl: '❤️',
    tagline: 'Heartbeat animations & love notes',
    image: valantinesImg,
  },
  {
    id: 'best friend',
    name: 'Best Friend',
    iconUrl: '🤝',
    tagline: 'Memories slideshow & funny quotes',
    image: bestfriendImg,
  },
  {
    id: 'family',
    name: 'Family',
    iconUrl: '👨‍👩‍👧‍👦',
    tagline: 'Family bonding & memory gallery',
    image: familyImg,
  },
  {
    id: 'festival',
    name: 'Festivals',
    iconUrl: '🪔',
    tagline: 'Diwali, Eid, Christmas & New Year',
    image: festivalsImg,
  },
];

export const POPULAR_CATEGORIES = [
  {
    id: 'bday-3d',
    name: 'Cake Websites',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'love-story',
    name: 'Couple Love Stories',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'proposal-links',
    name: 'Runaway "No" Proposals',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'neon-bday',
    name: 'Neon Party Links',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'bff-memes',
    name: 'BFF Memes & Roast',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'festive-glow',
    name: 'Festive Greeting Pages',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'custom-song',
    name: 'Custom Song Links',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300'
  }
];

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'web-bday-royal',
    title: 'Royal Birthday Celebration Website',
    occasions: ['birthday'],
    price: 199,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=90&w=1200',
    description: 'An interactive birthday wishing webpage featuring virtual cake cutting with custom candles, confetti explosion, background song, and photo flipbook.',
    includes: [
      'Interactive Virtual Cake Cutting',
      'Confetti & Fireworks Particle FX',
      'Background MP3 Music Player',
      'Unlimited Memory Photo Gallery Carousel',
      'Instant Shareable WhatsApp Link'
    ],
    customizableFields: ['Birthday Person Name', 'Your Name', 'Personal Message', 'Multiple Photos', 'Favorite Song'],
    badge: 'Bestseller'
  },
  {
    id: 'web-anni-forever',
    title: 'Forever Yours - Couple Love Story Webpage',
    occasions: ['anniversary', 'valentines'],
    price: 249,
    originalPrice: 599,
    rating: 4.95,
    reviewsCount: 280,
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=90&w=1200',
    description: 'A deeply romantic interactive website that tells your beautiful love journey with a custom relationship counter clock, love letters, and romantic background melody.',
    includes: [
      'Days Together Live Relationship Counter',
      'Romantic Music & Heart Floating Effect',
      'Secret Tap-to-Reveal Love Messages',
      'Couple Memories Timeline',
      'Lifetime Link Validity'
    ],
    customizableFields: ['Partner Names', 'Anniversary Date', 'Love Letter', 'Couple Pictures', 'Romantic Song'],
    badge: 'Trending'
  },
  {
    id: 'web-bday-neon',
    title: 'Neon Midnight Birthday Party Link',
    occasions: ['birthday'],
    price: 149,
    originalPrice: 399,
    rating: 4.8,
    reviewsCount: 195,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=90&w=1200',
    description: 'Ultra-modern dark theme birthday website with glowing neon animations, dynamic party countdown timer, balloon pop game, and customized greeting card.',
    includes: [
      'Interactive Balloon Pop Mini-Game',
      'Neon Glowing Typography & FX',
      'Birthday Wish Counter',
      'Custom Voice / Audio Message Support',
      'Instant WhatsApp Share Button'
    ],
    customizableFields: ['Recipient Name', 'Sender Name', 'Party Wishes', 'Photos'],
    badge: 'Hot'
  },
  {
    id: 'web-bff-vibes',
    title: 'BFF Crazy Memories & Roast Website',
    occasions: ['friendship', 'birthday'],
    price: 129,
    originalPrice: 299,
    rating: 4.85,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=90&w=1200',
    description: 'A fun, quirky website made specifically for best friends with meme slideshows, secret nicknames, inside jokes, and high-energy music.',
    includes: [
      'Meme & Photo Carousel',
      'Fun Friendship Quiz Section',
      'Upbeat Party Music',
      'Custom Secret Nicknames'
    ],
    customizableFields: ['Bestie Name', 'Nicknames', 'Inside Joke Stories', 'Group Photos']
  },
  {
    id: 'web-val-proposal',
    title: 'Interactive "Will You Be My Valentine?" Website',
    occasions: ['valentines', 'sorry-love'],
    price: 199,
    originalPrice: 499,
    rating: 5.0,
    reviewsCount: 410,
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=90&w=1200',
    description: 'A cute proposal website with playful "Yes" and "No" buttons (where the "No" button runs away when hovered!), ending with romantic fireworks.',
    includes: [
      'Runaway "No" Button Interactive Game',
      'Romantic Fireworks & Rose Petals Falling',
      'Personal Love Note',
      'Custom Background Track'
    ],
    customizableFields: ['Crush / Partner Name', 'Your Name', 'Proposal Text', 'Romantic Photos'],
    badge: 'Viral'
  },
  {
    id: 'web-festive-glow',
    title: 'Animated Grand Festive Wishing Page',
    occasions: ['festive'],
    price: 99,
    originalPrice: 249,
    rating: 4.75,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=90&w=1200',
    description: 'Send warm festival wishes with traditional music, glowing diyas/lights, customized family greetings, and blessing messages.',
    includes: [
      'Interactive Glowing Diya / Light Tapping',
      'Traditional Festive Background Music',
      'Family Name Customization',
      '1-Click Broadcast Link for WhatsApp Groups'
    ],
    customizableFields: ['Family / Sender Name', 'Festival Name', 'Custom Message']
  }
];

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'bday',
    name: 'Birthday Cake Websites',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=500',
    itemCount: 24
  },
  {
    id: 'love',
    name: 'Love & Anniversary Links',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=500',
    itemCount: 18
  },
  {
    id: 'bff',
    name: 'Friendship & Memes',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=500',
    itemCount: 12
  },
  {
    id: 'festive',
    name: 'Festive Greeting Pages',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=500',
    itemCount: 15
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote: "I created a birthday cake wishing website for my sister. When she clicked the WhatsApp link and cut the cake virtually with fireworks and her favorite song, she literally cried with happiness! Best ₹199 ever spent.",
    author: 'Neha Sharma',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    occasionUsed: 'Sister Birthday'
  },
  {
    id: '2',
    quote: "The runaway 'No' button proposal link was hilarious and super romantic! Sent it to my girlfriend on Valentine's Day and she said YES! The link was generated instantly within 30 seconds.",
    author: 'Rohan Gupta',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    occasionUsed: 'Valentine Proposal'
  },
  {
    id: '3',
    quote: "Super easy to customize on my phone. Added 8 of our childhood photos, picked a song, and sent the custom link on WhatsApp. No physical courier hassles, instant digital surprise!",
    author: 'Aakash Verma',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    occasionUsed: 'Anniversary'
  }
];
