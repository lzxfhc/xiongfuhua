// v7: 简洁交互 - 经历默认收起
document.addEventListener('DOMContentLoaded', function() {

    // ========== 经历卡片展开/收起 ==========
    const expCards = document.querySelectorAll('.exp-card');
    expCards.forEach(card => {
        const header = card.querySelector('.exp-card-header');
        header.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });

    // 默认收起所有卡片（不添加 expanded 类）

    // ========== 平滑滚动 ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== Lightbox功能 ==========
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxClose = document.querySelector('.lightbox-close');

    let currentGroup = [];
    let currentIndex = 0;

    // 创建导航箭头
    const prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-nav lightbox-prev';
    prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-nav lightbox-next';
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 6 15 12 9 18"/></svg>';

    lightbox.appendChild(prevBtn);
    lightbox.appendChild(nextBtn);

    // 创建缩略图容器
    const thumbsContainer = document.createElement('div');
    thumbsContainer.className = 'lightbox-thumbs';
    lightbox.appendChild(thumbsContainer);

    function showMedia(index) {
        if (index < 0 || index >= currentGroup.length) return;

        currentIndex = index;
        const item = currentGroup[index];
        const src = item.dataset.src;
        const type = item.dataset.type;

        if (type === 'video') {
            lightbox.classList.add('video');
            lightboxVideo.src = src;
            lightboxVideo.play();
            lightboxImg.src = '';
        } else {
            lightbox.classList.remove('video');
            lightboxImg.src = src;
            lightboxVideo.pause();
            lightboxVideo.src = '';
        }

        updateThumbsHighlight();
        updateNavButtons();
    }

    function updateThumbsHighlight() {
        const thumbs = thumbsContainer.querySelectorAll('.lightbox-thumb');
        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
        });
    }

    function updateNavButtons() {
        prevBtn.style.display = currentGroup.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = currentGroup.length > 1 ? 'flex' : 'none';
        prevBtn.style.opacity = currentIndex > 0 ? '1' : '0.3';
        nextBtn.style.opacity = currentIndex < currentGroup.length - 1 ? '1' : '0.3';
    }

    function buildThumbs() {
        thumbsContainer.innerHTML = '';

        if (currentGroup.length <= 1) {
            thumbsContainer.style.display = 'none';
            return;
        }

        thumbsContainer.style.display = 'flex';

        currentGroup.forEach((item, i) => {
            const thumb = document.createElement('div');
            thumb.className = 'lightbox-thumb' + (i === currentIndex ? ' active' : '');

            const type = item.dataset.type;
            if (type === 'video') {
                thumb.innerHTML = '<div class="thumb-video"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>';
            } else {
                const img = item.querySelector('img');
                if (img) {
                    thumb.innerHTML = `<img src="${img.src}" alt="">`;
                }
            }

            const nameEl = item.querySelector('.media-name');
            if (nameEl) {
                const name = document.createElement('span');
                name.className = 'thumb-name';
                name.textContent = nameEl.textContent;
                thumb.appendChild(name);
            }

            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                showMedia(i);
            });

            thumbsContainer.appendChild(thumb);
        });
    }

    document.querySelectorAll('.media-thumb').forEach(thumb => {
        thumb.addEventListener('click', function(e) {
            e.stopPropagation();

            const mediaRow = this.closest('.media-row');
            if (mediaRow) {
                currentGroup = Array.from(mediaRow.querySelectorAll('.media-thumb'));
                currentIndex = currentGroup.indexOf(this);
            } else {
                currentGroup = [this];
                currentIndex = 0;
            }

            buildThumbs();
            showMedia(currentIndex);

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentIndex > 0) showMedia(currentIndex - 1);
    });

    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentIndex < currentGroup.length - 1) showMedia(currentIndex + 1);
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.classList.remove('video');
        lightboxVideo.pause();
        lightboxVideo.src = '';
        lightboxImg.src = '';
        document.body.style.overflow = '';
        currentGroup = [];
        currentIndex = 0;
    }

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowLeft': if (currentIndex > 0) showMedia(currentIndex - 1); break;
            case 'ArrowRight': if (currentIndex < currentGroup.length - 1) showMedia(currentIndex + 1); break;
        }
    });
});
