// import React, { useEffect, useState } from "react";
// import BookCard from "../components/Books/BookCard";
// import axios from "axios";
// import Loader from "./Loader";

// const AllBooks = () => {
//   const [Books, setBooks] = useState();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     const fetch = async () => {
//       try {
//         const response = await axios.get(
//           "https://bookverse-tpi0.onrender.com/api/v1/get-all-books"
//         );
//         console.log(response.data.data);
//         setBooks(response.data.data);
//       } catch (error) {
//         console.log("Error fetching books:", error);
//       }
//     };
//     fetch();
//   }, []);

//   return (
//     <>
//       {!Books && <Loader />}
//       {Books && (
//         <div className="h-auto px-12 py-8 bg-zinc-900">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//             {Books.map((items, i) => (
//               <BookCard
//   bookid={items._id}
//   image={items.url}
//   title={items.title}
//   author={items.author}
//   price={items.price}

//   key={i}
// />

//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AllBooks;


import React, { useEffect, useState } from "react";
import BookCard from "../components/Books/BookCard";
import axios from "axios";
import Loader from "./Loader";

const AllBooks = () => {
  const [books, setBooks] = useState([]);       // empty array instead of undefined
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null);     // error state

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://bookverse-tpi0.onrender.com/api/v1/get-all-books"
        );
        setBooks(response.data.data || []); // fallback empty array
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books.");
      } finally {
        setLoading(false); // stop loader regardless of success/error
      }
    };

    fetchBooks();
  }, []);

  // Show loader while fetching
  if (loading) return <Loader />;

  // Show error if something went wrong
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="h-auto px-12 py-8 bg-zinc-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {books.length > 0 ? (
          books.map((item) => (
            <BookCard
              key={item._id}
              bookid={item._id}
              image={item.url}
              title={item.title}
              author={item.author}
              price={item.price}
            />
          ))
        ) : (
          <p className="text-white col-span-full text-center">
            No books available
          </p>
        )}
      </div>
    </div>
  );
};

export default AllBooks;
