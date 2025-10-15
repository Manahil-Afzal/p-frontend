import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormURL = urlParams.get("searchTerm");
    if (searchTermFormURL) {
      setSearchTerm(searchTermFormURL);
    }
  }, [location.search]);
  return (
    <div className="header bg-slate-200 shadow-md">
      <div className="flex flex-wrap items-center justify-between max-w-6xl mx-auto p-5 ">
        <Link to="/">
          <h1 className="font-bold  text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Shahand</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>

        <form
          action=""
          onSubmit={handleSubmit}
          className="bg-slate-100 rounded-lg p-3 flex justify-between items-center"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="bg-transparent focus:outline-none
          w-24 sm:w-64"
          />
          <button>
            <FaSearch className="text-slate-500 cursor-pointer" />
          </button>
        </form>

        <ul className="flex flex-wrap justify-center gap-10 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline hover:cursor-pointer ">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline hover:cursor-pointer ">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src="/Avatar2.png"
                alt="profile"
              />
            ) : (
              <li className=" sm:inline text-slate-700 hover:underline hover:cursor-pointer ">
                SignIn
              </li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
};
export default Header;
