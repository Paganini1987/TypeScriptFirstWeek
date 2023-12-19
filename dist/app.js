"use strict";
class Player {
    constructor(container) {
        this.sound = '';
        this.image = '';
        this.timer = 0;
        this.audio = null;
        this.prevButton = null;
        this.container = container;
        this.init();
    }
    init() {
        this.container.addEventListener('click', e => {
            const target = e.target;
            if (typeof target?.dataset.toggle !== 'undefined' && !this.timer) {
                this.image = target.dataset.img || '';
                this.sound = target.dataset.sound || '';
                this.playSound();
                this.setImage();
                target.classList.toggle('--playing');
                if (this.prevButton !== target) {
                    this.prevButton?.classList.remove('--playing');
                    this.prevButton = target;
                }
            }
        });
        const range = this.container.querySelector('[data-range]');
        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.volume = range ? Number(range.value) : 1;
        range?.addEventListener('input', e => {
            const target = e.target;
            if (this.audio) {
                this.audio.volume = Number(target.value);
            }
        });
    }
    setImage() {
        const imageTag = this.container.querySelector('[data-image]');
        const newImageTag = document.createElement('img');
        const src = imageTag?.getAttribute('src') || '';
        if (src && src !== this.image) {
            newImageTag.src = this.image;
            newImageTag.classList.add('image');
            imageTag?.after(newImageTag);
            this.timer = setTimeout(() => {
                imageTag?.setAttribute('src', this.image);
                setTimeout(() => {
                    newImageTag.remove();
                    this.timer = null;
                }, 100);
            }, 1000);
        }
    }
    playSound() {
        if (!this.audio)
            return;
        const currentFile = this.audio.src?.split('/').pop();
        const newFile = this.sound.split('/').pop();
        if (currentFile === newFile && this.audio.paused) {
            this.audio.play();
        }
        else if (currentFile === newFile) {
            this.audio.pause();
        }
        else {
            this.audio.pause();
            this.audio.src = this.sound;
            this.audio.play();
        }
    }
}
const container = document.querySelector('#app');
if (container) {
    new Player(container);
}
