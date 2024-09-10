import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/a-logo.png";
import { useFetch } from "../hooks/useFetch";
import { MenuContext } from "../contexts/MenuContext";
import CartIcon from "./CartIcon";

export const Header = () => {
  const activeClass =
    "block py-2 pr-4 pl-2 text-green-400 underline underline-offset-8";
  const inActiveClass =
    "block py-2 pr-4 pl-2 text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-600";

  const query = `{ categories { id name } }`;
  const { data: categories } = useFetch(query);
  const { setSelectedCategory } = useContext(MenuContext);

  return (
    <header>
      <nav className="bg-white border-gray-200 mx-10 h-14">
        <div id="navbar" className="flex justify-between items-center">
          <ul className="flex p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
            {categories.map((category) => (
              <NavLink
                to={`/${category.name}`}
                className={({ isActive }) =>
                  isActive ? activeClass : inActiveClass
                }
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
              >
                {({ isActive }) => (
                  <li
                    data-testid={
                      isActive ? `active-category-link` : `category-link`
                    }
                  >
                    {category.name.toUpperCase()}
                  </li>
                )}
              </NavLink>
            ))}
          </ul>
          <img className="text-center" src={Logo} alt="Shop Logo" />
          <div className="relative">
            <CartIcon />
          </div>
        </div>
      </nav>
    </header>
  );
};
