const hamburgerMenu = document.getElementById("menu");
const navMenu = document.getElementById("nav");

hamburgerMenu.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

// Scroll Header
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (window.scrollY > header.offsetHeight + 200) {
    header.classList.add("scroll");
  } else {
    header.classList.remove("scroll");
  }
});

// Shortening Links
const shortenURL = document.getElementById("shortenURL");
const shortenBtn = document.getElementById("shortenBtn");
const label = document.getElementById("label");

const clipboard = document.querySelector("#clipboard");
const originalLinkField = document.getElementById("original");
let dataLinks = [];

shortenBtn.addEventListener("click", getShortLink);

async function getShortLink() {
  const userURL = shortenURL.value;

  if (!userURL) {
    console.warn("Field Empty");
    label.style.display = "block";
    shortenURL.style.border = "2px solid hsl(0, 87%, 67%)";

    // Removes error message after 5 Seconds
    setTimeout(() => {
      label.style.display = "none";
      shortenURL.style.border = "none";
    }, 5000);

    return;
  }

  try {
    const response = await fetch(
      ` https://api.shrtco.de/v2/shorten?url=${userURL}`
    );
    const data = await response.json();

    //Pushing the object into an array so as to use the map method to display
    dataLinks.push(data.result);

    //Displaying the Generated Links
    displayShortLink(dataLinks);
    shortenURL.value = "";
  } catch (error) {
    console.error(error);
    label.textContent = "Something went wrong!";
    shortenURL.style.border = "2px solid hsl(0, 87%, 67%)";
    label.style.display = "block";

    // Removes error message after 5 Seconds
    setTimeout(() => {
      label.style.display = " none";
      shortenURL.style.border = "none";
    }, 5000);
  }
}

function displayShortLink(links) {
  const htmlString = links
    .map((link) => {
      return `
            <div class="link flex w-full gap-y-1 relative pb-6">
          <input id="original" type="text" value="${
            link.original_link
          }" readonly class=" hidden outline-none rounded-lg rounded-r-none w-1/2 p-4 text-DarkViolet md:block">
          <input id="short" type="text" value="${
            link.short_link
          }" readonly class=" short w-full outline-none rounded-l-none rounded-lg p-4 text-Cyan md:w-1/2">
          <button id="copyBtn" onclick="${copyToClipboard()};"  class="absolute px-4 py-2 bg-Cyan rounded-lg text-white  right-3 top-2">Copy</button>
        </div>

    
    `;
    })
    .join(" ");

  clipboard.innerHTML += htmlString;

  function copyToClipboard() {
    let copyBtn = document.querySelectorAll(".copyBtn");
    let shortLinkField = document.querySelectorAll(".short");

    copyBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        shortLinkField.forEach((field) => {
          field.select();
          document.execCommand("copy");
        });
      });
    });
  }
}
