import React, { useEffect, useState, useRef, useCallback } from "react";
import Masonry from "react-masonry-css";
import { unsplash } from "../../services/unsplash";
import debounce from "lodash.debounce";
import { FaHeart } from "react-icons/fa";
import ReactModal from "react-modal";
import "./gallery.css";

ReactModal.setAppElement("#root");

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orientation, setOrientation] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const loaderRef = useRef(null);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
    setIsInitialLoadComplete(true);
  }, []);

  // Save favorites
  useEffect(() => {
    if (isInitialLoadComplete) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, isInitialLoadComplete]);

  // Fetch photos
  const fetchPhotos = async (pageNumber, searchQuery = "", orientationFilter = "") => {
    try {
      setLoading(true);
      const params = { page: pageNumber, per_page: 15 };
      let finalQuery = searchQuery;
      if (!finalQuery && orientationFilter) finalQuery = "nature";

      let newPhotos;
      if (finalQuery) {
        const searchParams = { ...params, query: finalQuery };
        if (orientationFilter) searchParams.orientation = orientationFilter;
        const res = await unsplash.get("/search/photos", { params: searchParams });
        newPhotos = res.data.results;
      } else {
        const res = await unsplash.get("/photos", { params });
        newPhotos = res.data;
      }
      setPhotos((prev) => (pageNumber === 1 ? newPhotos : [...prev, ...newPhotos]));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const handleSearch = useCallback(
    debounce((value) => {
      setPage(1);
      setPhotos([]);
      setQuery(value);
    }, 500),
    []
  );

  const onChangeSearch = (e) => handleSearch(e.target.value);

  // Fetch on dependencies change
  useEffect(() => {
    if (!isInitialLoadComplete) return;
    if (!showFavorites) fetchPhotos(page, query, orientation);
  }, [page, query, orientation, isInitialLoadComplete, showFavorites]);

  // Infinite scroll
  useEffect(() => {
    if (showFavorites) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) setPage((prev) => prev + 1);
      },
      { threshold: 0.3 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading, showFavorites]);

  const toggleFavorite = (photo) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === photo.id);
      return exists ? prev.filter((p) => p.id !== photo.id) : [...prev, photo];
    });
  };

  const openModal = (photo) => {
    setCurrentPhoto(photo);
    setModalIsOpen(true);
  };
  const closeModal = () => setModalIsOpen(false);

  const breakpointColumns = {
    default: 5,
    1100: 4,
    700: 3,
    500: 2,
  };

  const uniquePhotos = (arr) => {
    const seen = new Set();
    return arr.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  };

  const displayedPhotos = uniquePhotos(showFavorites ? favorites : photos);

  return (
    <div style={{ padding: "20px" }}>
      {/* ⭐ Sticky control bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "white",
          padding: "15px 10px",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          flexWrap: "wrap",
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#e6e6e6",
            borderRadius: "12px",
            padding: "10px 15px",
            width: "50%",
          }}
        >
          <span style={{ marginRight: "10px", opacity: 0.6 }}>🔍</span>
          <input
            type="text"
            placeholder="Search photos..."
            onChange={onChangeSearch}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Orientation Filter */}
        <select
          value={orientation}
          onChange={(e) => {
            setPage(1);
            setPhotos([]);
            setOrientation(e.target.value);
          }}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">All</option>
          <option value="landscape">Landscape</option>
          <option value="portrait">Portrait</option>
          <option value="squarish">Square</option>
        </select>

        {/* Favorites Toggle */}
        <button
          onClick={() => setShowFavorites((prev) => !prev)}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: showFavorites ? "#222" : "white",
            color: showFavorites ? "white" : "black",
          }}
        >
          {showFavorites ? "Show All" : "Favorites"}
        </button>
      </div>

      {/* Masonry Layout */}
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {(loading && photos.length === 0)
          ? Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{
                  height: "220px",
                  background: "#eee",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              />
            ))
          : displayedPhotos.map((photo) => (
              <div
                key={photo.id}
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => openModal(photo)}
              >
                <img
                  loading="lazy"
                  src={photo.urls.small}
                  alt={photo.alt_description}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                />
                <FaHeart
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(photo);
                  }}
                  color={favorites.some((p) => p.id === photo.id) ? "red" : "white"}
                  size={24}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                    textShadow: "0px 0px 5px black",
                  }}
                />
                <div className="overlay">{photo.user.name}</div>
              </div>
            ))}
      </Masonry>

      {!showFavorites && <div ref={loaderRef} style={{ height: "30px" }} />}

      {/* Modal */}
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.8)" },
          content: {
            maxWidth: "800px",
            margin: "auto",
            borderRadius: "10px",
          },
        }}
      >
        {currentPhoto && (
          <div style={{ textAlign: "center" }}>
            <img
              src={currentPhoto.urls.full}
              alt={currentPhoto.alt_description}
              style={{ width: "100%", borderRadius: "10px" }}
            />
            <h3 style={{ marginTop: "10px" }}>
              {currentPhoto.alt_description || "Untitled"}
            </h3>
            <button
              style={{ padding: "10px 20px", margin: "10px" }}
              onClick={async () => {
                const response = await fetch(currentPhoto.urls.full);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${currentPhoto.id}.jpg`;
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download
            </button>
            <button onClick={closeModal} style={{ padding: "10px 20px" }}>
              Close
            </button>
          </div>
        )}
      </ReactModal>
    </div>
  );
}