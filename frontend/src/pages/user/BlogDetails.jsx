import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { ArrowLeft, Loader2 } from "lucide-react";
import API, { getImageUrl } from "../../services/api";

export default function BlogDetails() {
  const { id, category } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadContent = async () => {
      setLoading(true);
      
      // 1. Handle specialized category IDs
      if (category && id) {
        try {
          const res = await API.get(`/api/blog/${category}/${id}/`);
          const d = res.data;
          setArticle({
            title: d.title,
            subtitle: d.subtitle,
            image: d.image,
            content: d.content
          });
          setLoading(false);
          return;
        } catch (e) {
          console.error("API Fetch failed for category", e);
        }
      }


      // 3. Try fetching from generic API (Post by slug or ID)
      try {
        const response = await API.get(`/api/blog/posts/${id}/`);
        const data = response.data;
        setArticle({
          title: data.title,
          subtitle: data.description,
          image: data.image,
          content: data.detail // string content
        });
      } catch (err) {
        // 4. Try trending API if post fails
        try {
          const res = await API.get(`/api/blog/trending/${id}/`);
          setArticle({
            title: res.data.title,
            subtitle: res.data.preview,
            image: res.data.image,
            content: res.data.detail
          });
        } catch (e) {
          setArticle(null);
        }
      }
      setLoading(false);
    };

    loadContent();
  }, [id, category]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-gray-50">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
          <button onClick={() => navigate("/blog")} className="text-orange-600 font-semibold hover:underline">
            Go back to Blog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow pb-20 pt-10 mt-16">
        <div className="max-w-4xl mx-auto px-6">
          
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium mb-10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </button>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed">
              {article.subtitle}
            </p>
          </header>

          <figure className="mb-16 rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-[400px] md:h-[500px]">
            {article.image?.toLowerCase().endsWith('.mp4') ? (
              <video 
                src={getImageUrl(article.image)} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover" 
              />
            ) : (
              <img 
                src={getImageUrl(article.image)} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            )}
          </figure>

          <article className="max-w-none text-gray-800">
            {typeof article.content === 'string' ? (
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-gray-700">
                  {article.content}
                </p>
              </div>
            ) : (
              article.content
            )}
          </article>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
