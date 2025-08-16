// 词库
const wordList = [
    "苹果", "香蕉", "橙子", "葡萄", "西瓜",
    "汽车", "飞机", "火车", "自行车", "轮船",
    "猫", "狗", "兔子", "狮子", "大象",
    "房子", "学校", "医院", "商店", "公园",
    "书", "笔", "电脑", "手机", "电视",
    "太阳", "月亮", "星星", "云朵", "彩虹",
    "花", "树", "草", "山", "河"
];

// 获取DOM元素
const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
const wordDisplay = document.getElementById('word-to-draw');
const wordBlurred = document.getElementById('word-blurred');
const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const giveUpBtn = document.getElementById('give-up-btn');
const clearBtn = document.getElementById('clear-btn');
const newWordBtn = document.getElementById('new-word-btn');
const colorBtns = document.querySelectorAll('.color-btn');
const brushSlider = document.getElementById('brush-slider');
const brushSizeValue = document.getElementById('brush-size-value');
const messageEl = document.getElementById('message');

// 游戏状态
let isDrawing = false;
let currentWord = "";
let currentColor = "black";
let brushSize = 5;
let hasStartedDrawing = false;

// 初始化画布
function initCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
}

// 获取随机词汇
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
}

// 显示消息
function showMessage(text, isSuccess) {
    messageEl.textContent = text;
    messageEl.className = "message " + (isSuccess ? "success" : "error");
    
    // 3秒后清除消息
    setTimeout(() => {
        messageEl.textContent = "";
        messageEl.className = "message";
    }, 3000);
}

// 设置当前词汇
function setCurrentWord() {
    currentWord = getRandomWord();
    wordDisplay.textContent = currentWord;
    wordBlurred.textContent = "*".repeat(currentWord.length);
    hasStartedDrawing = false;
    
    // 显示原始词汇，隐藏模糊词汇
    wordDisplay.classList.remove('hidden');
    wordBlurred.classList.add('hidden');
}

// 设置画笔颜色
function setBrushColor(color) {
    currentColor = color;
    ctx.strokeStyle = color;
    
    // 更新按钮状态
    colorBtns.forEach(btn => {
        if (btn.dataset.color === color) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 设置画笔大小
function setBrushSize(size) {
    brushSize = size;
    ctx.lineWidth = size;
    brushSizeValue.textContent = size;
}

// 开始绘制
function startDrawing(e) {
    isDrawing = true;
    draw(e); // 处理点击绘制点的情况
    
    // 如果是第一次绘制，模糊化关键词
    if (!hasStartedDrawing) {
        hasStartedDrawing = true;
        wordDisplay.classList.add('hidden');
        wordBlurred.classList.remove('hidden');
    }
}

// 绘制过程
function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// 停止绘制
function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

// 清除画布
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initCanvas();
    
    // 重置绘画状态，恢复关键词显示
    hasStartedDrawing = false;
    wordDisplay.classList.remove('hidden');
    wordBlurred.classList.add('hidden');
}

// 检查猜测
function checkGuess() {
    const guess = guessInput.value.trim();
    
    if (!guess) {
        showMessage("请输入你的猜测！", false);
        return;
    }
    
    if (guess === currentWord) {
        showMessage("恭喜你，猜对了！", true);
        // 显示被隐藏的关键词
        wordDisplay.classList.remove('hidden');
        wordBlurred.classList.add('hidden');
        // 猜对后换一个新词
        setTimeout(() => {
            setCurrentWord();
            clearCanvas();
        }, 2000);
    } else {
        showMessage("不对哦，再试试看！", false);
    }
    
    guessInput.value = "";
}

// 放弃猜测并显示答案
function giveUp() {
    showMessage(`答案是：${currentWord}`, false);
    // 显示被隐藏的关键词
    wordDisplay.classList.remove('hidden');
    wordBlurred.classList.add('hidden');
    // 3秒后换一个新词
    setTimeout(() => {
        setCurrentWord();
        clearCanvas();
    }, 3000);
}

// 事件监听器
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

guessBtn.addEventListener('click', checkGuess);
giveUpBtn.addEventListener('click', giveUp);
guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

clearBtn.addEventListener('click', clearCanvas);

newWordBtn.addEventListener('click', () => {
    setCurrentWord();
    clearCanvas();
});

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setBrushColor(btn.dataset.color);
    });
});

brushSlider.addEventListener('input', () => {
    setBrushSize(brushSlider.value);
});

// 初始化游戏
function initGame() {
    initCanvas();
    setCurrentWord();
}

// 页面加载完成后初始化
window.addEventListener('load', initGame);