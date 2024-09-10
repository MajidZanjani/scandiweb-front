import { useContext } from "react";
import { Card } from "../components";
import { useFetch } from "../hooks/useFetch";
import { useTitle } from "../hooks/useTitle";
import { MenuContext } from "../contexts/MenuContext";

export const ProductList = () => {
  const { selectedCategory } = useContext(MenuContext);
  useTitle(selectedCategory);

  const query =
    selectedCategory === "all"
      ? `query {
    products {
      id
      name
      inStock
      description
      category
      brand
      price { amount, currency_symbol }
      attributes {
        id
        name
        value
        product_id
        type
        items {
          id
          attribute_id
          displayValue
          value
        }
      }
      galleries {
        id
        product_id
        image_url
      }
    }
  }
`
      : `
  query GetProductsByCategory($category: String!) {
    products(category: $category) {
      id
      name
      inStock
      description
      category
      brand
      price { amount, currency_symbol }
      attributes {
        id
        name
        value
        product_id
        type
        items {
          id
          attribute_id
          displayValue
          value
        }
      }
      galleries {
        id
        product_id
        image_url
      }
    }
  }
`;

  const { data: products } = useFetch(query, selectedCategory);

  return (
    <div className="mx-10 mt-16">
      <div className="font-raleway text-3xl mb-10">
        {selectedCategory.toUpperCase()}
      </div>
      <div className="flex flex-wrap">
        {products.map((product) => (
          <Card
            key={product.id}
            product={product}
            data-testid={`product-${product.name}`}
          />
        ))}
      </div>
    </div>
  );
};
