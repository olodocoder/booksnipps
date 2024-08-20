const form = document.getElementById('snippet-form');
const submitBtn = document.getElementById('snippet-submit');
const bookTitle = document.getElementById('book-title');
const snippText = document.getElementById('snippet-text');
const category = document.getElementById('category');
const snippList = document.getElementById('snippets-list');
const addSec = document.getElementById('add-section');
const showFormBtn = document.getElementById('show-form-btn');
const catFilter = document.getElementById('category-filter');
const inpSearch = document.getElementById('search-input');

function addSnipp(e) {
  e.preventDefault();
  if (bookTitle.value === '' || snippText.value === '') {
    alert('please add something');
    return;
  }
  addSnipptoDOM(
    bookTitle.value,
    capitalize(snippText.value),
    capitalize(category.value)
  );

  bookTitle.value = '';
  snippText.value = '';
  showForm();
}

function addSnipptoDOM(title, snipp, category) {
  const li = document.createElement('li');
  li.innerHTML = `
    <strong>Title:</strong> ${title}<br />
    <strong>Category:</strong> ${category}<br />
     <strong>Snipp:</strong>👇🏿<p>
     ${snipp}
    </p>
    `;
  snippList.appendChild(li);

  const data = {
    title,
    category,
    snipp,
  };

  addItemToStorage(data);
}

function showForm() {
  if (addSec.style.display !== 'none') {
    addSec.style.display = 'none';
    showFormBtn.textContent = 'Add a Snipp';
  } else {
    addSec.style.display = 'block';
    showFormBtn.textContent = 'Hide Form';
  }
}

// Utils
function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('snipps') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('snipps'));
  }
  return itemsFromStorage;
}
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);
  localStorage.setItem('snipps', JSON.stringify(itemsFromStorage));
}

function clearLis() {
  snippList.innerHTML = '';
}

function loadUI() {
  clearLis();
  const LSData = getItemsFromStorage();
  if (LSData.length !== 0) {
    LSData.forEach((snippet) => {
      const li = document.createElement('li');
      li.innerHTML = `
    <strong>Title:</strong> ${snippet.title}<br />
    <strong>Category:</strong> ${snippet.category}<br />
    <strong>Snipp:</strong>👇🏿<p>
    ${snippet.snipp}
   </p>
    `;
      snippList.appendChild(li);
    });
  } else {
    allSnipps.innerText = 'Start adding your snipps to see them here 👇🏿';
  }
  showForm();
}

function filterByCategory(e) {
  const LSData = getItemsFromStorage();

  const filtered = LSData.filter((snip) => {
    return snip.category == capitalize(e.target.value);
  });
  clearLis();
  //   console.log(filtered);
  if (filtered.length !== 0) {
    filtered.forEach((snippet) => {
      const li = document.createElement('li');
      li.innerHTML = `
    <strong>Title:</strong> ${snippet.title}<br />
    <strong>Category:</strong> ${snippet.category}<br />
    <p>
    <strong>Snipp:</strong>  ${snippet.snipp}
    </p>
    `;

      snippList.appendChild(li);
    });
  } else {
    const div = document.createElement('div');
    div.innerHTML = `
    <strong>No match found for</strong> ${e.target.value.toLowerCase()}
    </p>
    `;
    snippList.appendChild(div);
  }
}

function capitalize(str) {
  const capStr = str[0].toUpperCase() + str.slice(1);
  return capStr;
}

function searchSnips(e) {
  console.log(e.target.value);
  const LSData = getItemsFromStorage();
  const filtered = LSData.filter((snip) => {
    return snip.snipp.toLowerCase().includes(e.target.value);
  });
  clearLis();
  if (filtered.length !== 0) {
    filtered.forEach((snippet) => {
      const li = document.createElement('li');
      li.innerHTML = `
    <strong>Title:</strong> ${snippet.title}<br />
    <strong>Category:</strong> ${snippet.category}<br />
    <strong>Snipp:</strong>👇🏿<p>
     ${snippet.snipp}
    </p>
    `;
      snippList.appendChild(li);
    });
  } else {
    const div = document.createElement('div');
    div.innerHTML = `
    <strong>No match found for</strong> ${e.target.value.toLowerCase()}
    </p>
    `;
    snippList.appendChild(div);
  }
}

function deleteSnipp(e) {
  if (e.target.tagName === 'P') {
    let cont = e.target.textContent;
    const LSData = getItemsFromStorage();
    const refreshLSD = LSData.filter(
      (snip) => !snip.snipp.includes(cont.trim())
    );
    localStorage.setItem('snipps', JSON.stringify(refreshLSD));

    loadUI();
  }
}

// event listeners
submitBtn.addEventListener('click', addSnipp);
showFormBtn.addEventListener('click', showForm);
catFilter.addEventListener('change', filterByCategory);
inpSearch.addEventListener('input', searchSnips);
snippList.addEventListener('dblclick', deleteSnipp);
window.addEventListener('DOMContentLoaded', loadUI);
