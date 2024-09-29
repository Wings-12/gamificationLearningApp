const emotionSlider = document.querySelector('.emotion-slider');
    const emotionValue = document.querySelector('.emotion-value');
    const keywords = document.querySelectorAll('.keyword');
    const questContainer = document.getElementById('quest-container');
    const submitButton = document.querySelector('.submit-button');
    const adventureLog = document.getElementById('adventure-log');
    const taskInput = document.getElementById('task-input');

    let currentEmotion = 3;

    emotionSlider.style.left = `${(currentEmotion - 1) * 20}%`;

    emotionSlider.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    emotionSlider.addEventListener('touchstart', startDragging);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDragging);

    let isDragging = false;

    function startDragging(e) {
      isDragging = true;
      drag(e);
    }

    function stopDragging() {
      isDragging = false;
    }

    function drag(e) {
      if (!isDragging) return;

      const rect = document.querySelector('.emotion-meter').getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

      emotionSlider.style.left = `${percentage}%`;
      currentEmotion = Math.round(percentage / 20) + 1;
      emotionValue.textContent = currentEmotion;

      updateOptimization();
    }

    keywords.forEach(keyword => {
      keyword.addEventListener('click', () => {
        keyword.classList.toggle('selected');
        updateOptimization();
      });
    });

    adventureLog.addEventListener('input', updateOptimization);
    taskInput.addEventListener('input', updateOptimization);

    function updateOptimization() {
      questContainer.innerHTML = '';

      const selectedKeywords = Array.from(keywords).filter(k => k.classList.contains('selected')).map(k => k.textContent);
      const logContent = adventureLog.value.toLowerCase();
      const task = taskInput.value.trim();

      if (task) {
        let difficulty = 'normal';
        let repetitions = 3;
        let duration = 15;

        if (currentEmotion <= 2 || selectedKeywords.includes('モチベ低下') || selectedKeywords.includes('疲労困憊')) {
          difficulty = 'easy';
          repetitions = 2;
          duration = 10;
        } else if (currentEmotion >= 4 || selectedKeywords.includes('集中力MAX') || selectedKeywords.includes('やる気満々')) {
          difficulty = 'hard';
          repetitions = 5;
          duration = 20;
        }

        createQuest(`${task}マスタークエスト`, `${task}のスキルを磨こう！`, [
          `${difficulty === 'easy' ? '簡単な' : difficulty === 'hard' ? '難しい' : ''}${task}を${repetitions}回繰り返そう`,
          `${duration}分間集中して${task}に取り組もう`,
          `${task}の後、学んだことを3つ書き出してみよう`
        ]);
      }

      if (currentEmotion <= 2 || selectedKeywords.includes('モチベ低下')) {
        createQuest('小さな達成クエスト', 'レベルアップへの第一歩！', [
          '簡単なタスクを1つ選んで完了させよう',
          '5分間だけ集中して取り組んでみよう',
          '今の気分を絵や言葉で表現してみよう'
        ]);
      }

      if (selectedKeywords.includes('ストレスMAX')) {
        createQuest('リラックス魔法', '短い休憩で力を取り戻そう！', [
          '深呼吸を10回してリラックスしよう',
          '好きな音楽を聴きながら、目を閉じて3分間休憩しよう',
          '外の景色を見ながら、見えるものを5つ書き出そう'
        ]);
      }

      if (questContainer.innerHTML === '') {
        createQuest('日常冒険モード', '新たな発見が待っている！', [
          '今日学んだことを3つ書き出してみよう',
          '明日の学習計画を立ててみよう',
          '難しかった問題を1つ復習しよう'
        ]);
      }
    }

    function createQuest(title, description, steps) {
      const questBox = document.createElement('div');
      questBox.className = 'quest-box';
      questBox.innerHTML = `
        <div class="quest-title">${title}</div>
        <div class="quest-description">${description}</div>
        <ul class="quest-steps">
          ${steps.map(step => `<li>${step}</li>`).join('')}
        </ul>
      `;
      questContainer.appendChild(questBox);
    }

    submitButton.addEventListener('click', () => {
      submitButton.classList.remove('pulse');
      void submitButton.offsetWidth; // Force reflow
      submitButton.classList.add('pulse');
      alert('冒険の準備が整いました！最適化されたクエストに挑戦しよう！');
    });

    // 初期状態での最適化提案を表示
    updateOptimization();