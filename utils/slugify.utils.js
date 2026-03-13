
export const createSlug = (title) => {
  if (!title || typeof title !== "string") {
    return "";
  }

  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
};



/**
 * Create slug with name + memory + color
 */

export const createProductSlug = (title, memory, unit, color) => {
  const titleSlug = createSlug(title);
  const memorySlug = `${memory}${unit.toLowerCase()}`;
  const colorSlug = createSlug(color);

  return `${titleSlug}-${memorySlug}-${colorSlug}`;
};



/**
 * review slag for twins
 * @throws {Error} - error if already
 */

export const validateUniqueSlug = async (slug, checkExists) => {
  const exists = await checkExists(slug);
  if (exists) {
    throw new Error(`Product with slug "${slug}" already exists`);
  }
  return true;
};
