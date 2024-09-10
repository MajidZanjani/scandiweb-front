import { useLocation } from "react-router";
import { useTitle } from "../hooks/useTitle";
import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import parse from "html-react-parser";

export const ProductDetails = () => {
  const kebabCase = (string) =>
    string
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();

  const product = useLocation().state;
  useTitle(`Product Page: ${product.id}`);

  const gallery = product.galleries.map((obj) => ({
    id: obj.id,
    url: obj.image_url,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? gallery.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === gallery.length - 1 ? 0 : prevIndex + 1
    );
  };

  const attrType = product.attributes[0].type;
  const attrName = product.attributes[0].name;
  const attributes = product.attributes[0].items;

  const [selectedAttribute, setSelectedAttribute] = useState(null);

  const [activate, setActivate] = useState(false);

  useEffect(() => {
    product.inStock
      ? selectedAttribute != null
        ? setActivate(true)
        : setActivate(false)
      : setActivate(false);
  }, [product.inStock, selectedAttribute]);

  const { dispatch } = useCart();

  const addToCart = () => {
    if (selectedAttribute != null) {
      const itemToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        attributeType: product.attributes[0].type,
        attributeName: attrName,
        attributeValues: attributes,
        selectedAttributeValue: selectedAttribute,
        url: product.galleries[0].image_url,
      };
      dispatch({ type: "ADD_TO_CART", payload: itemToAdd });
    } else {
      alert("Please select an attribute.");
    }
  };

  return (
    <main className="flex flex-row mt-16">
      <div
        className="basis-1/5 flex flex-col items-center scroll-auto"
        data-testid="product-gallery"
      >
        {gallery.map((image, index) => (
          <div
            onClick={() => setCurrentIndex(index)}
            key={image.id}
            className={`size-20 mb-5 ${
              index === currentIndex ? "border-2 border-blue-500" : ""
            }`}
          >
            <img src={image.url} alt={`Thumbnail ${image.id}`} />
          </div>
        ))}
      </div>
      <div className="basis-5/6 flex flex-col items-center">
        <div className="relative">
          <img
            src={gallery[currentIndex].url}
            alt={`Main ${product.id}`}
            className="w-full h-auto"
          />
          <button
            onClick={prevImage}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
          >
            &#10094;
          </button>
          <button
            onClick={nextImage}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
          >
            &#10095;
          </button>
        </div>
      </div>
      <div className="ml-2 basis-2/5 flex flex-col">
        <div className="text-lg font-bold text-xl">{product.name}</div>
        <div
          id="attributes"
          className="py-5 font-bold"
          data-testid={`product-attribute-${kebabCase(attrName)}`}
        >
          <div className="my-5 uppercase">
            <div>{attrName}:</div>
            {attrType === "text" ? (
              <div className="flex space-x-2">
                {attributes.map((attr) => (
                  <div
                    onClick={() => {
                      setSelectedAttribute(attr.value);
                      // console.log(attr.displayValue);
                    }}
                    key={attr.id}
                    className={
                      selectedAttribute === attr.value
                        ? "w-20 h-10 border border-gray-700 text-center bg-blue-200"
                        : "w-20 h-10 border border-gray-700 text-center"
                    }
                  >
                    <span className="align-sub">{attr.displayValue}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex space-x-2">
                {attributes.map((attr) => (
                  <div
                    onClick={() => setSelectedAttribute(attr.value)}
                    key={attr.value}
                    className={
                      selectedAttribute === attr.value
                        ? `w-8 h-8 shadow-md shadow-blue-300 border border-gray-300 bg-${attr.value}`
                        : `w-8 h-8 border border-gray-300 bg-${attr.value}`
                    }
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div id="price" className="py-5 font-bold">
          <div className="uppercase">Price:</div>
          <div className="">
            {product.price["currency_symbol"]}
            {parseFloat(product.price["amount"]).toFixed(2)}
          </div>
        </div>

        <button
          data-testid="add-to-cart"
          onClick={product.inStock ? addToCart : null}
          disabled={!activate}
          className={`${
            activate ? "bg-green-400 hover:bg-green-500" : "bg-gray-400"
          } mt-2 py-4 text-white w-full`}
        >
          {/* check opening the card overlay */}
          ADD TO CART
        </button>
        <div
          className="mt-10 w-1/2 text-sm font-bold"
          data-testid="product-description"
        >
          {parse(product.description)}
        </div>
      </div>
    </main>
  );
};
