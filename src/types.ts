export interface Occasion {
  id: string;
  name: string;
  iconUrl: string;
  tagline?: string;
  image?: string;
}

export interface TemplateItem {
  id: string;
  title: string;
  occasions: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  includes: string[]; // Webpage features like Music, Countdown, Photo Gallery
  customizableFields: string[];
  badge?: string;
  previewUrl?: string;
  imageNeeded?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  itemCount: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatar: string;
  rating: number;
  occasionUsed?: string;
}

export interface CartItem {
  template: TemplateItem;
  quantity: number;
  customization?: {
    recipientName: string;
    senderName: string;
    message: string;
    themeColor: string;
    uploadedImages?: string[];
    musicTrack?: string;
  };
}

export interface PurchasedOrder {
  id: string;
  wishingSlug: string; // e.g. "priya-happy-birthday-2026"
  wishingUrl: string;  // e.g. "https://vishlink.app/wish/priya-birthday"
  template: TemplateItem;
  senderName: string;
  receiverName: string;
  specialMessage: string;
  uploadedImages: string[];
  themeColor: string;
  totalPrice: number;
  purchaseDate: string;
  status: 'Active & Ready' | 'Link Generated';
  musicTrack?: string;
}
