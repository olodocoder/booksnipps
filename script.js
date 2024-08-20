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
const allSnipps = document.getElementById('all-snipps');

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
  const li = createLi(title, category, snipp);
  snippList.appendChild(li);

  const data = {
    title,
    category,
    snipp,
  };

  addItemToStorage(data);
  showFilterAndSearch();
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

function createLi(titl, cat, snipp) {
  const li = document.createElement('li');
  li.innerHTML = `
    <strong>Title:</strong> ${titl}<br />
    <strong>Category:</strong> ${cat}<br />
     <strong>Snipp:</strong>👇🏿<p>
     ${snipp}
    </p>
    <button id="delete" class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
    `;
  return li;
}

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
      const li = createLi(snippet.title, snippet.category, snippet.snipp);

      snippList.appendChild(li);
    });
  } else {
    allSnipps.innerText = 'Start adding your snipps to see them here 👇🏿';
  }
  showFilterAndSearch();
}

showForm();

function filterByCategory(e) {
  if (e.target.value === '') {
    loadUI();
    return;
  }
  const LSData = getItemsFromStorage();

  const filtered = LSData.filter((snip) => {
    return snip.category == capitalize(e.target.value);
  });
  clearLis();
  if (filtered.length !== 0) {
    filtered.forEach((snippet) => {
      const li = createLi(snippet.title, snippet.category, snippet.snipp);

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
      const li = createLi(snippet.title, snippet.category, snippet.snipp);

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
  const deleteSnip = document.getElementById('delete');
  if (e.target.tagName === 'BUTTON' && e.target.id === 'delete') {
    let cont = e.target.previousElementSibling.textContent.trim();
    const LSData = getItemsFromStorage();
    if (confirm(`Are you sure you want to delete ${cont}?`)) {
      const refreshLSD = LSData.filter(
        (snip) => !snip.snipp.includes(cont.trim())
      );
      localStorage.setItem('snipps', JSON.stringify(refreshLSD));
    }

    showFilterAndSearch();
    loadUI();
  }
}

function showFilterAndSearch() {
  const LSData = getItemsFromStorage();
  if (LSData.length <= 4) {
    catFilter.style.display = 'none';
    inpSearch.style.display = 'none';
  } else {
    catFilter.style.display = 'block';
    inpSearch.style.display = 'block';
  }
}
// event listeners
submitBtn.addEventListener('click', addSnipp);
showFormBtn.addEventListener('click', showForm);
catFilter.addEventListener('change', filterByCategory);
inpSearch.addEventListener('input', searchSnips);
snippList.addEventListener('click', deleteSnipp);
window.addEventListener('DOMContentLoaded', loadUI);
window.addEventListener('DOMContentLoaded', showFilterAndSearch);
