import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchContent } from "../api/Api";
import SearchBar from "../components/SearchBar";

interface User {
  username: string;
}

interface Author {
  user: User;
}

interface Post {
  id: number;
  title: string;
  type: string;
  author?: Author;
  price: number;
  cover_img: string;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response: PaginatedResponse<Post> = await fetchContent(
          currentPage
        );
        setPosts(response.data);
        setFilteredPosts(response.data);
        setCurrentPage(response.current_page);
        setLastPage(response.last_page);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) => {
        const authorName = post.author?.user?.username?.toLowerCase() || "";
        const title = post.title.toLowerCase();
        const contentType = post.type.toLowerCase();
        const query = searchQuery.toLowerCase();

        return (
          title.includes(query) ||
          contentType.includes(query) ||
          authorName.includes(query)
        );
      });
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="hero">
      <div className="container">
        <h1 style={{ padding: "40px", fontFamily: "cursive" }}>
          "Discover your next favorite read—one page at a time."
        </h1>
        <div className="row mt-2">
          <SearchBar
            onSearch={handleSearch}
            query={searchQuery}
            setQuery={setSearchQuery}
            placeholder="Search by title, type, or author..."
          />
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="col-md-4 mt-3">
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
        <div className="pagination-controls float-end mt-3">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="btn btn-primary"
          >
            Previous
          </button>

          <span className="mx-2">
            Page {currentPage} of {lastPage}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === lastPage}
            className="btn btn-primary"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
