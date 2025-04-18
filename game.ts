
interface Color {
    r: number;
    g: number;
    b: number;
}

class ColorPickerChallenge {
    private targetColor!: Color;
    private options!: Color[];
    private targetColorElement: HTMLElement;
    private colorGridElement: HTMLElement;
    private resultElement: HTMLElement;
    private newGameButton: HTMLElement;
    private levelsBeatenElement: HTMLElement;
    private levelTriesElement: HTMLElement;
    private totalTriesElement: HTMLElement;
    private levelsBeaten: number = 0;
    private levelTries: number = 0;
    private totalTries: number = 0;

    constructor() {
        this.targetColorElement = document.getElementById('target-color')!;
        this.colorGridElement = document.getElementById('color-grid')!;
        this.resultElement = document.getElementById('result')!;
        this.newGameButton = document.getElementById('new-game')!;
        this.levelsBeatenElement = document.getElementById('levels-beaten')!;
        this.levelTriesElement = document.getElementById('level-tries')!;
        this.totalTriesElement = document.getElementById('total-tries')!;

        try {
            const savedLevelsBeaten = localStorage.getItem('levelsBeaten');
            const savedTotalTries = localStorage.getItem('totalTries');
            this.levelsBeaten = savedLevelsBeaten ? parseInt(savedLevelsBeaten, 10) : 0;
            this.totalTries = savedTotalTries ? parseInt(savedTotalTries, 10) : 0;
        } catch (e) {
            console.warn('LocalStorage not available:', e);
            this.levelsBeaten = 0;
            this.totalTries = 0;
        }

        this.newGameButton.addEventListener('click', () => this.startNewGame());
        this.startNewGame();
    }

    private generateRandomColor(): Color {
        return {
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256)
        };
    }

    private colorsAreEqual(c1: Color, c2: Color): boolean {
        return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b;
    }

    private shuffleArray<T>(arr: T[]): T[] {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    private generateColorOptions(targetColor: Color): Color[] {
        const options = [targetColor];
        while (options.length < 6) {
            const newColor = this.generateRandomColor();
            const isDuplicate = options.some(color => this.colorsAreEqual(color, newColor));
            if (!isDuplicate) {
                options.push(newColor);
            }
        }
        return this.shuffleArray(options);
    }

    private startNewGame(): void {
        this.targetColor = this.generateRandomColor();
        this.options = this.generateColorOptions(this.targetColor);
        this.levelTries = 0;
        this.renderGame();
        this.updateScoreboard();
    }

    private renderGame(): void {
        this.targetColorElement.textContent = `Target: RGB(${this.targetColor.r}, ${this.targetColor.g}, ${this.targetColor.b})`;
        this.colorGridElement.innerHTML = '';
        this.options.forEach((color, index) => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
            colorOption.addEventListener('click', () => this.handleColorClick(index));
            this.colorGridElement.appendChild(colorOption);
        });
        this.resultElement.textContent = '';
    }

    private handleColorClick(index: number): void {
        this.levelTries++;
        this.totalTries++;
        localStorage.setItem('totalTries', this.totalTries.toString());

        const selectedColor = this.options[index];
        if (this.colorsAreEqual(selectedColor, this.targetColor)) {
            this.resultElement.textContent = 'Correct!';
            this.levelsBeaten++;
            localStorage.setItem('levelsBeaten', this.levelsBeaten.toString());
            this.updateScoreboard();
            setTimeout(() => this.startNewGame(), 1500);
        } else {
            this.resultElement.textContent = 'Wrong! Try again.';
            this.updateScoreboard();
        }
    }

    private updateScoreboard(): void {
        this.levelsBeatenElement.textContent = `Levels beaten: ${this.levelsBeaten}`;
        this.levelTriesElement.textContent = `Tries this level: ${this.levelTries}`;
        this.totalTriesElement.textContent = `Total tries: ${this.totalTries}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ColorPickerChallenge();
});
