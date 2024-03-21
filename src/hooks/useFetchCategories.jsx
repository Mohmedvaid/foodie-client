// hooks/useCategories.js
import { useState, useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const axios = useAxiosPrivate();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/post/categories");
      setCategories(data.data.sort());
      setError("");
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [axios]);

  return { categories, loading, error, fetchCategories };
};

export default useCategories;
