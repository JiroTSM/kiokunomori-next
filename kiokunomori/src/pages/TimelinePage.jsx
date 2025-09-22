import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TimelinePage({
  memories,
  baseSocialMemories,
  publishedMemories,
  user,
  onPublish, // ✅ 公開用コールバック
}) {
  const [socialEvents, setSocialEvents] = useState({});
  const [personalEvents, setPersonalEvents] = useState({});
  const [selectedMemory, setSelectedMemory] = useState(null);

  // ページ先頭へ戻す
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 折りたたみ管理
  const [collapsedYears, setCollapsedYears] = useState({});
  const toggleYear = (year) => {
    setCollapsedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  // ✅ GSAP アニメーション用
const itemRefs = useRef([]);
const containerRef = useRef(null); // 👈 これを忘れずに
// ✅ 年タイトル専用の ref
const yearRefs = useRef([]);

useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handler = () => {
    const adjustOffset = 150; // ヘッダーぶん or 好きな値で調整
    const centerY = container.clientHeight / 2 + adjustOffset;
    const scrollTop = container.scrollTop;

    yearRefs.current.forEach((el, i) => {
      if (!el) return;
      const itemCenter = el.offsetTop + el.offsetHeight / 2 - scrollTop;
      const distance = Math.abs(centerY - itemCenter);

      const maxDistance = container.clientHeight / 2;
      const ratio = Math.min(distance / maxDistance, 1);

      const scale = 2.0 - ratio * 0.65;
      const opacity = 1 - ratio * 0.5;

      el.style.transform = `scale(${scale})`;
      el.style.opacity = opacity;
      });
    };

  container.addEventListener("scroll", handler);
  handler(); // 初期実行

  return () => container.removeEventListener("scroll", handler);
}, []);

  // === 全データを統合してグループ化 ===
  useEffect(() => {
    const groupedSocial = {};
    const groupedPersonal = {};

    // ① ホスト提供データ（CSV）
    baseSocialMemories.forEach((e) => {
      const year = e.date?.split("-")[0];
      if (!year) return;
      if (!groupedSocial[year]) groupedSocial[year] = [];
      groupedSocial[year].push({ ...e, role: "host" });
    });

    // ② 公開済みデータ
    publishedMemories.forEach((e) => {
      const year = e.date?.split("-")[0];
      if (!year) return;
      const item = { ...e, role: "user", __private: false };
      if (e.lane === "left") {
        if (!groupedSocial[year]) groupedSocial[year] = [];
        groupedSocial[year].push(item);
      } else if (e.lane === "right") {
        if (!groupedPersonal[year]) groupedPersonal[year] = [];
        groupedPersonal[year].push(item);
      }
    });

    // ③ 未公開（memories → 本人のみ表示）
    memories.forEach((e) => {
      const year = e.date?.split("-")[0];
      if (!year) return;

      // ✅ すでに公開済みなら非公開版は表示しない
      const alreadyPublished = publishedMemories.some(
        (p) => p.title === e.title && p.date === e.date
      );
      if (alreadyPublished) return;

      const item = {
        ...e,
        role: "user",
        publishedBy: user?.username,
        __private: true,
      };

      if (e.category === "social") {
        if (!groupedSocial[year]) groupedSocial[year] = [];
        groupedSocial[year].push(item);
      } else if (e.category === "personal") {
        if (!groupedPersonal[year]) groupedPersonal[year] = [];
        groupedPersonal[year].push(item);
      }
    });

    setSocialEvents(groupedSocial);
    setPersonalEvents(groupedPersonal);
  }, [baseSocialMemories, publishedMemories, memories, user]);

  return (
    <>
      {/* ✅ タイムライン専用ヘッダー */}
      <header className="fixed top-0 left-0 right-0 w-full bg-black text-white border-b border-gray-700 z-50">
        <div className="flex justify-between items-center px-4 py-1.5">
          <span className="text-[13px] font-semibold">SOCIAL</span>
          <span className="text-[13px] font-bold">TIMELINE</span>
          <span className="text-[13px] font-semibold">PRIVATE</span>
        </div>
      </header>

      {/* ✅ ヘッダー高さぶん余白 */}
      <div 
        ref={containerRef}
        className="pt-12 p-3 max-h-screen overflow-y-scroll pb-16">
        {Array.from({ length: 2025 - 1945 + 1 }, (_, i) => 2025 - i).map(
          (year, yearIndex) => (
            <div
              key={year}
              className="py-4"
              ref={(el) => (itemRefs.current[yearIndex] = el)} // ✅ アニメーション対象
            >
              {/* 年代ヘッダー（クリックで開閉） */}
              <div
                className="flex items-center justify-center text-[14px] font-bold cursor-pointer mb-2"
                onClick={() => toggleYear(year)}
              >
                <span
                  ref={(el) => (yearRefs.current[yearIndex] = el)} // ✅ 年タイトル専用 ref
                  className="text-red-600"
                  >
                {year}
                </span>
              </div>

              {/* 折りたたみ中は非表示 */}
              {!collapsedYears[year] && (
                <div className="grid grid-cols-2 gap-6 items-start h-[125px]">
                  {/* 左：社会的記憶 */}
                  <div className="text-left pr-[0.25px] space-y-2 overflow-y-auto">
                    {socialEvents[year]?.map((e, i) => (
                      <div
                        key={i}
                        className="mb-2 cursor-pointer hover:underline"
                        onClick={() => setSelectedMemory(e)}
                      >
                        <div className="text-[14px] font-semibold">
                          {e.title}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {e.__private
                            ? "（あなた・非公開）"
                            : e.publishedBy
                            ? `（${e.publishedBy}）`
                            : ""}
                        </span>
                        {e.__private &&
                          !publishedMemories.some(
                            (m) =>
                              m.title === e.title && m.date === e.date
                          ) && (
                            <button
                              onClick={(ev) => {
                                ev.stopPropagation();
                                onPublish(e, user);
                              }}
                              className="ml-2 text-xs bg-green-500 text-white px-1 py-0.5 rounded hover:bg-green-600"
                            >
                              公開
                            </button>
                          )}
                      </div>
                    ))}
                  </div>

                  {/* 右：個人記憶 */}
                  <div className="text-left space-y-3 overflow-y-auto">
                    {personalEvents[year]?.map((e, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition"
                      >
                        {/* サムネイル */}
                        {e.imageUrl && (
                          <img
                            src={e.imageUrl}
                            alt=""
                            className="w-full h-32 object-cover rounded mb-2"
                            onClick={() => setSelectedMemory(e)}
                          />
                        )}

                        {/* タイトル */}
                        <h3
                          className="font-semibold text-gray-800 text-sm cursor-pointer hover:underline"
                          onClick={() => setSelectedMemory(e)}
                        >
                          {e.__private &&
                          e.publishedBy !== user?.username
                            ? "🔒 非公開の記憶"
                            : e.title}
                        </h3>

                        {/* 説明 */}
                        <p
                          className="text-xs text-gray-600 mt-1 line-clamp-2 cursor-pointer"
                          onClick={() => setSelectedMemory(e)}
                        >
                          {e.__private &&
                          e.publishedBy !== user?.username
                            ? "この記憶は公開されていません"
                            : e.description || "（説明なし）"}
                        </p>

                        {/* 投稿者 */}
                        <span className="text-[11px] text-gray-400 block mt-1">
                          {e.__private
                            ? e.publishedBy === user?.username
                              ? "（あなた・非公開）"
                              : "（非公開）"
                            : `by ${e.publishedBy}`}
                        </span>

                        {/* 投稿日 */}
                        <span className="text-[11px] text-gray-400 block mt-1 text-right">
                          {e.date
                            ? new Date(e.date).toLocaleDateString()
                            : ""}
                        </span>

                        {/* 公開ボタン */}
                        {e.__private &&
                          e.publishedBy === user?.username &&
                          !publishedMemories.some(
                            (m) =>
                              m.title === e.title && m.date === e.date
                          ) && (
                            <button
                              onClick={(ev) => {
                                ev.stopPropagation();
                                onPublish(e, user);
                              }}
                              className="mt-2 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            >
                              公開
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="hidden border-t border-gray-300 opacity-70 mx-0.25 mt-3"></div>
            </div>
          )
        )}
      </div>

      {/* ✅ 固定フローティングボタン */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
      >
        ↑ 最新へ
      </button>

      {/* ✅ モーダル */}
      {selectedMemory && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            {selectedMemory.imageUrl && (
              <img
                src={selectedMemory.imageUrl}
                alt=""
                className="w-full max-h-64 object-cover rounded mb-4"
              />
            )}
            <h2 className="text-xl font-bold mb-2">
              【{selectedMemory?.title || "無題"}】
            </h2>
            <div className="text-xs text-gray-500 mb-4 space-y-1">
              {selectedMemory.date && (
                <div>
                  📅{" "}
                  {new Date(selectedMemory.date).toLocaleDateString()}
                </div>
              )}
              <div>
                🏷 カテゴリ:{" "}
                {selectedMemory.category === "social"
                  ? "社会的記憶"
                  : "個人的記憶"}
              </div>
              {!selectedMemory.__private &&
                selectedMemory.publishedBy && (
                  <div>👤 by {selectedMemory.publishedBy}</div>
                )}
              {selectedMemory.__private &&
                selectedMemory.publishedBy === user?.username && (
                  <div>🔒 あなたの非公開記憶</div>
                )}
            </div>
            <p className="mb-4 whitespace-pre-line text-base leading-snug">
              {selectedMemory?.description?.trim() ||
                selectedMemory?.summary?.trim() ||
                "内容がありません"}
            </p>
            <button
              onClick={() => setSelectedMemory(null)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}