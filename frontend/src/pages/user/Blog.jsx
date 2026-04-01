import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import API, { getImageUrl } from "../../services/api";
import {
  ChevronRight,
  ChevronLeft,
  Flame,
  ChefHat,
  Utensils,
  HeartPulse,
  Map,
} from "lucide-react";

export default function Blog() {
  const navigate = useNavigate();
  const handleReadMore = (id) => navigate(`/blog/${id}`);

  // 1. Initial State (No Static Fallbacks)
  const [blogHero, setBlogHero] = useState(null);
  const [trendingStories, setTrendingStories] = useState([]);
  const [mainPosts, setMainPosts] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const [popularRecipes, setPopularRecipes] = useState([]);
  const [chefTips, setChefTips] = useState([]);
  const [foodCulture, setFoodCulture] = useState([]);
  const [streetGuides, setStreetGuides] = useState([]);
  const [healthyEating, setHealthyEating] = useState([]);

  // 2. Fetch API Data
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const heroRes = await API.get("/api/blog/hero/");
        if (heroRes.data.length > 0) setBlogHero(heroRes.data[0]);

        const trendingRes = await API.get("/api/blog/trending/");
        if (trendingRes.data.length > 0) setTrendingStories(trendingRes.data);

        const postsRes = await API.get("/api/blog/posts/");
        if (postsRes.data.length > 0) setMainPosts(postsRes.data);

        const galleryRes = await API.get("/api/blog/gallery/");
        if (galleryRes.data.length > 0) {
          setGalleryImages(galleryRes.data.map((img) => img.image));
        }

        // Fetch Top 4 rated recipes
        const popularRes = await API.get("/api/blog/popular-recipes/");
        if (popularRes.data.length > 0) setPopularRecipes(popularRes.data);

        // Fetch categories for sidebar
        const tipsRes = await API.get("/api/blog/chef-tips/");
        if (tipsRes.data.length > 0) setChefTips(tipsRes.data);

        const cultureRes = await API.get("/api/blog/food-culture/");
        if (cultureRes.data.length > 0) setFoodCulture(cultureRes.data);

        const guidesRes = await API.get("/api/blog/street-guides/");
        if (guidesRes.data.length > 0) setStreetGuides(guidesRes.data);

        const healthyRes = await API.get("/api/blog/healthy-eating/");
        if (healthyRes.data.length > 0) setHealthyEating(healthyRes.data);

      } catch (err) {
        console.error("Failed to fetch blog data:", err);
      }
    };
    fetchBlogData();
  }, []);



  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-orange-50 flex flex-col font-sans">
      <Header />

      {/* Hero Header Section */}
      <section className="relative w-full h-[45vh] min-h-[350px] mt-16 flex items-center justify-center overflow-hidden bg-black">
        {blogHero && (
          blogHero.media_file?.toLowerCase().split('?')[0].endsWith('.mp4') ? (
            <video
              src={getImageUrl(blogHero.media_file)}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <img
              src={getImageUrl(blogHero.media_file)}
              alt="Blog Hero"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )
        )}
        {!blogHero && (
           <div className="absolute inset-0 bg-gray-900 animate-pulse"></div>
        )}
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 pointer-events-none"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 drop-shadow-2xl">
            {blogHero ? (
              <>
                <span className="text-orange-500">{blogHero.title.split(' ')[0]}</span> {blogHero.title.split(' ').slice(1).join(' ')}
              </>
            ) : (
              <>
                <span className="text-orange-500">Food</span> Stories & Recipes
              </>
            )}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium drop-shadow-lg">
            {blogHero ? blogHero.subtitle : "Discover delicious recipes, chef tips and food culture"}
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <main className="flex-grow py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          {/* Main Content Grid: Blog + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT SIDE: Main Content */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {/* 1. Featured Blog Post */}
              {mainPosts.length > 0 && (
                <article className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col w-full">
                  <div className="relative w-full h-[400px] overflow-hidden shrink-0 bg-gray-100">
                    <img
                      src={getImageUrl(mainPosts[0].image)}
                      alt={mainPosts[0].title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-black text-orange-600 shadow-sm uppercase tracking-wider">
                      {mainPosts[0].category}
                    </div>
                  </div>
                  <div className="p-8 md:p-10 flex flex-col flex-grow">
                    <p className="text-xs text-gray-400 font-bold tracking-wider uppercase mb-3">
                      {mainPosts[0].date}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-snug mb-4 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {mainPosts[0].title}
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 flex-grow">
                      {mainPosts[0].description}
                    </p>

                    <button
                      onClick={() => handleReadMore(mainPosts[0].id)}
                      className="flex items-center text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 px-7 py-3.5 rounded-xl transition-all shadow-sm group-hover:shadow-md group/btn w-fit"
                    >
                      Read Full Article
                      <ChevronRight
                        className="w-5 h-5 ml-1 transform transition-transform duration-300 group-hover/btn:translate-x-1"
                      />
                    </button>
                  </div>
                </article>
              )}

              {/* 2. Small Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mainPosts.slice(1).map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group flex flex-col h-full"
                  >
                    <div className="relative h-48 overflow-hidden shrink-0 bg-gray-100">
                      <img
                        src={getImageUrl(post.image)}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-orange-600 shadow-sm uppercase tracking-wider">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-snug mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                        {post.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleReadMore(post.id)}
                          className="flex items-center text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors group/btn"
                        >
                          Read More
                          <ChevronRight
                            className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover/btn:translate-x-1"
                          />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: Sidebar */}
            <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-8">
              {/* 1. Popular Recipes */}
              <div className="bg-white p-7 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                <h4 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <Flame className="w-5 h-5 text-orange-500" /> Popular Recipes
                </h4>
                <div className="space-y-5">
                  {popularRecipes.map((recipe, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate(`/food/${recipe.id}`)}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <img
                        src={getImageUrl(recipe.image)}
                        alt={recipe.name}
                        className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
                      />
                      <div>
                        <h5 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                          {recipe.name}
                        </h5>
                        <p className="text-xs text-orange-500 mt-1 font-bold">
                          ★ {recipe.rating}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Chef Tips */}
              <div className="bg-white p-7 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                <h4 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 hover:text-orange-600 transition-colors">
                  <ChefHat className="w-5 h-5 text-orange-500" /> Chef Tips
                </h4>
                <ul className="space-y-4">
                  {chefTips.map((tip, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => navigate(`/blog/chef-tips/${tip.id}`)}
                        className="w-full text-left flex justify-between items-center text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {tip.title || tip}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Food Culture */}
              <div className="bg-white p-7 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                <h4 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <Utensils className="w-5 h-5 text-orange-500" /> Food Culture
                </h4>
                <ul className="space-y-4">
                  {foodCulture.map((culture, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => navigate(`/blog/food-culture/${culture.id}`)}
                        className="w-full text-left flex justify-between items-center text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {culture.title || culture}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Street Food Guides */}
              <div className="bg-white p-7 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                <h4 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <Map className="w-5 h-5 text-orange-500" /> Street Food Guides
                </h4>
                <ul className="space-y-4">
                  {streetGuides.map((guide, idx) => (
                    <li key={idx}>
                      <button 
                         onClick={() => navigate(`/blog/street-guides/${guide.id}`)}
                        className="w-full text-left flex justify-between items-center text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {guide.title || guide}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Healthy Eating */}
              <div className="bg-orange-50 p-7 rounded-2xl shadow-md border border-orange-100 transition-all hover:shadow-lg">
                <h4 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-orange-200 pb-4">
                  <HeartPulse className="w-5 h-5 text-red-500" /> Healthy Eating
                </h4>
                <ul className="space-y-4">
                  {healthyEating.map((tip, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => navigate(`/blog/healthy-eating/${tip.id}`)}
                        className="w-full text-left flex justify-between items-center text-sm text-gray-800 hover:text-orange-700 font-bold transition-colors group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {tip.title || tip}
                        </span>
                        <ChevronRight className="w-4 h-4 text-orange-400 group-hover:text-orange-600 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          {/* NEW: 1. Trending Food Stories Section */}
          <section className="pt-8 border-t border-gray-200">
            <h3 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
              <span className="text-orange-500">Trending</span> Food Stories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingStories.map((story) => (
                <article
                  key={story.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-56 overflow-hidden shrink-0">
                    <img
                      src={getImageUrl(story.image)}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {story.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {story.preview}
                    </p>

                    <div className="mt-auto">
                      <button
                        onClick={() => handleReadMore(story.id)}
                        className="flex items-center text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Read More
                        <ChevronRight
                          className="w-4 h-4 ml-1 transform transition-transform duration-300"
                        />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
          
          {/* NEW: 4. Food Gallery Section */}
          <section className="pt-8 border-t border-gray-200">
            <h3 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
              Food <span className="text-orange-500">Gallery</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`Gallery food ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      {/* Hide scrollbar styles for webkit */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `,
        }}
      />
    </div>
  );
}
