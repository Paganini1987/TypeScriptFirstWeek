class Player {
    container: HTMLElement;
    private sound: string = '';
    private image: string = '';
    private timer: number | null = 0;
    private audio: HTMLAudioElement | null = null;
    private prevButton: HTMLButtonElement | null = null;
    constructor(container: HTMLElement) {
        this.container = container;

        this.init();
    }

    private init(): void {
        this.container.addEventListener('click', e => {
            const target = e.target as HTMLButtonElement;

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
        })

        const range: HTMLInputElement | null = this.container.querySelector('[data-range]');

        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.volume = range ? Number(range.value) : 1;

        range?.addEventListener('input', e => {
            const target = e.target as HTMLInputElement;

            if (this.audio) {
                this.audio.volume = Number(target.value);
            }
        })
    }

    private setImage(): void {
        const imageTag: HTMLElement | null = this.container.querySelector('[data-image]');
        const newImageTag: HTMLImageElement = document.createElement('img');
        const src: string = imageTag?.getAttribute('src') || '';

        if (src && src !== this.image) {
            newImageTag.src = this.image;
            newImageTag.classList.add('image');
            imageTag?.after(newImageTag);

            this.timer = setTimeout((): void => {
                imageTag?.setAttribute('src', this.image);

                setTimeout((): void => {
                    newImageTag.remove();
                    this.timer = null;
                }, 100)
            }, 1000)
        }
    }

    private playSound(): void {
        if (!this.audio) return;

        const currentFile: string | undefined = this.audio.src?.split('/').pop();
        const newFile: string | undefined = this.sound.split('/').pop();

        if (currentFile === newFile && this.audio.paused) {
            this.audio.play();
        } else if (currentFile === newFile) {
            this.audio.pause();
        } else {
            this.audio.pause();
            this.audio.src = this.sound;
            this.audio.play();
        }
    }
}

const container: HTMLElement | null = document.querySelector('#app');

if (container) {
    new Player(container);
}
