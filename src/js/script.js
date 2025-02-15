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
  
let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

function updateHistoryDisplay() {
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    const historyActions = document.getElementById('historyActions');

    // Only show history section if recording is enabled and there are items
    const shouldShowHistory = document.getElementById('recordToggle').checked && searchHistory.length > 0;
    historySection.style.display = shouldShowHistory ? 'block' : 'none';

    if (shouldShowHistory) {
        historyList.innerHTML = searchHistory.map((item, index) => `
            <div class="bg-gray-700 rounded-lg p-3">
                <div class="flex justify-between items-start">
                    <div class="text-white">
                        <p>شماره صندلی: ${item.seatNumber}</p>
                        <p class="text-sm text-gray-300">کلاس: ${item.className} - طبقه: ${item.floor}</p>
                    </div>
                    <button onclick="removeFromHistory(${index})" class="text-gray-400 hover:text-red-400">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');

        historyActions.style.display = 'grid';
        historyActions.className = 'mt-4 grid grid-cols-3 gap-2';
        historyActions.innerHTML = `
            <button onclick="copyHistory()" class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                کپی تاریخچه
            </button>
            <button onclick="downloadHistory()" class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                دانلود تاریخچه
            </button>
            <button onclick="takeHistoryScreenshot()" class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                اسکرین‌شات
            </button>
        `;
    }
}

function addToHistory(seatNumber, classInfo) {
    if (document.getElementById('recordToggle').checked) {
        const historyItem = {
            seatNumber,
            className: classInfo.title,
            floor: classInfo.floor,
            timestamp: new Date().toISOString()
        };
        searchHistory.push(historyItem);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        updateHistoryDisplay();
    }
}

function removeFromHistory(index) {
    searchHistory.splice(index, 1);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    updateHistoryDisplay();
}

function clearHistory() {
    if (confirm('آیا مطمئن هستید که می‌خواهید تاریخچه را پاک کنید؟')) {
        searchHistory = [];
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        updateHistoryDisplay();
    }
}

function copyHistory() {
    const historyText = searchHistory.map(item =>
        `دانشجوی عزیز، اطلاعات شما به شرح زیر است:
شماره صندلی شما: ${item.seatNumber}
طبقه: ${item.floor}
کلاس: ${item.className}
شماره‌های موجود در این کلاس: از ${data.find(d => d.title === item.className).from} تا ${data.find(d => d.title === item.className).to}
`
    ).join('\n-------------------\n') + '\n\nموفق باشید\n@Ham3ds';

    navigator.clipboard.writeText(historyText).then(() => {
        alert('تاریخچه با موفقیت کپی شد!');
    });
}

function downloadHistory() {
    const historyText = searchHistory.map(item =>
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

function findClass() {
    const seatNumber = parseInt(document.getElementById('seatNumber').value, 10);
    const resultDiv = document.getElementById('result');
    const displayContent = document.getElementById('displayContent');
    const resultContent = document.getElementById('resultContent');
    const copyBtn = document.getElementById('copyBtn');

    if (isNaN(seatNumber)) {
        const errorMsg = 'لطفاً یک شماره صندلی معتبر وارد کنید.';
        displayContent.innerHTML = errorMsg;
        resultContent.innerHTML = errorMsg;
        resultDiv.style.display = 'block';
        copyBtn.style.display = 'none';
        return;
    }

    const classInfo = data.find(
        (item) => seatNumber >= item.from && seatNumber <= item.to
    );

    if (classInfo) {
        const content = `
            <p>شماره صندلی: ${seatNumber}</p>
            <p>طبقه: ${classInfo.floor}</p>
            <p>کلاس: ${classInfo.title}</p>
            <p>شماره‌های موجود در این کلاس: از ${classInfo.from} تا ${classInfo.to}</p>
        `;
        displayContent.innerHTML = content;
        resultContent.innerHTML = content;
        copyBtn.style.display = 'block';
        addToHistory(seatNumber, classInfo);
    } else {
        const notFoundMsg = 'شماره صندلی یافت نشد.';
        displayContent.innerHTML = notFoundMsg;
        resultContent.innerHTML = notFoundMsg;
        copyBtn.style.display = 'none';
    }

    resultDiv.style.display = 'block';
}

function resetAll() {
    document.getElementById('seatNumber').value = '';
    document.getElementById('result').style.display = 'none';
    document.getElementById('copyBtn').style.display = 'block';
    document.getElementById('screenshotBtn').style.display = 'block';
    const accordionContent = document.querySelector('.accordion-content');
    accordionContent.style.display = 'none';
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

async function takeHistoryScreenshot() {
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
        const historyContent = searchHistory.map(item => `
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

function toggleAccordion() {
    const content = document.querySelector('.accordion-content');
    const header = document.querySelector('.accordion-header');
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        header.innerHTML = 'راهنمای استفاده ↑';
    } else {
        content.style.display = 'none';
        header.innerHTML = 'راهنمای استفاده ↓';
    }
}

function handleRecordToggle() {
    const isChecked = document.getElementById('recordToggle').checked;
    const historySection = document.getElementById('historySection');
    if (!isChecked) {
        historySection.style.display = 'none';
    } else if (searchHistory.length > 0) {
        historySection.style.display = 'block';
    }
}

// Initialize history display on page load
document.addEventListener('DOMContentLoaded', updateHistoryDisplay);