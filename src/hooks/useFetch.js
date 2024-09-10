import { useEffect, useState } from "react";

export const useFetch = (query, selectedCategory) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = "http://43.205.236.184/backend/";
  // const url = "http://localhost:8080";

  if (!selectedCategory) {
    selectedCategory = "all";
  }

  useEffect(() => {
    // console.log("Query:", query);
    // console.log("Selected Category:", selectedCategory);

    const fetchData = async () => {
      if (!query || !selectedCategory) {
        console.error("Query or selectedCategory is missing");
        return;
      }

      setLoading(true);
      try {
        // Determine the appropriate query based on the selected category
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            variables: { category: selectedCategory },
          }),
        });

        const json = await response.json();

        // console.log(json);

        if (json.errors) {
          console.error("GraphQL errors:", json.errors);
          setError(json.errors);
          return;
        }

        if (json.data) {
          const keys = Object.keys(json.data);
          if (keys.length > 0) {
            setData(json.data[keys[0]]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, selectedCategory]);

  return { data, loading, error };
};
