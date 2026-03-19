'use client';

import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsUp, Award } from 'lucide-react';
import { getSentimentBgColor, formatNumber } from '@/lib/utils';

interface Post {
  id: string;
  content: string;
  postedAt: string;
  upvotes: number;
  commentsCount: number;
  awardsCount: number;
  engagementScore: number;
  account: {
    username: string;
    displayName?: string;
  };
  analysis?: {
    sentiment: string;
    tickers: string[];
    themes: string[];
  };
}

interface PostFeedProps {
  posts: Post[];
}

export function PostFeed({ posts }: PostFeedProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No posts available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {post.account.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {post.account.displayName || post.account.username}
                </p>
                <p className="text-xs text-gray-500">
                  @{post.account.username} ·{' '}
                  {formatDistanceToNow(new Date(post.postedAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            {post.analysis && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentBgColor(
                  post.analysis.sentiment,
                )}`}
              >
                {post.analysis.sentiment}
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>

          {post.analysis && post.analysis.tickers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.analysis.tickers.slice(0, 5).map((ticker) => (
                <span
                  key={ticker}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                >
                  ${ticker}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{formatNumber(post.upvotes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{formatNumber(post.commentsCount)}</span>
            </div>
            {post.awardsCount > 0 && (
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-yellow-600" />
                <span>{post.awardsCount}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
