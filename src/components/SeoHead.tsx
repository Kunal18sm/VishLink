import React, { useEffect } from 'react';

interface SeoHeadProps {
  title?: string;
  description?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title = 'VishLink - Personalized Wishing Website Links | 3D Birthday Cake & Love Story Generator',
  description = "Create & share interactive personalized wishing website links for Birthdays, Couple Love Stories, Valentine's, and Anniversaries. Add custom 3D cakes, background songs, secret notes & photo galleries. Instant WhatsApp share!",
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update OG title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
  }, [title, description]);

  return null;
};
