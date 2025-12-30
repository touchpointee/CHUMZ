import { Header } from "@/components/Header";
import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogs, ShopifyArticle } from "@/lib/shopify";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const Blog = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<ShopifyArticle[]>([]);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const articles = await getBlogs(20);
                setPosts(articles);
            } catch (error) {
                console.error("Failed to fetch blog posts:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background flex flex-col">
            <Helmet>
                <title>Chumz Blog - Wellness & Wisdom</title>
                <meta name="description" content="Expert advice, period guides, and wellness tips to help you live your best life—every day of the month." />
            </Helmet>
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-hero py-20 flex-grow-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTIgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMjQgMjRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xMiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />

                <div className="container relative">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                            <BookOpen className="w-5 h-5" />
                            <span className="text-sm font-medium">Chumz Blog</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold font-poppins leading-tight">
                            Wellness & {" "}
                            <span
                                className="
                  relative inline-block 
                  px-6 py-2 
                  rounded-xl 
                  bg-white/70 
                  backdrop-blur-md 
                  border border-white/40
                  shadow-[0_0_40px_rgba(255,255,255,0.4)]
                "
                            >
                                <span
                                    className="
                    bg-gradient-to-r from-primary via-brand-coral to-secondary 
                    bg-clip-text text-transparent 
                    font-bold
                  "
                                >
                                    Wisdom
                                </span>
                            </span>
                        </h1>

                        <p className="text-xl text-foreground/80 font-nunito">
                            Expert advice, period guides, and wellness tips to help you live your best life—every day of the month.
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="container py-16 flex-grow">
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex flex-col space-y-3">
                                <Skeleton className="h-48 w-full rounded-2xl" />
                                <div className="space-y-2 p-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <article
                                key={post.node.id}
                                className="bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 group flex flex-col h-full"
                            >
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-primary uppercase tracking-wider">
                                            {post.node.blog?.title || "Blog"}
                                        </span>
                                    </div>
                                    {post.node.image ? (
                                        <img
                                            src={post.node.image.url}
                                            alt={post.node.image.altText || post.node.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/30">
                                            <BookOpen className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{format(new Date(post.node.publishedAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                        {post.node.authorV2 && (
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                <span>{post.node.authorV2.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold font-poppins mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        <Link to={`/blog/${post.node.blog?.handle}/${post.node.handle}`} className="focus:outline-none">
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            {post.node.title}
                                        </Link>
                                    </h3>

                                    <p className="text-muted-foreground font-nunito text-sm mb-6 line-clamp-3">
                                        {post.node.excerpt || post.node.contentHtml.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."}
                                    </p>

                                    <div className="mt-auto">
                                        <Button variant="link" className="p-0 h-auto font-semibold text-primary group-hover:translate-x-1 transition-transform">
                                            Read More <ArrowRight className="ml-1 w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/30 rounded-3xl border border-dashed border-border">
                        <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-2xl font-bold text-foreground">No posts yet</h3>
                        <p className="text-muted-foreground mt-2">Check back soon for our latest updates and articles.</p>
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
