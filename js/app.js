(function () {
  'use strict';

  const TITLES = {
    numerical: 'Numerical reasoning',
    verbal: 'Verbal reasoning',
    logical: 'Logical reasoning',
    figure: 'Figure reasoning'
  };

  const viewHome = document.getElementById('view-home');
  const viewRevision = document.getElementById('view-revision');
  const revisionTitle = document.getElementById('revision-title');
  const revisionProgress = document.getElementById('revision-progress');
  const revisionScore = document.getElementById('revision-score');
  const questionText = document.getElementById('question-text');
  const optionsList = document.getElementById('options-list');
  const feedback = document.getElementById('feedback');
  const btnNext = document.getElementById('btn-next');
  const btnCheck = document.getElementById('btn-check');
  const questionCard = document.querySelector('.question-card');
  const revisionComplete = document.getElementById('revision-complete');
  const finalScoreText = document.getElementById('final-score-text');

  let currentCategory = null;
  let questions = [];
  let currentIndex = 0;
  let selectedOptionIndex = null;
  let correctCount = 0;
  let answeredCount = 0;

  function showView(viewId) {
    viewHome.classList.toggle('view-active', viewId === 'home');
    viewRevision.classList.toggle('view-active', viewId === 'revision');
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-view') === (viewId === 'home' ? 'home' : currentCategory));
    });
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function startRevision(category) {
    let categoryData = [];
    try {
      const response = await fetch(`data/${category}.json`);
      if (!response.ok) throw new Error('Failed to load questions');
      categoryData = await response.json();
    } catch (err) {
      console.error(err);
      alert('Error loading questions for ' + category);
      return;
    }

    if (!categoryData || !categoryData.length) return;
    currentCategory = category;
    questions = shuffleArray(categoryData);
    currentIndex = 0;
    correctCount = 0;
    answeredCount = 0;
    revisionTitle.textContent = TITLES[category] || category;
    questionCard.hidden = false;
    revisionComplete.hidden = true;
    showView('revision');
    renderQuestion();
  }

  function renderQuestion() {
    const q = questions[currentIndex];
    if (!q) {
      finishRevision();
      return;
    }
    selectedOptionIndex = null;

    questionText.innerHTML = ''; // Clear previous content

    // Display sequence images if present
    if (q.sequenceImages && q.sequenceImages.length > 0) {
      const sequenceContainer = document.createElement('div');
      sequenceContainer.classList.add('sequence-container');
      q.sequenceImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Sequence figure';
        img.classList.add('sequence-image');
        sequenceContainer.appendChild(img);
      });
      questionText.appendChild(sequenceContainer); // Add sequence above question text
    }

    // Display main question image or text
    if (q.imageUrl) {
      const img = document.createElement('img');
      img.src = q.imageUrl;
      img.alt = q.question;
      img.classList.add('question-image');
      questionText.appendChild(img);
    } else {
      const p = document.createElement('p'); // Wrap text in a p tag for consistency
      p.textContent = q.question;
      questionText.appendChild(p);
    }
    
    optionsList.innerHTML = '';
    q.options.forEach(function (opt, i) {
      const label = document.createElement('label');
      label.className = 'option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'option';
      input.value = i;
      input.addEventListener('change', function () {
        selectedOptionIndex = i;
        btnCheck.disabled = false;
      });
      
      const span = document.createElement('span');
      span.className = 'option-content'; // New class for text/image wrapper
      if (q.optionImages && q.optionImages[i]) {
        const img = document.createElement('img');
        img.src = q.optionImages[i];
        img.alt = opt;
        img.classList.add('option-image');
        span.appendChild(img);
      } else {
        span.textContent = opt;
      }

      label.appendChild(input);
      label.appendChild(span);
      optionsList.appendChild(label);
    });

    feedback.textContent = '';
    feedback.className = 'feedback';
    btnCheck.disabled = true;
    btnCheck.textContent = 'Check answer';
    btnNext.disabled = true;
    revisionProgress.textContent = 'Question ' + (currentIndex + 1) + ' of ' + questions.length;
    revisionScore.textContent = 'Score: ' + correctCount + ' / ' + answeredCount;
  }

  function showResult(correct) {
    if (correct) correctCount++;
    answeredCount++;
    revisionScore.textContent = 'Score: ' + correctCount + ' / ' + answeredCount;
    const explanation = questions[currentIndex].explanation || '';
    feedback.textContent = (correct ? 'Correct!' : 'Incorrect.') + (explanation ? ' ' + explanation : '');
    feedback.className = 'feedback ' + (correct ? 'feedback-correct' : 'feedback-incorrect');
    document.querySelectorAll('.option').forEach(function (label, i) {
      label.classList.add('disabled');
      const input = label.querySelector('input');
      input.disabled = true;
      if (i === questions[currentIndex].correctIndex) label.classList.add('correct');
      else if (i === selectedOptionIndex && !correct) label.classList.add('incorrect');
    });
    btnCheck.disabled = true;
    btnNext.disabled = false;
    btnCheck.textContent = 'Checked';
  }

  function nextQuestion() {
    currentIndex++;
    if (currentIndex >= questions.length) {
      finishRevision();
      return;
    }
    renderQuestion();
  }

  function finishRevision() {
    questionCard.hidden = true;
    revisionComplete.hidden = false;
    finalScoreText.textContent = 'You scored ' + correctCount + ' out of ' + questions.length + '.';
  }

  function handleCheck() {
    if (selectedOptionIndex === null) return;
    const correct = selectedOptionIndex === questions[currentIndex].correctIndex;
    showResult(correct);
  }

  document.querySelectorAll('[data-view]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      const view = el.getAttribute('data-view');
      if (view === 'home') {
        e.preventDefault();
        showView('home');
      } else if (view === 'numerical' || view === 'verbal' || view === 'logical' || view === 'figure') {
        e.preventDefault();
        startRevision(view);
      }
    });
  });

  btnCheck.addEventListener('click', handleCheck);
  btnNext.addEventListener('click', nextQuestion);
})();
