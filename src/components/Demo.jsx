import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);

      localStorage.setItem("article", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };
  return (
    <section className="mt-16 w-full max-w-xl">
      
      <div className="flex flex-col w-full gap-2">
        {/* Input */}
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="linkIcon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Paste the article link here"
            value={article.url}
            onChange={(e) => {
              setArticle({
                ...article,
                url: e.target.value,
              });
            }}
            onKeyDown={handleKeyDown}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:bg-sky-500 focus:bg-sky-500
             peer-focus:text-white focus:text-white"
          >
            Enter
          </button>
        </form>
        {/* Browse History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className="w-[40%] h-[40%] object-contain animate-pulse"
                />
              </div>
              <p className="flex-1 font-satoshi text-sky-600 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* display result */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <div className="border border-red-200 bg-red-100 px-7 py-3 rounded">
            <p className="font-inter font-medium text-red-400 text-center">
            Well, that wasn&apos;t supposed to happen...
            <br />
            <span className="font-satoshi font-light text-red-400">
              {error?.data?.error}
            </span>
          </p>
          </div>

          
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl text-center">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-satoshi font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
