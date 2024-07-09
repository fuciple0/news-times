const API_Key = `671fb72d7d804b99b1926a0d123a54e1`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

let url = new URL(`https://graceful-sherbet-defe7a.netlify.app/top-headlines`);

const getNews = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      render();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  // const url = new URL(
  //     `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_Key}`
  // )
  url = new URL(`https://graceful-sherbet-defe7a.netlify.app/top-headlines`);
  getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_Key}`
  // )
  url = new URL(
    `https://graceful-sherbet-defe7a.netlify.app/top-headlines?category=${category}`
  );
  getNews();
};
const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_Key}`
  // )
  url = new URL(
    `https://graceful-sherbet-defe7a.netlify.app/top-headlines?q=${keyword}`
  );
  getNews();
};

const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `
        <div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size" src=${news.urlToImage} alt="">
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                    <p>${news.description}</p>
                    <div>${news.source.name} * ${news.publishedAt}</div>
                </div>
            </div>`
    )
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
    </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

getLatestNews();

//1.버튼에 클릭이벤트 주기
//2.카테고리별 뉴스 가져오기
//3.뉴스를 보여주기
