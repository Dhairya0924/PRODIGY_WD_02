class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapTimes = [];
        this.totalElapsedTime = 0; // Track total time across resets
        
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.millisecondsDisplay = document.getElementById('milliseconds');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.lapList = document.getElementById('lapList');
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.updateDisplay(), 10);
            this.isRunning = true;
            this.updateButtons();
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            this.updateButtons();
        }
    }

    reset() {
        // Always stop the timer and reset everything
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.elapsedTime = 0;
        this.startTime = 0;
        this.totalElapsedTime = 0;
        this.updateDisplay();
        this.updateButtons();
        // Don't clear lap times - keep them for reference
    }

    recordLap() {
        if (this.isRunning) {
            const currentTime = this.elapsedTime;
            const lapNumber = this.lapTimes.length + 1;
            
            // Record the lap time
            this.lapTimes.push({
                number: lapNumber,
                time: currentTime,
                timestamp: new Date().toLocaleTimeString()
            });
            
            this.updateLapDisplay();
            
            // Add current elapsed time to total and reset display
            this.totalElapsedTime += this.elapsedTime;
            this.elapsedTime = 0;
            this.startTime = Date.now();
            this.updateDisplay();
        }
    }

    updateDisplay() {
        if (this.isRunning) {
            this.elapsedTime = Date.now() - this.startTime;
        }
        
        const totalMs = Math.floor(this.elapsedTime);
        const minutes = Math.floor(totalMs / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        const milliseconds = Math.floor((totalMs % 1000) / 10);

        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        this.millisecondsDisplay.textContent = milliseconds.toString().padStart(2, '0');
    }

    updateButtons() {
        this.startBtn.disabled = this.isRunning;
        this.pauseBtn.disabled = !this.isRunning;
        this.lapBtn.disabled = !this.isRunning;
    }

    updateLapDisplay() {
        if (this.lapTimes.length === 0) {
            this.lapList.innerHTML = '<div class="no-laps">No lap times recorded</div>';
            return;
        }

        this.lapList.innerHTML = '';
        
        // Display laps in reverse order (newest first)
        for (let i = this.lapTimes.length - 1; i >= 0; i--) {
            const lap = this.lapTimes[i];
            const lapElement = document.createElement('div');
            lapElement.className = 'lap-item';
            
            lapElement.innerHTML = `
                <span class="lap-number">Lap ${lap.number}</span>
                <div>
                    <div class="lap-time">${this.formatTime(lap.time)}</div>
                    <div class="lap-split">${lap.timestamp}</div>
                </div>
            `;
            
            this.lapList.appendChild(lapElement);
        }
    }

    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Prevent default behavior for these keys
    if (['Space', 'KeyR', 'KeyL'].includes(e.code)) {
        e.preventDefault();
    }
    
    switch(e.code) {
        case 'Space':
            // Toggle start/pause with spacebar
            const startBtn = document.getElementById('startBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            if (!startBtn.disabled) {
                startBtn.click();
            } else if (!pauseBtn.disabled) {
                pauseBtn.click();
            }
            break;
        case 'KeyR':
            // Reset with 'R' key
            document.getElementById('resetBtn').click();
            break;
        case 'KeyL':
            // Lap with 'L' key
            const lapBtn = document.getElementById('lapBtn');
            if (!lapBtn.disabled) {
                lapBtn.click();
            }
            break;
    }
});