let descriptions;  // 用來儲存描述資料的全域變數
let resultDescription;

window.onload = function () {
     // Step 1: 載入 descriptions.json 文件
    fetch('descriptions.json')
        .then(response => response.json())
        .then(data => {
            descriptions = data;  // 將描述資料存入全域變數 descriptions 中
            initializeApplication();  // 初始化應用程式，例如顯示第一個問題
        })
        .catch(error => console.error('載入 descriptions.json 出錯:', error));
     
     document.addEventListener('DOMContentLoaded', function() {
    let progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = '50%';
    } else {
        console.error('找不到 progress-bar 元素');
    }
});

    function initializeApplication() {
    console.log('應用程式初始化中...');
    showCurrent(); // 顯示當前問題
    updateProgress(currentIndex, questionGroups.length); // 更新進度條
}
    
      // 獲取所有的 '.point' 元素
    const points = document.querySelectorAll('.point');

    // 為每個 '.point' 元素添加點擊事件監聽器
    points.forEach(point => {
    point.addEventListener('click', function () {
        const questionId = this.closest('.options-container').previousElementSibling?.id;
        if (questionId) {
            selectPoint(this, questionId);
        }
    });
});
      
    // 初始設置變量
    let currentIndex = 0;
     // 創建所有隱藏的輸入欄位
    const questionGroups = document.querySelectorAll('.question-group');
    questionGroups.forEach((group) => {
        const questionId = group.querySelector('.question').id;
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = questionId;
        document.getElementById('surveyForm').appendChild(input);
    });
    const pages = document.querySelectorAll('.page');
    const totalQuestions = questionGroups.length;

    console.log('Total questions:', totalQuestions); // Debug: 總問題數量

    // 初始化設置第一個問題組為高亮
    showCurrent();
    updateProgress();

    // 顯示當前的問題或頁面
    function showCurrent() {
    questionGroups.forEach((group, index) => {
        // 更新問題組的顯示與隱藏狀態
        if (index === currentIndex) {
            group.style.display = 'block'; // 顯示當前問題
        } else {
            group.style.display = 'none'; // 隱藏其他問題
        }
    });
}

    console.log('Showing current index:', currentIndex); // Debug: 當前顯示的問題或頁面索引

    // 更新問題組樣式
    questionGroups.forEach((group, index) => {
        // 移除之前的高亮和淡入效果
        group.classList.remove('current-question', 'fade-in');
        group.classList.add('inactive');
        
        if (index === currentIndex) {
            // 設置當前問題組
            group.classList.add('current-question');
            group.classList.remove('inactive');

            // 動態添加淡入效果，並在動畫結束後移除
            group.classList.add('fade-in');
            setTimeout(() => {
                group.classList.remove('fade-in');
            }, 500); // 0.5秒後移除，以便能再次使用
        }
    });

    // 更新頁面的樣式
    pages.forEach((page, index) => {
        // 移除之前的顯示樣式
        page.classList.remove('active');

        if (index === currentIndex) {
            // 設置當前頁面
            page.classList.add('active');
        }
    });
}

    // 更新進度條
    function updateProgress(currentIndex, totalQuestions) {
    if (totalQuestions === 0 || totalQuestions === undefined) {
        console.error('Total questions is zero or undefined.');
        return;
    }

    const progressPercentage = (currentIndex / totalQuestions) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
    } else {
        console.error('Progress bar element not found.');
    }
    console.log(`Progress updated to ${progressPercentage}%`);
}

    // 下一題的函數
    function next() {
        if (currentIndex < Math.max(questionGroups.length, pages.length) - 1) {
            console.log('Moving to next question/page. Current index:', currentIndex); // Debug: 轉到下一個問題或頁面

            currentIndex++;
            showCurrent();
            updateProgress();
        } else {
            console.log('Already at the last question/page.'); // Debug: 已經到達最後一個問題或頁面
        }
    }

    // 點擊選項時選擇該點
    function selectPoint(element, question) {
    console.log('Selected option for question:', question, 'Value:', element.getAttribute('data-value')); // Debug: 選擇的問題和選項值

    // 移除當前選項的高亮
    const allPoints = element.parentNode?.querySelectorAll('.point');
    if (allPoints) {
        allPoints.forEach(point => point.classList.remove('selected'));
    }

    // 高亮選中的選項
    element.classList.add('selected');

    // 更新隱藏輸入欄位的值
    let input = document.querySelector(`input[name="${question}"]`);
    if (input) {
        input.value = element.getAttribute('data-value');
    }

    console.log('Updated hidden input for question:', question, 'Value:', input.value); // Debug: 更新隱藏輸入欄位的值

    // 移動到下一個問題，並將其高亮顯示
    setTimeout(next, 300); // 延遲 0.3 秒後自動進入下一題，讓用戶有足夠時間看到選擇效果
    if (currentIndex < questionGroups.length - 1) {
        next();
    }
}


    // 將按鈕點擊事件附加到 "下一步" 按鈕
    const nextButton = document.querySelector('button[type="button"]');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            console.log('"Next" button clicked'); // Debug: "下一步" 按鈕點擊
            next();
        });
    }
    
    // 這是根據描述來取得結果描述的函數
function getDescription(profession, scores) {
    // 確保 descriptions 已經載入
    if (!descriptions || !descriptions[profession]) {
        return "描述資料尚未載入或無法找到相應的職業。";
    }

    // 取得職業的主描述和變體描述
    let professionData = descriptions[profession];
    let mainDescription = professionData.mainDescription;

    // 根據得分決定變體描述的 key
    let tasteLevel = scores.tasteScore > 4 ? 'rich' : 'light';
    let priceLevel = scores.priceScore > 4 ? 'tolerant' : 'sensitive';
    let variantKey = `${tasteLevel}_${priceLevel}`;

    // 取得對應的變體描述
    let variantDescription = professionData.variants[variantKey] || "無法找到適合的描述變體。";

    // 回傳主描述 + 變體描述
    return `${mainDescription}\n\n${variantDescription}`;
}

    // 提交測驗函數
function submitTest() {
    // 禁用提交按鈕以防止重複點擊
    const submitButton = document.querySelector('button[onclick="submitTest()"]');
    submitButton.disabled = true;
     if (!allQuestionsAnswered) {
    alert("請回答所有問題後再提交測驗。");
    return;
}

    // 取得表單數據
    const formData = new FormData(document.getElementById("surveyForm"));
    const testData = {};

   // 檢查是否所有問題都已回答
    let allQuestionsAnswered = true;

    for (let [key, value] of formData.entries()) {
        if (!value) {
            allQuestionsAnswered = false;
            break;
        }
        testData[key] = parseInt(value);
    }

    if (!allQuestionsAnswered) {
        alert("請回答所有問題後再提交測驗。");
        submitButton.disabled = false; // 恢復提交按鈕
        return;
    }

    // 題目加權設計
    const questionWeights = {
        q1: 0.7, q2: 0.5, q3: 0.6, q4: 0.8, q5: 0.9, q6: 0.6, q7: 0.5,
        q8: 0.8, q9: 0.7, q10: 0.6, q11: 0.9, q12: 0.7, q13: 0.6, q14: 0.5,
        q15: 0.8, q16: 0.7, q17: 0.5, q18: 0.6, q19: 0.7, q20: 0.6, q21: 0.9,
        q22: 0.7, q23: 0.8, q24: 0.6, q25: 0.7, q26: 0.8, q27: 0.5, q28: 0.6
    };

    // 計算每個因素的得分
    let scores = {
        taste: 0,
        price: 0,
        health: 0,
        location: 0
    };
    let questionCount = {
        taste: 0,
        price: 0,
        health: 0,
        location: 0
    };

    // 分數累加
    for (let question in testData) {
        if (question.startsWith('q')) {
            const score = testData[question];
            const weight = questionWeights[question];

            if (['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'].includes(question)) {
                scores.taste += score * weight;
                questionCount.taste++;
            } else if (['q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14'].includes(question)) {
                scores.price += score * weight;
                questionCount.price++;
            } else if (['q15', 'q16', 'q17', 'q18', 'q19', 'q20', 'q21'].includes(question)) {
                scores.health += score * weight;
                questionCount.health++;
            } else if (['q22', 'q23', 'q24', 'q25', 'q26', 'q27', 'q28'].includes(question)) {
                scores.location += score * weight;
                questionCount.location++;
            }
        }
    }

    // 計算各因素的平均得分
    scores.taste = scores.taste / questionCount.taste;
    scores.price = scores.price / questionCount.price;
    scores.health = scores.health / questionCount.health;
    scores.location = scores.location / questionCount.location;

    // 確定主要因素組合，並根據組合選擇職業和描述
    const highestFactors = determineHighestFactors(scores);
    const resultDescription = getResultDescription(highestFactors);

    // 顯示結果
    document.getElementById("result").innerText = resultDescription;

    // 顯示條狀圖
    displayBarChart(scores);
}

// 確定主要因素組合的函數
function determineHighestFactors(scores) {
    let sortedFactors = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    return sortedFactors.slice(0, 2); // 返回前兩個得分最高的因素
}

// 根據因素組合取得對應描述
function getResultDescription(highestFactors) {
    const [factor1, factor2] = highestFactors;

    // 根據因素組合取得對應描述
function getResultDescription(highestFactors, scores) {
    const [factor1, factor2] = highestFactors;

    // 根據因素組合返回對應的職業描述
    if (factor1 === 'taste' && factor2 === 'price') {
        return getSommelierDescription(scores.taste, scores.price);
    } else if (factor1 === 'taste' && factor2 === 'health') {
        return getOilTasterDescription(scores.taste, scores.health);
    } else if (factor1 === 'taste' && factor2 === 'location') {
        return getBrewerDescription(scores.taste, scores.location);
    } else if (factor1 === 'price' && factor2 === 'taste') {
        return getJamMakerDescription(scores.taste, scores.price);
    } else if (factor1 === 'price' && factor2 === 'health') {
        return getTeaMasterDescription(scores.price, scores.health);
    } else if (factor1 === 'price' && factor2 === 'location') {
        return getSpiceBlenderDescription(scores.price, scores.location);
    } else if (factor1 === 'health' && factor2 === 'taste') {
        return getHoneySommelierDescription(scores.taste, scores.health);
    } else if (factor1 === 'health' && factor2 === 'price') {
        return getMycologistDescription(scores.health, scores.price);
    } else if (factor1 === 'health' && factor2 === 'location') {
        return getSeaweedHarvesterDescription(scores.health, scores.location);
    } else if (factor1 === 'location' && factor2 === 'taste') {
        return getQGraderDescription(scores.taste, scores.location);
    } else if (factor1 === 'location' && factor2 === 'price') {
        return getTruffleHunterDescription(scores.price, scores.location);
    } else if (factor1 === 'location' && factor2 === 'health') {
        return getNattoMakerDescription(scores.health, scores.location);
    } else {
        return '無法根據該組合找到對應的職業描述';
    }
}

    // 準備發送到 Google Sheets 的數據
    const sheetData = {
        Timestamp: new Date().toISOString(),
        UserID: testData.userId,
        口味: scores.taste.toFixed(2),
        價格: scores.price.toFixed(2),
        健康: scores.health.toFixed(2),
        地點: scores.location.toFixed(2),
        Q1: testData.q1, Q2: testData.q2, Q3: testData.q3, Q4: testData.q4,
        Q5: testData.q5, Q6: testData.q6, Q7: testData.q7, Q8: testData.q8,
        Q9: testData.q9, Q10: testData.q10, Q11: testData.q11, Q12: testData.q12,
        Q13: testData.q13, Q14: testData.q14, Q15: testData.q15, Q16: testData.q16,
        Q17: testData.q17, Q18: testData.q18, Q19: testData.q19, Q20: testData.q20,
        Q21: testData.q21, Q22: testData.q22, Q23: testData.q23, Q24: testData.q24,
        Q25: testData.q25, Q26: testData.q26, Q27: testData.q27, Q28: testData.q28
    };

   // 發送數據到中間層服務器 (NodeMJS)
    fetch('http://localhost:3000/forward-request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sheetData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("伺服器回應失敗");
            }
            return response.json();
        })
        .then(data => {
            console.log("測驗結果已成功存儲: ", data);

            // 將測驗結果存儲到本地儲存中，這樣可以在結果頁面顯示
            localStorage.setItem('testResults', JSON.stringify(scores));

            // 重定向到結果頁面
            window.location.href = "result.html";
        })
        .catch(error => {
            console.error("存儲測驗結果時出錯：", error);
            alert("存儲測驗結果時發生錯誤：" + error.message);
        })
        .finally(() => {
            // 恢復提交按鈕狀態
            submitButton.disabled = false;
        });
}
    // 因素名稱翻譯
    function translateFactor(factor) {
        switch (factor) {
            case 'taste':
                return '口味';
            case 'price':
                return '價格';
            case 'health':
                return '健康';
            case 'location':
                return '地點';
            default:
                return '';
        }
    }
    
    // 顯示條狀圖
function displayBarChart(scores) {
    const ctx = document.getElementById('barChart').getContext('2d');

    // 檢查是否有已存在的圖表，避免重複創建圖表
    if (window.myBarChart) {
        window.myBarChart.destroy();
    }

    // 新建一個水平條狀圖
    window.myBarChart = new Chart(ctx, {
        type: 'horizontalBar', // 更改為水平條狀圖
        data: {
            labels: ['口味', '價格', '健康', '地點'],
            datasets: [{
                label: '因素得分',
                data: [scores.taste, scores.price, scores.health, scores.location],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 7, // 最大分數是 7
                        stepSize: 1 // 每個刻度增量
                    },
                    scaleLabel: {
                        display: true,
                        labelString: '得分'
                    }
                }],
                yAxes: [{
                    barPercentage: 0.5, // 調整條的寬度
                    scaleLabel: {
                        display: true,
                        labelString: '因素'
                    }
                }]
            },
            plugins: {
                legend: {
                    display: false // 隱藏圖例
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw}`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false // 使圖表更加靈活
        }
    });
}

    // 將函數附加到全域範圍
    window.selectPoint = selectPoint;
    window.nextpage = next;
    window.submitTest = submitTest;
};
