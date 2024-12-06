    window.onload = function () {
      // 獲取所有的 '.point' 元素
    const points = document.querySelectorAll('.point');

    // 為每個 '.point' 元素添加點擊事件監聽器
    points.forEach(point => {
        point.addEventListener('click', function () {
            // 獲取這個點所屬的問題 ID
            const questionId = this.closest('.options-container').previousElementSibling.id;

            // 調用 selectPoint 函數，將點擊的點和問題 ID 作為參數傳遞
            selectPoint(this, questionId);
        });
    });
      
    // 初始設置變量
    let currentIndex = 0;
    const questionGroups = document.querySelectorAll('.question-group');
    const pages = document.querySelectorAll('.page');
    const totalQuestions = questionGroups.length;

    console.log('Total questions:', totalQuestions); // Debug: 總問題數量

    // 初始化設置第一個問題組為高亮
    showCurrent();
    updateProgress();

    // 顯示當前的問題或頁面
    function showCurrent() {
        console.log('Showing current index:', currentIndex); // Debug: 當前顯示的問題或頁面索引

        questionGroups.forEach((group, index) => {
            group.classList.toggle('current-question', index === currentIndex);
            group.classList.toggle('inactive', index !== currentIndex);

            // 保留原有的過渡效果
            if (index === currentIndex) {
                group.classList.add('fade-in'); // 添加淡入效果
            } else {
                group.classList.remove('fade-in');
            }
        });

        pages.forEach((page, index) => {
            page.classList.toggle('active', index === currentIndex);
        });
    }

    // 更新進度條
    function updateProgress() {
        const progress = ((currentIndex + 1) / totalQuestions) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
        console.log('Progress updated to:', progress + '%'); // Debug: 更新進度條
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
        const allPoints = element.parentNode.querySelectorAll('.point');
        allPoints.forEach(point => point.classList.remove('selected'));

        // 高亮選中的選項
        element.classList.add('selected');

        // 將選擇的值存入表單中的隱藏輸入欄位
        let input = document.querySelector(`input[name="${question}"]`);
        if (!input) {
            // 如果該輸入欄位不存在，創建一個
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = question;
            document.getElementById('surveyForm').appendChild(input);
        }
        // 更新輸入欄位的值
        input.value = element.getAttribute('data-value');

        console.log('Updated hidden input for question:', question, 'Value:', input.value); // Debug: 更新隱藏輸入欄位的值

        // 移動到下一個問題，並將其高亮顯示
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

    // 將點擊事件綁定到每個選項上
    document.querySelectorAll('.point').forEach(point => {
        point.addEventListener('click', function () {
            const question = this.closest('.options-container').previousElementSibling.id;
            console.log('Option clicked for question:', question); // Debug: 選項點擊事件
            selectPoint(this, question);
        });
    });
};

    // 提交測驗函數
function submitTest() {
    // 禁用提交按鈕以防止重複點擊
    const submitButton = document.querySelector('button[onclick="submitTest()"]');
    submitButton.disabled = true;

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
    
    function getSommelierDescription(tasteScore, priceScore) {
    let tasteLevel = tasteScore > 4 ? '濃郁' : '清淡';
    let priceLevel = priceScore > 4 ? '容忍' : '敏感';

    if (tasteLevel === '濃郁' && priceLevel === '容忍') {
        return `職業：侍酒師（Sommelier）
        你熱愛挑選那些有濃烈香氣和多層次風味的酒，就像挑選濃郁的菜餚一樣。對你來說，一瓶能把舌頭味蕾掀起風暴的好酒是值得花費的，每一分錢都是為了那份絕妙的味覺體驗。選餐廳時，就像選葡萄酒一樣，只要味道夠震撼，帳單上多幾個零也無所謂。`;
    } else if (tasteLevel === '濃郁' && priceLevel === '敏感') {
        return `職業：侍酒師（Sommelier）
        你熱愛那些濃烈、多層次的酒，但在價格上仍然精打細算。就像在酒窖裡尋找既好喝又價格合理的酒一樣，選擇餐廳時也追求風味的豐富，但不願付出過高的代價。對你來說，找到那個性價比最高的選擇，才是真正的成就感。`;
    } else if (tasteLevel === '清淡' && priceLevel === '容忍') {
        return `職業：侍酒師（Sommelier）
        你偏愛那些保留自然風味的酒，少調味、少加工，讓葡萄的原始香氣得以保留。這種偏好同樣體現在餐廳選擇上，清淡、純粹的風味是你的追求，為了這種質感，即便花費高一些也覺得值得。就像精心挑選一瓶清新而優雅的好酒，為那份自然的質感甘願付出更多。`;
    } else {
        return `職業：侍酒師（Sommelier）
        你欣賞那些風味清新的酒，講究自然純粹，但同時不會忽略價格的合理性。選餐廳時也遵循同樣的標準，喜歡清淡、原味的料理，但不會為了這份清新而過度付出。就像挑選一瓶性價比高的葡萄酒，既要有著自然的質感，也要價格實惠，這就是你的選擇哲學。`;
    }
}

    function getOilTasterDescription(tasteScore, healthScore) {
    let tasteLevel = tasteScore > 4 ? '濃郁' : '清淡';
    let healthLevel = healthScore > 4 ? '關注' : '放縱';

    if (tasteLevel === '濃郁' && healthLevel === '關注') {
        return `職業：品油師（Oil Taster）
        你熱愛那些濃厚且有力的橄欖油香氣，就像挑選一款經過充分發酵的頂級油品一樣，對風味的追求不容妥協。選餐廳時，濃郁的口感和健康的營養價值都是重要考量。你要的不是單純的美味，而是一份既能撫慰味蕾，又能保持身體健康的佳餚。`;
    } else if (tasteLevel === '濃郁' && healthLevel === '放縱') {
        return `職業：品油師（Oil Taster）
        你對濃郁的橄欖油有著無限的熱愛，挑選時總是追求那種帶有厚重口感的油品。選餐廳時，偏愛那些味道豐富的食物，至於是否非常健康並不是你首要的考慮。只要味道濃烈、香氣撲鼻，偶爾放縱一下自己，也是一種享受生活的方式。`;
    } else if (tasteLevel === '清淡' && healthLevel === '關注') {
        return `職業：品油師（Oil Taster）
        你偏愛那些純淨、清新且富含健康益處的橄欖油，講究的是不加修飾的自然風味。選餐廳時也會同樣精挑細選，要求菜餚不僅保持食材的原味，而且健康有益。就像挑選一款最自然的橄欖油一樣，你追求的是每一口都能讓身體和味蕾同時感到滿足。`;
    } else {
        return `職業：品油師（Oil Taster）
        你對清新自然的風味情有獨鍾，但偶爾也願意拋開那些健康指標的束縛。選餐廳時，喜歡選擇那些調味簡單的料理，不過也不會刻意強求健康，只要吃得開心，稍微放縱一下也是生活的情趣所在。就像偶爾選擇一款不太注重脂肪含量的油品，讓味蕾隨心所欲。`;
    }
}

    function getBrewerDescription(tasteScore, locationScore) {
    let tasteLevel = tasteScore > 4 ? '濃郁' : '清淡';
    let locationLevel = locationScore > 4 ? '遠行' : '就近';

    if (tasteLevel === '濃郁' && locationLevel === '就近') {
        return `職業：釀酒師（Brewer）
        你熱愛那些醇厚而濃郁的酒，就像釀酒時挑選最飽滿的葡萄來確保風味一樣，濃烈的香氣是你對美味的追求。選擇餐廳時，除了食物的味道要夠豐富，你也希望地點方便，讓整個用餐過程更輕鬆愉快。畢竟，釀造的過程講究效率和品質，你也同樣希望用餐能做到兩者兼具。`;
    } else if (tasteLevel === '濃郁' && locationLevel === '遠行') {
        return `職業：釀酒師（Brewer）
        你偏愛濃郁的風味，對於那些酒體豐滿、層次豐富的釀酒過程有著無限的追求。選餐廳時，你願意花費更多時間和精力去尋找那些能夠滿足味蕾的地方，就像釀酒師願意遠赴他鄉尋找最合適的原料，只為釀出那瓶最具風味的佳釀。`;
    } else if (tasteLevel === '清淡' && locationLevel === '就近') {
        return `職業：釀酒師（Brewer）
        你喜歡那些清新、自然的風味，就像釀酒師挑選的葡萄只經過簡單釀造，保持最純粹的香氣。選擇餐廳時，你更傾向於方便到達的地方，不願意因為距離而折騰自己。對你來說，輕鬆的地點加上自然的風味，才是最符合生活哲學的選擇。`;
    } else {
        return `職業：釀酒師（Brewer）
        你對清淡、純粹的風味有著獨特的偏好，就像釀酒師追求那份自然、不加修飾的香氣一樣。選擇餐廳時，地點的遠近對你來說並不是障礙，只要那裡有你想要的清新風味，再遠也值得。就像釀酒師願意為了一瓶真正純正的酒走遍天涯，你也願意為了這份美味去探尋遠方。`;
    }
}

    function getJamMakerDescription(tasteScore, priceScore) {
    let tasteLevel = tasteScore > 4 ? '濃郁' : '清淡';
    let priceLevel = priceScore > 4 ? '容忍' : '敏感';

    if (tasteLevel === '濃郁' && priceLevel === '容忍') {
        return `職業：果醬製作師（Jam Maker）
        你偏愛那些香氣撲鼻的濃郁果醬，就像挑選成熟飽滿的水果來做成果醬一樣，濃厚的滋味讓人無法抗拒。對你來說，價格並不是太大的問題，只要能夠獲得這份濃烈的美味，願意多花一些錢也是值得的。選餐廳時，注重的是風味的豐富，為了這樣的美味，願意投入更多的資源。`;
    } else if (tasteLevel === '濃郁' && priceLevel === '敏感') {
        return `職業：果醬製作師（Jam Maker）
        你熱愛濃郁的果香，但也會精打細算地控制成本。就像製作果醬時會充分利用當季水果，確保香味濃郁但價格實惠一樣。選餐廳時，你偏愛那些味道豐富但價格親民的選擇，既不願意放棄濃郁的風味，也希望這一餐吃得物有所值。`;
    } else if (tasteLevel === '清淡' && priceLevel === '容忍') {
        return `職業：果醬製作師（Jam Maker）
        你喜愛保持水果原味的果醬，清淡且不過於甜膩，讓天然的滋味得以保留。對你來說，這份清新的感受是無價的，願意為了這樣的質感花費更多。選餐廳時，注重的也是那份清新自然的風味，願意支付高一點的價錢來享受這樣的美味，就像用最好的水果來釀製最純粹的果醬。`;
    } else {
        return `職業：果醬製作師（Jam Maker）
        你對果香的要求偏向清淡，喜歡那些少糖、保持原味的果醬，但同時也不願意為這樣的風味付出過高的代價。選餐廳時，更偏好那些能夠提供清淡料理且價格合理的地方。就像製作果醬時選擇性價比高的水果一樣，既要保持自然的味道，也要確保成本控制在合適的範圍內。`;
    }
}

    function getTeaMasterDescription(priceScore, healthScore) {
    let priceLevel = priceScore > 4 ? '容忍' : '敏感';
    let healthLevel = healthScore > 4 ? '關注' : '放縱';

    if (priceLevel === '容忍' && healthLevel === '關注') {
        return `職業：茶藝師（Tea Master）
        你像茶藝師挑選頂級茶葉一樣，願意為了健康和品質付出更多的代價。選餐廳時，注重的是菜餚的健康性和食材的高品質，哪怕價格稍高一些，也要確保每一口都對身體有益，就像茶藝師選擇最好的茶葉來為身心帶來益處一樣。`;
    } else if (priceLevel === '敏感' && healthLevel === '關注') {
        return `職業：茶藝師（Tea Master）
        你對健康飲食有著嚴格的要求，但在價格上也保持謹慎。就像茶藝師一樣，懂得如何用合理的成本來泡出最具益處的茶葉。選擇餐廳時，既希望食物對健康有益，也會注意不要超出預算，追求的是「健康又經濟」的平衡，就像沖泡一杯物美價廉的好茶一樣。`;
    } else if (priceLevel === '容忍' && healthLevel === '放縱') {
        return `職業：茶藝師（Tea Master）
        你追求茶的香氣和風味，偶爾也會偏向那些滋味濃郁但未必完全健康的選擇。選擇餐廳時，也會注重菜餚的味道，只要能讓味蕾感到滿足，價格稍高一些並不介意。就像茶藝師偶爾會選擇一些味道特別濃的茶葉來滿足自己一樣，生活中也需要這樣的放縱時刻。`;
    } else {
        return `職業：茶藝師（Tea Master）
        你偏愛風味豐富的茶，但在價格上仍然會精打細算。選擇餐廳時，也同樣追求美味的食物，但不會為了這些美味而超出預算，就像茶藝師知道如何用適當的成本來找到最滿足味蕾的茶一樣，追求的是既美味又不會對錢包造成太大負擔。`;
    }
}

    function getSpiceBlenderDescription(priceScore, locationScore) {
    let priceLevel = priceScore > 4 ? '容忍' : '敏感';
    let locationLevel = locationScore > 4 ? '遠行' : '就近';

    if (priceLevel === '容忍' && locationLevel === '就近') {
        return `職業：香料配方師（Spice Blender）
        你喜歡那些能帶來豐富風味的香料，對於方便的地點也有著偏好。就像香料配方師選擇那些最具風味且易於獲取的香料一樣，選擇餐廳時，更傾向於那些既好吃又位置方便的地方。只要味道夠好，價格稍高一些也沒關係，畢竟地點和風味的結合，讓整個體驗更加完美。`;
    } else if (priceLevel === '敏感' && locationLevel === '就近') {
        return `職業：香料配方師（Spice Blender）
        你偏好那些容易獲取的香料，但同時也會精打細算地控制成本。選餐廳時，地點的便利性和價格的合理性都是重要的考量，像香料配方師精選那些既有豐富香味又不過於昂貴的香料一樣，選擇餐廳也會考慮到位置的方便和經濟的花費。`;
    } else if (priceLevel === '容忍' && locationLevel === '遠行') {
        return `職業：香料配方師（Spice Blender）
        你熱愛那些帶有異國風情的香料，為了最好的風味，願意遠行去尋找那些獨特的材料。選擇餐廳時，地點的遠近對你來說不是問題，只要那裡的味道足夠吸引人，再遠的距離也願意去，就像香料配方師為了尋找獨特的香料，不惜走遍天涯。`;
    } else {
        return `職業：香料配方師（Spice Blender）
        你對香料的選擇既要求獨特的風味，也會注意成本的控制。選擇餐廳時，即使地點較遠，也願意前往，但前提是必須物有所值。就像香料配方師選擇香料時，不僅要考慮風味，還要確保這些香料的價格不至於過高，遠行尋找美味的同時，還要保持理智。`;
    }
}

    function getHoneySommelierDescription(tasteScore, healthScore) {
    let tasteLevel = tasteScore > 4 ? '濃郁' : '清淡';
    let healthLevel = healthScore > 4 ? '關注' : '放縱';

    if (tasteLevel === '濃郁' && healthLevel === '關注') {
        return `職業：蜂蜜品鑑師（Honey Sommelier）
        你熱愛那些味道豐富的蜂蜜，總是追求那種能讓香氣充盈口腔的感受。對於你來說，濃郁的風味和健康的益處同樣重要，選擇餐廳時，也會尋找那些既有豐富口感，又注重健康的料理。就像蜂蜜品鑑師挑選蜂蜜時，既要甜美醇厚，也要確保它有益於身體健康。`;
    } else if (tasteLevel === '濃郁' && healthLevel === '放縱') {
        return `職業：蜂蜜品鑑師（Honey Sommelier）
        你偏愛那些香甜濃郁的蜂蜜，對於風味的追求遠超過其他考量。選擇餐廳時，更加注重菜餚的味道，至於是否健康則放在次要位置。就像蜂蜜品鑑師偶爾會選擇最甜最香的蜂蜜，即使它含糖量較高，只要能讓味蕾得到最大的滿足，健康的考量可以暫時擱置。`;
    } else if (tasteLevel === '清淡' && healthLevel === '關注') {
        return `職業：蜂蜜品鑑師（Honey Sommelier）
        你偏愛那些淡雅的蜂蜜，喜歡它們純淨而不過度甜膩的特性，同時也非常在意它們的健康益處。選擇餐廳時，更傾向於那些保持食材原味且對身體有益的料理，就像蜂蜜品鑑師挑選那些質地輕盈、富含營養的蜂蜜一樣，追求自然健康的風味。`;
    } else {
        return `職業：蜂蜜品鑑師（Honey Sommelier）
        你對清淡的蜂蜜有著偏好，喜歡它們自然不過度的香甜感，但偶爾也會不那麼在意健康方面的嚴格要求。選擇餐廳時，更偏向於那些調味簡單的料理，健康標準並不是每次都那麼嚴苛。就像蜂蜜品鑑師偶爾也會隨心選擇一款香味淡雅的蜂蜜，只為滿足一時的愉悅感，而不過多考慮其他因素。`;
    }
}

    function getMycologistDescription(healthScore, priceScore) {
    let healthLevel = healthScore > 4 ? '關注' : '放縱';
    let priceLevel = priceScore > 4 ? '容忍' : '敏感';

    if (healthLevel === '關注' && priceLevel === '容忍') {
        return `職業：菌菇栽培專家（Mycologist）
        你注重菌菇的自然生長，喜歡那些無污染、營養豐富的菌菇，對健康有著極高的要求。選擇餐廳時，健康是最重要的考量，即使需要花費更多，你也願意為了這份安心而投入更多資金。就像菌菇栽培專家願意花費更多資源來保證菌菇的品質一樣，你相信健康是無價的。`;
    } else if (healthLevel === '關注' && priceLevel === '敏感') {
        return `職業：菌菇栽培專家（Mycologist）
        你對健康非常重視，但同時也會注意成本的控制。選擇餐廳時，希望能吃到對身體有益的健康餐點，但也不願意為此支付過高的價格。就像菌菇栽培專家精心控制菌菇的生長環境以達到性價比最佳一樣，你追求的是健康與價格之間的平衡。`;
    } else if (healthLevel === '放縱' && priceLevel === '容忍') {
        return `職業：菌菇栽培專家（Mycologist）
        你喜歡菌菇的味道，但在健康方面並不過於苛求，注重的是那份天然的美味。選擇餐廳時，更關心的是味道的豐富性，只要能滿足味蕾，即使價格高一些也無所謂。就像菌菇栽培專家偶爾會不那麼在意菌菇的成分而只是享受它的風味，你在選擇餐點時也更注重味覺的享受。`;
    } else {
        return `職業：菌菇栽培專家（Mycologist）
        你喜愛菌菇的鮮味，但在健康方面不太苛求，並且在價格上也會考慮是否實惠。選擇餐廳時，既要確保味道足夠美味，也希望價格合適，不願為了一時的味覺享受而付出過高的代價。就像菌菇栽培專家在保持風味的同時，也會盡量控制生長的成本一樣，你在追求美味時也保持理智。`;
    }
}

    function getSeaweedHarvesterDescription(healthScore, locationScore) {
    let healthLevel = healthScore > 4 ? '關注' : '放縱';
    let locationLevel = locationScore > 4 ? '遠行' : '就近';

    if (healthLevel === '關注' && locationLevel === '就近') {
        return `職業：海藻採集者（Seaweed Harvester）
        你像海藻採集者選擇水質純淨的海域一樣，對健康非常講究，選擇餐廳時希望能吃到對身體有益的健康料理。同時，也希望餐廳的位置能夠方便到達，避免不必要的舟車勞頓。對你來說，健康的菜餚和方便的地點相輔相成，就像採集新鮮海藻時選擇最容易靠近的地方一樣。`;
    } else if (healthLevel === '關注' && locationLevel === '遠行') {
        return `職業：海藻採集者（Seaweed Harvester）
        你對健康的飲食有著很高的要求，願意為了找到符合健康標準的食物而多走一些路。就像海藻採集者為了獲取最佳品質的海藻，願意深入遠離污染的海域一樣，選擇餐廳時，你不介意地點的遠近，只要能確保食物的健康和質量，再遠也在所不惜。`;
    } else if (healthLevel === '放縱' && locationLevel === '就近') {
        return `職業：海藻採集者（Seaweed Harvester）
        你對健康的標準並不苛求，更多時候追求的是方便和輕鬆的體驗。選擇餐廳時，希望能快速找到合適的地方，方便且不用太費心。就像海藻採集者偶爾也會選擇那些就近、易於採集的海藻，而不過多在意其營養成分一樣，你更傾向於簡單便捷的選擇。`;
    } else {
        return `職業：海藻採集者（Seaweed Harvester）
        你雖然不太關心飲食的健康指標，但卻願意為了特定的用餐體驗而去遠方尋找。就像海藻採集者會為了獲得特定風味的海藻而走遍各個角落一樣，選擇餐廳時，你願意走得更遠，只為了那份獨特的風味或用餐體驗，享受生活的隨性和冒險感。`;
    }
}

    function getQGraderDescription(tasteScore, locationScore) {
    let tasteLevel = tasteScore > 4 ? '濃郁' : '清淡';
    let locationLevel = locationScore > 4 ? '遠行' : '就近';

    if (tasteLevel === '濃郁' && locationLevel === '就近') {
        return `職業：咖啡品質鑑定師（Q Grader）
        你偏愛那些風味濃郁的咖啡，對於口感的豐富和香氣的厚重非常挑剔。選擇餐廳時，也偏向於那些能快速到達的地方，不希望為了美味而折騰太多。就像咖啡品質鑑定師一樣，既要求咖啡豆的風味濃烈，也希望供應穩定、方便取用，讓整體體驗更加簡單。`;
    } else if (tasteLevel === '濃郁' && locationLevel === '遠行') {
        return `職業：咖啡品質鑑定師（Q Grader）
        你熱愛濃郁的風味，對於那種讓人感覺層次豐富的香氣有著特殊的執著。選擇餐廳時，願意為了找到這樣的風味而多走幾步，就像咖啡品質鑑定師不怕奔赴不同產地，只為尋找那款最具特色的咖啡豆一樣，你不在乎地點的遠近，只在乎味道是否值得。`;
    } else if (tasteLevel === '清淡' && locationLevel === '就近') {
        return `職業：咖啡品質鑑定師（Q Grader）
        你對於咖啡的風味偏好清新自然，喜歡那些保留著原始風味、酸度適中的咖啡。選擇餐廳時，也偏好那些位置方便的地方，不願花太多時間在路上，輕鬆地享受清淡的美味是最符合你生活哲學的選擇，就像鑑定師挑選那些易於品味且不太重的咖啡豆一樣。`;
    } else {
        return `職業：咖啡品質鑑定師（Q Grader）
        你喜歡那種風味輕盈、口感清爽的咖啡，願意為了找到這樣的風味而走得更遠。就像咖啡品質鑑定師會不惜跋涉各地去尋找那款最純淨的咖啡豆一樣，對你來說，地點的遠近並不重要，最重要的是能找到符合自己口味的清新美味。`;
    }
}

function getTruffleHunterDescription(priceScore, locationScore) {
    let priceLevel = priceScore > 4 ? '容忍' : '敏感';
    let locationLevel = locationScore > 4 ? '遠行' : '就近';

    if (priceLevel === '容忍' && locationLevel === '就近') {
        return `職業：松露獵人（Truffle Hunter）
        你像松露獵人一樣，願意為了最佳的風味而付出更多，只要能確保找到最好的松露。選擇餐廳時，也不介意多花些錢，只要餐廳的位置方便，不用花太多時間在路上就能享受到滿意的美味，對你來說，便利和高品質的結合是最理想的選擇。`;
    } else if (priceLevel === '敏感' && locationLevel === '就近') {
        return `職業：松露獵人（Truffle Hunter）
        你對於價格有明確的控制，但也喜歡那些位置方便的選擇。就像松露獵人在離家近的地方發現高價值的松露一樣，選擇餐廳時，更偏好那些既實惠又易於到達的地方，確保整個體驗既輕鬆又符合預算。`;
    } else if (priceLevel === '容忍' && locationLevel === '遠行') {
        return `職業：松露獵人（Truffle Hunter）
        你願意花費更多，只要能找到真正值得的美味，就像松露獵人願意深入森林深處，只為挖掘那顆最珍貴的松露一樣。選擇餐廳時，地點的遠近不是阻礙，只要那裡的餐點足夠美味，願意遠行，只為了一次特別的用餐體驗。`;
    } else {
        return `職業：松露獵人（Truffle Hunter）
        你對價格敏感，但也願意花時間去找尋那些特別的餐廳。就像松露獵人會在遠處的森林中挖掘松露，但也會評估挖掘的成本和回報一樣，選擇餐廳時，你願意走得更遠，但前提是餐點必須物有所值，確保這次遠行值得這樣的付出。`;
    }
}
    
    function getNattoMakerDescription(healthScore, locationScore) {
    let healthLevel = healthScore > 4 ? '關注' : '放縱';
    let locationLevel = locationScore > 4 ? '遠行' : '就近';

    if (healthLevel === '關注' && locationLevel === '就近') {
        return `職業：納豆製作師（Natto Maker）
        你像納豆製作師一樣，對環境的選擇非常講究，確保納豆菌發酵的過程能保持最佳的活性，為健康帶來益處。選擇餐廳時，你希望既能方便地到達，又能享受到健康的餐點，讓每一口都對身體有益。就像製作納豆時對環境的嚴格要求一樣，你選擇餐廳時也注重健康和方便的雙重要求。`;
    } else if (healthLevel === '關注' && locationLevel === '遠行') {
        return `職業：納豆製作師（Natto Maker）
        你對健康飲食非常在意，願意花時間去尋找符合健康標準的餐廳，就像納豆製作師為了讓納豆菌發酵得更好，願意挑選最合適的環境一樣。選擇餐廳時，即使需要遠行，也在所不惜，只要能確保餐點的健康益處。`;
    } else if (healthLevel === '放縱' && locationLevel === '就近') {
        return `職業：納豆製作師（Natto Maker）
        你對於健康的要求比較隨和，更多是講求方便和輕鬆。選擇餐廳時，更希望能快速到達，不用為了健康指標而花費太多精力。就像納豆製作師偶爾會簡化發酵條件，只求效率和快速完成一批納豆一樣，你更傾向於選擇方便到達的餐廳，享受即刻的滿足感。`;
    } else {
        return `職業：納豆製作師（Natto Maker）
        你對健康方面的要求比較隨性，但卻不介意為了某種特殊體驗而遠行。就像納豆製作師願意為了試驗新的風味而在不同地點發酵納豆一樣，選擇餐廳時，你不介意花更多時間在路上，只要能找到那份獨特的風味和用餐體驗，遠行也無所謂。`;
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
    window.nextPage = nextPage;
    window.submitTest = submitTest;
};