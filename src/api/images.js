/**
 * Images API — Lamuka Market
 * Gestion des images d'articles (upload, analyse, variantes)
 */
import api from './client';

const images = {

  /**
   * Upload une image pour un article (multipart/form-data)
   * @param {number} articleId
   * @param {File} file - Fichier image
   * @returns {Promise<{id, url, thumbnail, full, analysis, variants, processing}>}
   */
  upload: (articleId, file) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.upload(`/vendor/articles/${articleId}/images`, fd);
  },

  /**
   * Upload une image en base64 (pour photos prises in-app)
   * @param {number} articleId
   * @param {string} base64 - Image en base64 (data:image/jpeg;base64,...)
   */
  uploadBase64: (articleId, base64) =>
    api.post(`/vendor/articles/${articleId}/images/base64`, { image: base64 }),

  /**
   * Lister les images d'un article
   * @returns {Promise<{images, count, max, remaining}>}
   */
  list: (articleId) =>
    api.get(`/vendor/articles/${articleId}/images`),

  /**
   * Réordonner les images
   * @param {number} articleId
   * @param {number[]} imageIds - IDs dans le nouvel ordre
   */
  reorder: (articleId, imageIds) =>
    api.put(`/vendor/articles/${articleId}/images/reorder`, { ids: imageIds }),

  /**
   * Définir une image comme photo principale
   * @param {number} imageId
   */
  setPrimary: (imageId) =>
    api.put(`/vendor/images/${imageId}/primary`),

  /**
   * Supprimer une image
   * @param {number} imageId
   */
  delete: (imageId) =>
    api.delete(`/vendor/images/${imageId}`),

  /**
   * Analyser la qualité d'une image (sans la sauvegarder)
   * @param {File} file
   * @returns {Promise<{analysis, recommendations}>}
   */
  analyze: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.upload('/vendor/images/analyze', fd);
  },

  // ── Helpers côté client ──

  /**
   * Obtenir l'URL optimale pour un contexte donné
   * @param {object} image - Image object from API
   * @param {'thumb'|'card'|'medium'|'full'} size
   */
  getUrl: (image, size = 'card') => {
    if (!image) return null;
    switch (size) {
      case 'thumb':  return image.thumb_url || image.image_url;
      case 'medium': return image.medium_url || image.image_url;
      case 'full':   return image.full_url || image.image_url;
      default:       return image.image_url;
    }
  },

  /**
   * Construire le srcSet pour <img> responsive
   * @param {object} image
   * @returns {string} srcSet pour attribut srcset
   */
  srcSet: (image) => {
    if (!image) return '';
    const sets = [];
    if (image.thumb_url)  sets.push(`${image.thumb_url} 200w`);
    if (image.image_url)  sets.push(`${image.image_url} 400w`);
    if (image.medium_url) sets.push(`${image.medium_url} 600w`);
    if (image.full_url)   sets.push(`${image.full_url} 1200w`);
    return sets.join(', ');
  },
};

export default images;
