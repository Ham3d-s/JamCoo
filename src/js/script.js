// Constants and Configuration
const SEAT_RANGE = {
    MIN: 1,
    MAX: 333
};

const NOTIFICATION_DURATION = 2000;

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-opacity duration-300 ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, NOTIFICATION_DURATION);
}

function validateSeatNumber(seatNumber) {
    if (isNaN(seatNumber)) {
        return { isValid: false, message: 'لطفاً یک عدد معتبر وارد کنید.' };
    }
    if (seatNumber < SEAT_RANGE.MIN || seatNumber > SEAT_RANGE.MAX) {
        return { isValid: false, message: `لطفاً عددی بین ${SEAT_RANGE.MIN} تا ${SEAT_RANGE.MAX} وارد کنید.` };
    }
    return { isValid: true };
}

const data = [
    {
      "from": 1,
      "to": 70,
      "title": "سالن اجتماعات",
      "floor": "همکف"
    },
    {
      "from": 71,
      "to": 102,
      "title": "کلاس ۲",
      "floor": "اول"
    },
    {
      "from": 103,
      "to": 122,
      "title": "کلاس ۳",
      "floor": "اول"
    },
    {
      "from": 123,
      "to": 145,
      "title": "کلاس ۴",
      "floor": "اول"
    },
    {
      "from": 146,
      "to": 177,
      "title": "کلاس ۵",
      "floor": "چهارم"
    },
    {
      "from": 178,
      "to": 209,
      "title": "کلاس ۶",
      "floor": "چهارم"
    },
    {
      "from": 210,
      "to": 241,
      "title": "کلاس ۹",
      "floor": "پنجم"
    },
    {
      "from": 242,
      "to": 273,
      "title": "کلاس ۱۰",
      "floor": "پنجم"
    },
    {
      "from": 274,
      "to": 305,
      "title": "کلاس ۱۱",
      "floor": "ششم"
    },
    {
      "from": 306,
      "to": 333,
      "title": "کلاس ۱۲",
      "floor": "ششم"
    }
  ];

// History Management
class HistoryManager {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    }

    add(item) {
        if (!document.getElementById('recordToggle').checked) return;
        
        // Check if this seat number already exists in history
        const exists = this.history.some(historyItem => 
            historyItem.seatNumber === item.seatNumber
        );

        if (!exists) {
            this.history.push(item);
            this.save();
            this.updateDisplay();
        }
    }

    remove(index) {
        this.history.splice(index, 1);
        this.save();
        this.updateDisplay();
    }

    clear() {
        if (confirm('آیا مطمئن هستید که می‌خواهید تاریخچه را پاک کنید؟')) {
            this.history = [];
            this.save();
            this.updateDisplay();
            showNotification('تاریخچه با موفقیت پاک شد');
        }
    }

    save() {
        localStorage.setItem('searchHistory', JSON.stringify(this.history));
    }

    updateDisplay() {
        const historySection = document.getElementById('historySection');
        const historyList = document.getElementById('historyList');
        const shouldShowHistory = document.getElementById('recordToggle').checked && this.history.length > 0;

        historySection.style.display = shouldShowHistory ? 'block' : 'none';

        if (shouldShowHistory) {
            historyList.innerHTML = this.history.map((item, index) => `
                <div class="bg-gray-700 rounded-lg p-4 transform transition-transform hover:scale-[1.02] hover:shadow-lg">
                    <div class="flex justify-between items-start">
                        <div class="text-white space-y-1">
                            <p class="font-medium">شماره صندلی: ${item.seatNumber}</p>
                            <p class="text-sm text-gray-300">کلاس: ${item.className} - طبقه: ${item.floor}</p>
                            <p class="text-xs text-gray-400">${new Date(item.timestamp).toLocaleDateString('fa-IR')}</p>
                        </div>
                        <button onclick="historyManager.remove(${index})" 
                                class="text-gray-400 hover:text-red-400 transition-colors">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            this.updateHistoryActions();
        }
    }

    updateHistoryActions() {
        const historyActions = document.getElementById('historyActions');
        historyActions.style.display = 'grid';
        historyActions.className = 'mt-4 grid grid-cols-3 gap-2';
        historyActions.innerHTML = `
            <button onclick="historyManager.copy()" 
                    class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                کپی تاریخچه
            </button>
            <button onclick="historyManager.download()" 
                    class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">
                دانلود تاریخچه
            </button>
            <button onclick="historyManager.takeScreenshot()" 
                    class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                اسکرین‌شات
            </button>
        `;
    }

    copy() {
        const historyText = this.history.map(item =>
            `دانشجوی عزیز، اطلاعات شما به شرح زیر است:
شماره صندلی شما: ${item.seatNumber}
طبقه: ${item.floor}
کلاس: ${item.className}
شماره‌های موجود در این کلاس: از ${data.find(d => d.title === item.className).from} تا ${data.find(d => d.title === item.className).to}
`
        ).join('\n-------------------\n') + '\n\nموفق باشید\n@Ham3ds';

        navigator.clipboard.writeText(historyText).then(() => {
            showNotification('تاریخچه با موفقیت کپی شد!');
        });
    }

    download() {
        const historyText = this.history.map(item =>
            `دانشجوی عزیز، اطلاعات شما به شرح زیر است:
شماره صندلی شما: ${item.seatNumber}
طبقه: ${item.floor}
کلاس: ${item.className}
شماره‌های موجود در این کلاس: از ${data.find(d => d.title === item.className).from} تا ${data.find(d => d.title === item.className).to}
`
        ).join('\n-------------------\n') + '\n\nموفق باشید\n@Ham3ds';

        const blob = new Blob([historyText], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'jamco-history.txt';
        link.click();
    }

    async takeScreenshot() {
        const historyList = document.getElementById('historyList');
        try {
            // Create a temporary container for the screenshot
            const tempContainer = document.createElement('div');
            tempContainer.style.background = '#374151';
            tempContainer.style.padding = '20px';
            tempContainer.style.borderRadius = '8px';
            tempContainer.style.maxWidth = '600px';
            tempContainer.style.margin = '0 auto';
            
            // Add history items
            const historyContent = this.history.map(item => `
                <div style="background: #4B5563; padding: 12px; margin: 8px 0; border-radius: 8px;">
                    <div style="color: white; margin-bottom: 4px;">شماره صندلی: ${item.seatNumber}</div>
                    <div style="color: #D1D5DB; font-size: 14px;">کلاس: ${item.className} - طبقه: ${item.floor}</div>
                </div>
            `).join('');
            
            tempContainer.innerHTML = `
                <h2 style="color: white; font-size: 20px; margin-bottom: 16px; text-align: center;">جام‌کو: جست و جوی کلاس و طبقه</h2>
                ${historyContent}
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #4B5563; text-align: left; color: #9CA3AF; font-size: 12px;">
                    JamCoo? - by Ham3ds
                </div>
            `;

            document.body.appendChild(tempContainer);
            
            const canvas = await html2canvas(tempContainer, {
                backgroundColor: '#374151',
                scale: 2,
                logging: false
            });
            
            document.body.removeChild(tempContainer);

            // Create download link
            const link = document.createElement('a');
            link.download = 'jamcoo-history.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

        } catch (err) {
            console.error('Failed to take history screenshot:', err);
            alert('خطا در تهیه اسکرین‌شات تاریخچه');
        }
    }
}

const historyManager = new HistoryManager();

// Search functionality
function findClass() {
    const seatNumber = parseInt(document.getElementById('seatNumber').value, 10);
    const validation = validateSeatNumber(seatNumber);

    if (!validation.isValid) {
        showNotification(validation.message, 'error');
        return;
    }

    const classInfo = data.find(item => seatNumber >= item.from && seatNumber <= item.to);

    if (!classInfo) {
        showNotification('شماره صندلی مورد نظر یافت نشد.', 'error');
        return;
    }

    updateSearchResult(seatNumber, classInfo);
    historyManager.add({
        seatNumber,
        className: classInfo.title,
        floor: classInfo.floor,
        timestamp: new Date().toISOString()
    });
}

function updateSearchResult(seatNumber, classInfo) {
    const resultDiv = document.getElementById('result');
    const displayContent = document.getElementById('displayContent');
    const resultContent = document.getElementById('resultContent');
    const copyBtn = document.getElementById('copyBtn');

    const content = `
        <p>شماره صندلی: ${seatNumber}</p>
        <p>طبقه: ${classInfo.floor}</p>
        <p>کلاس: ${classInfo.title}</p>
        <p>شماره‌های موجود در این کلاس: از ${classInfo.from} تا ${classInfo.to}</p>
    `;
    displayContent.innerHTML = content;
    resultContent.innerHTML = content;
    copyBtn.style.display = 'block';

    resultDiv.style.display = 'block';
}

function resetAll() {
    document.getElementById('seatNumber').value = '';
    document.getElementById('result').style.display = 'none';
    document.getElementById('copyBtn').style.display = 'block';
    document.getElementById('screenshotBtn').style.display = 'block';
    const accordionContent = document.querySelector('.accordion-content');
    const accordionIcon = document.querySelector('.accordion-icon > i');
    accordionContent.style.display = 'none';
    accordionIcon.style.transform = '';
}

function copyToClipboard() {
    const seatNumber = document.getElementById('seatNumber').value;
    const classInfo = data.find(
        (item) => seatNumber >= item.from && seatNumber <= item.to
    );

    if (classInfo) {
        const markdownText = `دانشجوی عزیز، اطلاعات شما به شرح زیر است:
شماره صندلی شما: ${seatNumber}
طبقه: ${classInfo.floor}
کلاس: ${classInfo.title}
شماره‌های موجود در این کلاس: از ${classInfo.from} تا ${classInfo.to}

موفق باشید
@Ham3ds`;

        navigator.clipboard.writeText(markdownText).then(() => {
            const copyBtn = document.getElementById('copyBtn');
            copyBtn.innerHTML = 'کپی شد!';
            setTimeout(() => {
                copyBtn.innerHTML = 'کپی اطلاعات';
            }, 2000);
        });
    }
}

async function takeScreenshot() {
    const screenshotArea = document.getElementById('screenshotArea');
    const screenshotBtn = document.getElementById('screenshotBtn');

    try {
        // Show screenshot area and style it
        screenshotArea.style.display = 'block';
        screenshotArea.style.padding = '20px';
        screenshotArea.style.background = '#374151';
        screenshotArea.style.borderRadius = '8px';

        const canvas = await html2canvas(screenshotArea, {
            backgroundColor: '#374151',
            scale: 2,
            logging: false
        });

        // Reset and hide screenshot area
        screenshotArea.style.display = 'none';
        screenshotArea.style.padding = '';
        screenshotArea.style.background = '';
        screenshotArea.style.borderRadius = '';

        // Copy to clipboard
        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                
                // Create download link
                const link = document.createElement('a');
                link.download = 'jamcoo-screenshot.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                screenshotBtn.innerHTML = 'کپی شد!';
                setTimeout(() => {
                    screenshotBtn.innerHTML = 'اسکرین‌شات';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy screenshot:', err);
                alert('خطا در کپی اسکرین‌شات');
            }
        }, 'image/png');
    } catch (err) {
        console.error('Failed to take screenshot:', err);
        alert('خطا در تهیه اسکرین‌شات');
    }
}

function toggleAccordion() {
    const content = document.querySelector('.accordion-content');
    const icon = document.querySelector('.accordion-icon > i');
    
    if (content.style.display === 'none' || !content.style.display) {
      // open state
      content.style.display = 'block';
      icon.style.transform = 'rotate(-180deg)';
    } else {
      // close state
      content.style.display = 'none';
      icon.style.transform = '';
    }
}

function handleRecordToggle() {
    historyManager.updateDisplay();
}

// Initialize history display on page load
document.addEventListener('DOMContentLoaded', () => {
    const existingHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    if (existingHistory.length > 0) {
        const recordToggle = document.getElementById('recordToggle');
        recordToggle.checked = true;
        document.getElementById('historySection').style.display = 'block';
    }
    
    historyManager.updateDisplay();
    
    const clearHistoryBtn = document.querySelector('[onclick="clearHistory()"]');
    if (clearHistoryBtn) {
        clearHistoryBtn.onclick = () => historyManager.clear();
    }
});
