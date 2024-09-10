import { Link } from "react-router-dom";
import Backup from "../assets/images/backup.png";
import { useEffect, useState } from "react";
import ActionGreen from "../assets/ActionsGreen.png";
import { useCart } from "../contexts/CartContext";

export const Card = ({ product }) => {
  const kebabCase = (string) =>
    string
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();

  const { id, name, price, attributes } = product;
  const imageUrl = product.galleries[0].image_url;

  const [isValidImage, setIsValidImage] = useState(false);

  function checkImageUrl(url, callback) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = url;
  }

  useEffect(() => {
    checkImageUrl(imageUrl, (valid) => {
      setIsValidImage(valid);
    });
  }, [imageUrl]);

  const [hoveredProductId, setHoveredProductId] = useState(null);

  const { dispatch } = useCart();

  const handleAdd = () => {
    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      attributeType: product.attributes[0].type,
      attributeName: attributes[0].name,
      attributeValues: attributes[0].items,
      selectedAttributeValue: attributes[0].items[0].value,
      url: product.galleries[0].image_url,
    };
    dispatch({ type: "ADD_TO_CART", payload: itemToAdd });
  };

  return (
    <div
      data-testid={`product-${kebabCase(product.name)}`}
      className={`${
        hoveredProductId === id ? "drop-shadow-xl" : ""
      } max-w-sm bg-white rounded-lg m-3`}
      onMouseEnter={() => setHoveredProductId(product.id)}
      onMouseLeave={() => setHoveredProductId(null)}
    >
      <Link to={`/product/${id}`} state={product} className=" relative">
        <img
          className={`${
            !product.inStock ? "filter grayscale" : ""
          } rounded-t-lg p-4`}
          src={isValidImage ? imageUrl : Backup}
          alt={product.name}
        />
        <img
          onClick={() => handleAdd()}
          src={ActionGreen}
          alt="Add to Cart"
          className={`${
            hoveredProductId === id && product.inStock ? "" : "invisible"
          } absolute bottum-2 right-8`}
        />
      </Link>
      <div className="p-5">
        <Link to={`/product/${id}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
          </h5>
        </Link>

        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {price["currency_symbol"]}
          {parseFloat(price["amount"]).toFixed(2)}
        </p>
      </div>
    </div>
  );
};
