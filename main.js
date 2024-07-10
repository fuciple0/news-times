const API_Key = `671fb72d7d804b99b1926a0d123a54e1`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

// let url = new URL(
//   `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_Key}`
// );
let url = new URL(`https://graceful-sherbet-defe7a.netlify.app/top-headlines`);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {
  try {
    url.searchParams.set("page", page); // => &page=page
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  // url = new URL(
  //   `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_Key}`
  // );
  url = new URL(`https://graceful-sherbet-defe7a.netlify.app/top-headlines`);
  getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();

  // url = new URL(
  //   `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_Key}`
  // );
  url = new URL(
    `https://graceful-sherbet-defe7a.netlify.app/top-headlines?category=${category}`
  );
  getNews();
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;

  // url = new URL(
  //   `https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_Key}`
  // );
  url = new URL(
    `https://graceful-sherbet-defe7a.netlify.app/top-headlines?q=${keyword}`
  );
  getNews();
};

const render = () => {
  const newsHTML = newsList.map((news) => `
   <div class="row news">
     <div class="col-lg-4">
       <img class="news-img-size" src=${news.urlToImage} onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU'; this.onerror=null;" ></div>
       <div class="col-lg-8">
       <a class="title" target="_blank" href="${news.url}">${news.title}</a>
       <p>${news.description == null || news.description == ""
          ? "내용없음"
          : news.description.length > 200
          ? news.description.substring(0, 200) + "..."
          : news.description}</p>
        <div>${news.source.name || "no source"}  ${moment(news.publishedAt).fromNow()}</div>
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

const paginationRender = () => {
  let paginationHTML = ``;
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;
  //마지막 페이지 그룹이 그룹사이즈보다 작다?
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  if (firstPage >= 6) {
    paginationHTML = `<li class="page-item" onclick="moveToPage(1)"><a class="page-link" href='#js-bottom'>&lt;&lt;</a></li>
  <li class="page-item" onclick="moveToPage(${
    page - 1
  })"><a class="page-link" href='#js-bottom'>&lt;</a></li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})"><a class="page-link" href='#js-bottom' >${i}</a></li>`;
  }

  if (lastPage < totalPages) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${
      page + 1
    })"><a class="page-link" href='#js-program-detail-bottom'>&gt;</a></li>
  <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" href='#js-bottom'>&gt;&gt;</a></li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  console.log("🚀 ~ moveToPage ~ moveToPage:", pageNum);
  page = pageNum;
  getNews();
};

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

getLatestNews();

//1.버튼에 클릭이벤트 주기
//2.카테고리별 뉴스 가져오기
//3.뉴스를 보여주기
