const mobileToggle = document.querySelector('#mobile-toggle');
const links = document.querySelector('.links');

mobileToggle.addEventListener('click', function() {
    if(mobileToggle.classList.contains('active')){ 
    mobileToggle.classList.remove('active');
    links.classList.remove('active');
    }
    else {
    mobileToggle.classList.add('active');
    links.classList.add('active');
    }
});


const shortenForm = document.getElementById('shorten-form');
const linkInput = document.getElementById('link-input');
const errorMsg = document.getElementById('error-msg');
const submitBtn = document.querySelector('.btn-10');
const resultContainer = document.getElementById('result');

let savedLinks = JSON.parse(localStorage.getItem('shortened_links')) || [];
savedLinks.forEach(link => renderLinkRow(link.original, link.short));


shortenForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const urlValue = linkInput.value.trim();

    if (urlValue === '') {
        errorMsg.textContent = 'Please add a link';
        linkInput.classList.add('error');
    } else {
        errorMsg.textContent = '';
        linkInput.classList.remove('error');

        shortenLink(urlValue);
    }
})

async function shortenLink(longUrl) {
    // const submitBtn = document.querySelector('.btn-10');

    const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
    try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
    throw new Error('Network response was not ok');
    }

    const shortUrl = await response.text();

    savedLinks.push({ original: longUrl, short: shortUrl });
    localStorage.setItem('shortened_links', JSON.stringify(savedLinks));

    renderLinkRow(longUrl, shortUrl);
    linkInput.value = '';

    renderLinkRow(longUrl, shortUrl);
    
    linkInput.value = '';
    } catch (error) {
    console.error('Error fetching the API:', error);
    errorMsg.textContent = 'Something went wrong. Please try again.';
    linkInput.classList.add('error');
    }
}

function renderLinkRow(originalUrl, shortenedUrl) {
    const row = document.createElement('div');
    row.className = 'result-row'; 

    row.innerHTML = `
    <span class="original-url">${originalUrl}</span>
    <div class="right-side">
    <span class="shortened-url">${shortenedUrl}</span>
    <button class="copy-btn ">Copy</button>
    <button class="delete-btn ">❌</button>
    </div>
    `;

    const copyBtn = row.querySelector('.copy-btn');
    copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(shortenedUrl);
    
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('copied'); 
    });

    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        // 1. حذفه من الشاشة فوراً
        row.remove();

        // 2. حذفه من الذاكرة المحلية (localStorage)
        removeLinkFromStorage(shortenedUrl);
    });

    resultContainer.appendChild(row);
}

function removeLinkFromStorage(shortUrlToDelete) {
    // 1. جلب المصفوفة الحالية من الذاكرة
    let savedLinks = JSON.parse(localStorage.getItem('shortened_links')) || [];

    // 2. فلترة المصفوفة: إبقاء كل الروابط ما عدا الرابط الذي نريد حذفه
    savedLinks = savedLinks.filter(link => link.short !== shortUrlToDelete);

    // 3. حفظ المصفوفة الجديدة بعد الحذف في الذاكرة مجدداً
    localStorage.setItem('shortened_links', JSON.stringify(savedLinks));
}
