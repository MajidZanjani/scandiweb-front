import { useCart } from "../contexts/CartContext";
import Action from "../assets/Actions.png";
import { useMemo, useState } from "react";

const CartIcon = () => {
  const kebabCase = (string) =>
    string
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();

  const { state } = useCart();
  const [overlay, setOverlay] = useState(false);
  const [currency, setCurrency] = useState("$");

  const totalQuantity = useMemo(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  const cartTotal = useMemo(() => {
    return state.items.reduce(
      (totalPrice, item) => totalPrice + item.price.amount * item.quantity,
      0
    );
  }, [state.items]);

  const { dispatch } = useCart();

  const addToCart = (item) => {
    setCurrency(item.price.currency_symbol);
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeFromCart = (item) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
  };

  return (
    <div>
      <button
        data-testid="cart-btn"
        className="relative"
        onClick={() => setOverlay(!overlay)}
      >
        <img
          className="text-right flex p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white"
          src={Action}
          alt="Cart Icon"
        />
      </button>
      {state.items.length > 0 && (
        <div className="absolute top-5 right-4 bg-black text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
          {totalQuantity}
        </div>
      )}
      <div
        id="overlay"
        className={
          overlay
            ? "absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50"
            : "hidden"
        }
      >
        <div className="overlayCart text-left text-sm bg-white p-4">
          <h1 className="mb-5">
            <span className="font-bold">My Bag: </span>
            {totalQuantity} items{" "}
          </h1>
          <div
            className={`${state.items.length > 0 ? "flex flex-col" : "hidden"}`}
          >
            {state.items.map((item) => (
              <div
                key={`${item.id}-${item.selectedAttributeValue}`}
                className="flex flex-wrap mb-8"
              >
                <div className="w-1/3">
                  <div className="mb-2">{item.name}</div>
                  <div className="mb-2" data-testid="cart-item-amount">
                    {item.price.currency_symbol}
                    {parseFloat(item.price.amount * item.quantity).tof}
                  </div>
                  <div
                    className="font-bold"
                    data-testid={`cart-item-attribute-${kebabCase(
                      item.attributeName
                    )}`}
                  >
                    {item.attributeName}
                  </div>
                  <div className="flex">
                    {item.attributeType === "text"
                      ? item.attributeValues.map((attributeVal) => (
                          <div
                            data-testid={
                              attributeVal.value === item.selectedAttributeValue
                                ? `cart-item-attribute-${kebabCase(
                                    item.attributeName
                                  )}-${kebabCase(item.attributeName)}-selected`
                                : `cart-item-attribute-${kebabCase(
                                    item.attributeName
                                  )}-${kebabCase(item.attributeName)}`
                            }
                            key={`${attributeVal.id}-${attributeVal.value}`}
                            className={
                              attributeVal.value === item.selectedAttributeValue
                                ? "border-2 border-green-400 h-6 w-max mr-auto"
                                : "border-2 border-grey-400 h-6 w-max mr-auto"
                            }
                          >
                            {attributeVal.value}
                          </div>
                        ))
                      : item.attributeValues.map((attributeVal) => (
                          <div
                            key={`${attributeVal.id}-${attributeVal.value}`}
                            className={
                              attributeVal.value === item.selectedAttributeValue
                                ? `border-2 bg-${attributeVal.value} shadow-md shadow-red-400 h-6 w-6 mr-auto`
                                : `border-2 bg-${attributeVal.value} h-6 w-6 mr-auto`
                            }
                          ></div>
                        ))}
                  </div>
                </div>
                <div className="w-min px-2 flex flex-col items-center">
                  <button
                    data-testid="cart-item-amount-increase"
                    className="border border-black w-5 h-5 mb-auto"
                    onClick={() => addToCart(item)}
                  >
                    +
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    data-testid="cart-item-amount-decrease"
                    className="border border-black w-5 h-5 mt-auto"
                    onClick={() => removeFromCart(item)}
                  >
                    -
                  </button>
                </div>
                <div className="w-1/3">
                  <img src={item.url} alt={item.name} className="h-20%" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mx-10">
            <span>Total</span>
            <span data-testid="cart-total">
              {currency}
              {parseFloat(cartTotal).toFixed(2)}
            </span>
          </div>
          <div>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 w-full mt-4">
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartIcon;
