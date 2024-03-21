// hooks/useFetchVideos.js
import { useState, useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetchVideos = () => {
  const [videos, setVideos] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const axios = useAxiosPrivate();

  const fetchVideos = useCallback(async () => {
    if (errorOccurred || !hasMore) return;

    try {
      const { data } = await axios.get("/post/");
      if (!data || data.data.length === 0) {
        setHasMore(false);
        return;
      }
      setVideos((prevVideos) => [...prevVideos, ...data.data]);
    } catch (err) {
      console.error(err);
      setErrorOccurred(true);
      setHasMore(false);
    }
  }, [axios, hasMore, errorOccurred]);

  return { videos, fetchVideos, hasMore };
};

export default useFetchVideos;
