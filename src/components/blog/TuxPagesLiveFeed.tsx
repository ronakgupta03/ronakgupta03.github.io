"use client";

import React, { useEffect, useState } from "react";
import styles from "./TuxPagesLiveFeed.module.scss";

interface TuxBlog {
  id: number;
  title: string;
  author: string;
  authorEmail: string;
  authorName: string;
  category: string;
  excerpt: string;
  date: string;
  upvotesCount: number;
}

const FALLBACK_TUX_BLOGS: TuxBlog[] = [
  {
    id: 27,
    title: "Demystifying the BitTorrent Protocol",
    author: "its_rg",
    authorEmail: "ronakgupta3305@gmail.com",
    authorName: "Ronak Gupta",
    category: "Distributed Systems",
    excerpt:
      "What if downloading a file was faster because many people shared small parts of it with you at the same time? That’s exactly the idea behind BitTorrent.",
    date: "2026-03-29T14:15:50.502Z",
    upvotesCount: 3,
  },
];

export const TuxPagesLiveFeed: React.FC = () => {
  const [blogs, setBlogs] = useState<TuxBlog[]>(FALLBACK_TUX_BLOGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    const fetchTuxBlogs = async () => {
      try {
        const res = await fetch("https://api.tuxpages.tech/api/blogs?limit=100");
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.blogs)) {
            // Filter strictly by its_rg or ronakgupta3305@gmail.com
            const ronakBlogs = data.blogs.filter(
              (b: TuxBlog) =>
                b.author === "its_rg" ||
                b.authorEmail === "ronakgupta3305@gmail.com" ||
                b.authorName === "Ronak Gupta"
            );
            if (ronakBlogs.length > 0 && isMounted) {
              setBlogs(ronakBlogs);
            }
          }
        }
      } catch (err) {
        // Silently use cached fallback
      } finally {
        if (isMounted) {
          setLoading(false);
          setLastChecked(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }
      }
    };

    fetchTuxBlogs();
    // Re-check periodically every 10 minutes
    const interval = setInterval(fetchTuxBlogs, 10 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className={styles.liveFeedContainer}>
      <div className={styles.feedHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.liveDot} />
          <span className={styles.feedTitle}>Live Synced from TuxPages (@its_rg)</span>
        </div>
        <div className={styles.headerRight}>
          {loading ? (
            <span className={styles.syncStatus}>Checking TuxPages API...</span>
          ) : (
            <span className={styles.syncStatus}>Auto-synced {lastChecked ? `at ${lastChecked}` : "Live"}</span>
          )}
          <a
            href="https://www.tuxpages.tech/profile/its_rg"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            Author Profile &rarr;
          </a>
        </div>
      </div>

      <div className={styles.blogsGrid}>
        {blogs.map((b) => (
          <a
            key={b.id}
            href={`https://www.tuxpages.tech/blogs/${b.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.blogCard}
          >
            <div className={styles.cardMeta}>
              <span className={styles.categoryBadge}>{b.category || "Research"}</span>
              <span className={styles.upvotesBadge}>{b.upvotesCount} Upvotes</span>
              <span className={styles.dateText}>{formatDate(b.date)}</span>
            </div>

            <h3 className={styles.cardTitle}>{b.title}</h3>
            <p className={styles.cardExcerpt}>{b.excerpt}</p>

            <div className={styles.cardFooter}>
              <span className={styles.authorBadge}>Author: @{b.author}</span>
              <span className={styles.readMore}>Read on TuxPages &rarr;</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
