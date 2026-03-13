import { formatSize } from "./memory.utils.js";

export const validateProductByCategory = (product, category) => {
  const errors = [];

  const validationRules = {
    phone: { memory: true, ram: true, processor: true, battery: true, display: true, connectivity: true },
    smartphone: { memory: true, ram: true, processor: true, battery: true, display: true, connectivity: true },
    tablet: { memory: true, ram: true, processor: true, battery: true, display: true, connectivity: true },
    
    laptop: { memory: true, ram: true, processor: true, battery: false, display: true, connectivity: true },
    notebook: { memory: true, ram: true, processor: true, battery: true, display: true, connectivity: true },
    desktop: { memory: true, ram: true, processor: true, battery: false, display: false, connectivity: true },
    pc: { memory: true, ram: true, processor: true, battery: false, display: false, connectivity: true },
    computer: { memory: true, ram: true, processor: true, battery: false, display: false, connectivity: true },
    console: { memory: true, ram: true, processor: true, battery: false, display: false, connectivity: true },
    
    powerbank: { memory: false, ram: false, processor: false, battery: true, display: false, connectivity: true },
    headphones: { memory: false, ram: false, processor: false, battery: false, display: false, connectivity: true },
    watch: { memory: false, ram: false, processor: false, battery: true, display: true, connectivity: true },
    smartwatch: { memory: false, ram: false, processor: true, battery: true, display: true, connectivity: true }
  };

  const rules = validationRules[category.name];
  if (!rules) return errors;

  const productTitle = product.basic?.title || 'Product';

  product.variants.forEach((variant, index) => {
    const missingFields = [];

    let variantInfo = `${productTitle} - ${variant.color || `variant ${index + 1}`}`;

    if (variant.memory) {
      const formatted = formatSize(variant.memory);
      if (variant.memory >= 1048576) {
        variantInfo += ` ${formatted.TB}`;
      } else if(variant.memory >= 1024) {
        variantInfo += ` ${formatted.GB}`;
      } else {
        variantInfo += ` ${formatted.MB}`
      }
    }

    if (rules.memory && !variant.memory) missingFields.push('memory');
    if (rules.ram && !variant.ram) missingFields.push('ram');
    if (rules.processor && !variant.processor) missingFields.push('processor');
    if (rules.battery && !variant.battery) missingFields.push('battery');
    if (rules.display && !variant.display) missingFields.push('display');
    if (rules.connectivity && !variant.connectivity) missingFields.push('connectivity');

    if (missingFields.length > 0) {
      errors.push({
        variantIndex: index,
        color: variant.color,
        missing: missingFields,
        message: `${variantInfo} missing: ${missingFields.join(', ')}`
      });
    }
  });

  return errors;
};