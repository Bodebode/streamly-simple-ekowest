
export const getStorageUrl = (bucket: string, path: string | null) => {
  if (!path) return null;
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
};
