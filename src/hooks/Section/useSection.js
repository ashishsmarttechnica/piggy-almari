import { useEffect, useState } from "react";
import { fetchHomeScreenData } from "@/api/home.api";

export default function useSection(sectionId = null, options = { autoFetch: true, params: {} }) {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!options?.autoFetch || !sectionId) return;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHomeScreenData(options?.params || {});
        const sections = Array.isArray(data?.data) ? data.data : [];
        const found = sections.find((s) => s._id === sectionId);
        if (found) setSection(found);
        else setError("Section not found");
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Failed to load section";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  return { section, loading, error };
}

