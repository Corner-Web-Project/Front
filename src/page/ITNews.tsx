import { useState } from "react";

type NewsCategory = "AI" | "IT_COMPANY" | "GAME";
type NewsTab = NewsCategory;

interface News {
    id: number;
    title: string;
    category: NewsCategory;
    publishedAt: string;
    imageUrl?: string;
    articleUrl?: string;
}

const categories: { label: string; value: NewsTab }[] = [
    { label: "AI", value: "AI" },
    { label: "IT기업", value: "IT_COMPANY" },
    { label: "게임", value: "GAME" },
];

const categoryLabels: Record<NewsCategory, string> = {
    AI: "AI",
    IT_COMPANY: "IT기업",
    GAME: "게임",
};

// 백엔드 연동 전 사용할 임시 데이터
const mockNews: News[] = Array.from({ length: 36 }, (_, index) => {
    const category = categories[
        Math.floor(index / 12)
    ].value;

    const articleIndex = index % 12;

    return {
        id: index + 1,
        title: `기사 제목 ${articleIndex + 1}`,
        category,
        publishedAt: `2026-11-${String(
            17 - Math.floor(articleIndex / 3)
        ).padStart(2, "0")}T12:00:00+09:00`,
    };
});


function formatRelativeDate(publishedAt: string): string {
    const publishedDate = new Date(publishedAt);
    const diff = Date.now() - publishedDate.getTime();

    if (Number.isNaN(diff) || diff < 0) {
        return "방금 전";
    }

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;

    return `${days}일 전`;
}

export default function ItNews() {
    
    const [activeTab, setActiveTab] = useState<NewsTab>("AI");

    const filteredNews = mockNews
        .filter((news) => news.category === activeTab)
        .sort((a, b) =>
            b.publishedAt.localeCompare(a.publishedAt)
        )
        .slice(0, 12);


    return (
        <section className="bg-[#F8F3F0] py-20">
            <div className="mx-auto max-w-6xl px-6">
                {/* 헤더 */}
                <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-wider text-[#014BAA]">
                            IT NEWS
                        </h2>
                    </div>

                    <span className="text-xs text-[#014BAA]/50">
                        Daum IT/과학
                    </span>
                </div>

                {/* 카테고리 탭 */}
                <div
                    className="mb-10 flex flex-wrap gap-3 border-b border-[#014BAA]/15 pb-5"
                    role="group"
                    aria-label="뉴스 카테고리"
                >
                    {categories.map((category) => {
                        const isActive =
                            activeTab === category.value;

                        return (
                            <button
                                key={category.value}
                                type="button"
                                onClick={() => setActiveTab(category.value)}
                                aria-pressed={isActive}
                                className={`rounded-md border border-[#014BAA] px-3 py-1 text-sm text-[#014BAA] transition hover:bg-[#014BAA] hover:text-white ${
                                    isActive ? "bg-[#014BAA] !text-white" : ""
                                }`}
                            >
                                {category.label}
                            </button>
                        );
                    })}
                </div>

                {/* 뉴스 카드 */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredNews.map((news) => {
                        const cardContent = (
                            <>
                                {/* 이미지 영역 */}
                                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#E5E7EB]">
                                    {news.imageUrl && (
                                        <img
                                            src={news.imageUrl}
                                            alt=""
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                </div>

                                {/* 카테고리 */}
                                <p className="mt-4 text-xs font-medium text-[#014BAA]/60">
                                    {categoryLabels[news.category]}
                                </p>

                                {/* 제목 */}
                                <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-relaxed text-[#014BAA]">
                                    {news.title}
                                </h3>

                                {/* 날짜 */}
                                <time
                                    dateTime={news.publishedAt}
                                    className="mt-2 block text-xs text-gray-400"
                                >
                                    {formatRelativeDate(news.publishedAt)}
                                </time>
                            </>
                        );

                        return news.articleUrl ? (
                            <a
                                key={news.id}
                                href={news.articleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#014BAA]"
                            >
                                {cardContent}
                            </a>
                        ) : (
                            <article key={news.id}>
                                {cardContent}
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
