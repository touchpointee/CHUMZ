import { Header } from "@/components/Header";
import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticle, ShopifyArticle } from "@/lib/shopify";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import DOMPurify from "dompurify";

const BlogPost = () => {
    const { blogHandle, articleHandle } = useParams<{ blogHandle: string; articleHandle: string }>();
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState<ShopifyArticle | null>(null);

    useEffect(() => {
        async function fetchArticle() {
            if (blogHandle && articleHandle) {
                try {
                    const data = await getArticle(blogHandle, articleHandle);
                    setArticle(data);
                } catch (error) {
                    console.error("Failed to fetch article:", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchArticle();
    }, [blogHandle, articleHandle]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="container py-20 flex-grow max-w-4xl mx-auto space-y-8">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="container py-20 flex-grow flex flex-col items-center justify-center text-center">
                    <BookOpen className="w-16 h-16 text-muted-foreground opacity-50 mb-4" />
                    <h1 className="text-3xl font-bold mb-4 font-poppins">Article Not Found</h1>
                    <p className="text-muted-foreground mb-8">The article you are looking for does not exist or has been moved.</p>
                    <Link to="/blog">
                        <Button>Back to Blog</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Helmet>
                <title>{article.node.title} | Chumz Blog</title>
                <meta name="description" content={article.node.excerpt || `Read ${article.node.title} on Chumz Blog.`} />
            </Helmet>
            <Header />

            <article className="flex-grow">
                {/* Hero / Header */}
                <div className="bg-muted/30 py-16 md:py-24 border-b">
                    <div className="container max-w-4xl mx-auto">
                        <Link to="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Link>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                            {article.node.blog && (
                                <span className="text-primary font-bold uppercase tracking-wider text-xs bg-primary/10 px-3 py-1 rounded-full">
                                    {article.node.blog.title}
                                </span>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(article.node.publishedAt), 'MMMM dd, yyyy')}</span>
                            </div>
                            {article.node.authorV2 && (
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{article.node.authorV2.name}</span>
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins leading-tight text-foreground mb-6">
                            {article.node.title}
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed font-nunito border-l-4 border-primary/50 pl-6 italic">
                            {article.node.excerpt}
                        </p>
                    </div>
                </div>

                {/* Featured Image */}
                {article.node.image && (
                    <div className="container max-w-5xl mx-auto -mt-12 md:-mt-20 px-4">
                        <img
                            src={article.node.image.url}
                            alt={article.node.image.altText || article.node.title}
                            className="w-full h-[300px] md:h-[500px] object-cover rounded-3xl shadow-2xl border-4 border-white"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="container max-w-3xl mx-auto py-16 md:py-20 px-4">
                    <div
                        className="prose prose-lg md:prose-xl prose-headings:font-poppins prose-p:font-nunito prose-img:rounded-2xl prose-a:text-primary hover:prose-a:underline focus:prose-a:outline-none max-w-none"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.node.contentHtml) }}
                    />
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogPost;
