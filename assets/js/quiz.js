class Quiz {
  constructor(name, quizElem, questions) {
    this.name = name;
    this.initQuestions = questions;
    this.parseElems(quizElem);
    this.initQuiz();
    this.addListeners();
  }

  initQuiz() {
    this.questions = this.initQuestions.map((question) => {
      const result = {};
      result.title = question.title;
      result.emojiTItle = question.emojiTitle ? question.emojiTitle : '';
      result.order = question.order;
      result.type = question.type;
      result.description = question.description;
      result.isHasSelect = question.isHasSelect;
      result.selectData = question.selectData;
      if (question.type === 'RADIO') {
        result.answer = '';
        result.values = question.values;
      } else if (question.type === 'CHECKBOX') {
        result.answers = question.values.map((value) => ({
          value, isChecked: false,
        }));
      } else if (question.type === 'TEXT') {
        result.answer = '';
        if (question.isHasSelect) {
          result.like = '';
        }
      }
      return result;
    }).sort((a, b) => a - b);
    this.story = [this.questions[0].order];
    this.currentQuestion = this.questions[0].order;
    this.render();
  }

  addListeners() {
    this.quizElem.addEventListener('click', (e) => {
      const target = e.target;
      const parent = e.target.parentElement;
      let order = null;
      if (target.classList.contains('quiz__questions-item')) {
        order = Number(target.dataset.order);
      } else if (parent.classList.contains('quiz__questions-item')) {
        order = Number(parent.dataset.order);
      };
      if (!order) return;
      const question = this.questions.find((question) => question.order === order);
      this.setCurrentQuestion(question);
      this.render();
    });
    this.nextBtn.addEventListener('click', () => {
      const order = this.currentQuestion;
      if (order < this.questions.length) {
        this.setCurrentQuestion(this.questions[order])
        this.render();
      }
      if (order === this.questions.length) {
        this.contactModal.openModal();
      }
    });
    this.prevBtn.addEventListener('click', () => {
      const order = this.currentQuestion;
      if (order > 1) {
        this.setCurrentQuestion(this.questions[order - 2])
      }
      this.render();
    });
    this.contactNextBtn.addEventListener('click', () => {
      this.contactModal.closeModal();
      this.sendModal.openModal();
    });
    this.quizEndBtn.addEventListener('click', () => {
      this.initQuiz();
      this.sendModal.closeModal();
    })
  }

  parseElems(quizElem) {
    this.quizElem = quizElem;
    this.questionsElem = quizElem.querySelector('.quiz__questions');
    this.titleElem = quizElem.querySelector('.quiz__question > .title');
    this.textElem = quizElem.querySelector('.quiz__question > .text');
    this.controlsElem = quizElem.querySelector('.quiz__question-controls');
    this.prevBtn = quizElem.querySelector('.quiz__questions-btns > .prev'); 
    this.nextBtn = quizElem.querySelector('.quiz__questions-btns > .next');
    this.contactNextBtn = document.querySelector('#contact-next');
    this.quizEndBtn = document.querySelector('#quiz-end');
    this.contactModal = new CustomModal('#modal1', this.getResults.bind(this));
    this.sendModal = new CustomModal('#modal2', this.initQuiz.bind(this));
  }

  getResults() {
    const results = this.questions.map((question) => {
      const type = question.type;
      if (type === 'RADIO') {
        return {
          title: question.title,
          answer: question.answer,
          type,
        };
      } else if (type === 'CHECKBOX') {
        return {
          title: question.title,
          answer: question.answer,
          type,
        }
      } else if (type === 'TEXT') {
        if (question.isHasSelect) {
          return {
            title: question.title,
            answer: question.answer,
            like: question.like,
            type,
          }
        } else {
          return {
            title: question.title,
            answer: question.answer,
            type,
          }
        }
      }
    });
    console.log(results);
  }

  setCurrentQuestion(question) {
    this.currentQuestion = question.order;
    if (!this.story.includes(question.order)) {
      this.story.push(question.order);
    }
  }

  createQuestionBtn(question, isSelected) {
    const btn = document.createElement('div');
    btn.className = 
      'quiz__questions-item quiz__questions-item_without-text' + (isSelected ? ' quiz__questions-item_current' : '');
    const btnTitle = document.createElement('h4');
    btnTitle.className = 'text text_bold text_small';
    btnTitle.textContent = question.title;
    const btnText = document.createElement('p');
    btnText.className = 'text text_small';
    btnText.textContent = '';
    btn.append(btnTitle, btnText);
    btn.dataset.order = question.order;
    const changeBtnText = (text) => {
      if (text) {
        btnText.textContent = text;
        btn.classList.remove('quiz__questions-item_without-text');
      } else {
        btnText.textContent = '';
        btn.classList.add('quiz__questions-item_without-text');
      }
    };
    const changeSelect = (value) => {
      if (value) {
        btn.classList.add('quiz__questions-item_current');
      } else {
        btn.classList.remove('quiz__questions-item_current');
      }
    };
    return [btn, changeBtnText, changeSelect];
  }

  createCheckbox(value, callback) {
    const checkbox = document.createElement('label');
    checkbox.className = 'checkbox';
    const input = document.createElement('input');
    input.type = 'checkbox';
    const inner = document.createElement('span');
    inner.className = 'checkbox__inner';
    const span = document.createElement('span');
    span.className = 'checkbox__marker';
    inner.append(span, value.value);
    checkbox.append(input, inner);
    input.addEventListener('change', callback);
    return checkbox;
  }

  createRadio(value, name, callback) {
    const radio = document.createElement('label');
    radio.className = 'radio';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    const inner = document.createElement('span');
    inner.className = 'radio__inner';
    const span = document.createElement('span');
    span.className = 'radio__marker';
    inner.append(span, value);
    radio.append(input, inner);
    input.addEventListener('change', callback);
    return radio;
  }

  createInput(value, placeholder, callback) {
    const wrapper = document.createElement('div');
    wrapper.className = 'input input_width-700';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.placeholder = placeholder;
    input.addEventListener('input', callback);
    wrapper.appendChild(input);
    return wrapper;
  }

  createSelect(order, selectData) {
    const select = document.createElement('div');
    select.className = 'select';
    select.id = String(order);
    const selectBtn = document.createElement('button');
    selectBtn.className = 'select__btn';
    const selectOptions = document.createElement('div');
    selectOptions.className = 'select__options';
    select.append(selectBtn, selectOptions);
    const customSelect = new CustomSelect(select, selectData.values, selectData.defaultValue);
    return customSelect;
  }

  renderQuestionBtns() {
    const question = this.questions.find((quest) => quest.order === this.currentQuestion);
    this.questionsElem.innerHTML = '';
    if (!this.questionBtns || this.questionBtns.length !== this.story.length) {
      this.questionBtns = this.story.map((item) => {
        const data = this.questions.find((quest) => quest.order === item);
        return this.createQuestionBtn(data, question.order === data.order);
      });
    }
    this.story.forEach((item, id) => {
      const data = this.questions.find((quest) => quest.order === item);
      if (data.type === 'RADIO') {
        this.questionBtns[id][1](data.answer);
      } else if (data.type === 'CHECKBOX') {
        const checkedAnswers = data.answers.filter((ans) => ans.isChecked);
        this.questionBtns[id][1](checkedAnswers.map((ans) => ans.value).join(', ')); 
      } else if (data.type === 'TEXT') {
        let text = data.answer;
        this.questionBtns[id][1](text);
      }
    });
    this.story.forEach((item, id) => {
      this.questionBtns[id][2](question.order === item);
    });
    this.questionsElem.append(...this.questionBtns.map((item) => item[0]));
  }

  renderCurrentQuestion() {
    const question = this.questions.find((quest) => quest.order === this.currentQuestion);
    
    let emojiTitle = this.quizElem.querySelector('title_emoji');
    if (emojiTitle && question.emojiTitle) {
      emojiTitle.textContent = question.emojiTitle;
    } else if (emojiTitle) {
      emojiTitle.remove();
    } else if (question.emojiTItle) {
      emojiTitle = document.createElement('h3');
      emojiTitle.className = 'title title_emoji';
      emojiTitle.textContent = question.emojiTitle;
      this.titleElem.before(emojiTitle);
    }

    this.titleElem.textContent = question.title;
    this.textElem.textContent = question.description;
    const type = question.type;
    this.controlsElem.innerHTML = '';
    this.controlsElem.classList.remove('quiz__question-controls_column')
    if (!question.controls) {
      if (type === 'RADIO') {
        question.controls = question.values.map((value) => {
          const radio = this.createRadio(value, question.order, () => {
            question.answer = value;
            this.renderQuestionBtns();
          });
          return radio;
        });
        this.controlsElem.append(...question.controls)
      } else if (type === 'CHECKBOX') {
        question.controls = question.answers.map((value) => {
          const checkbox = this.createCheckbox(value, (e) => {
            const ans = question.answers.find((val) => val === value);
            ans.isChecked = e.target.checked;
            this.renderQuestionBtns();
          });
          return checkbox;
        });
        this.controlsElem.append(...question.controls)
      } else if (type === 'TEXT') {
        if (question.isHasSelect) {
          this.controlsElem.classList.add('quiz__question-controls_column');
          const input = this.createInput('', question.title, (e) => {
            question.answer = e.target.value;
            this.renderQuestionBtns();
          });
          const select = this.createSelect(question.order, question.selectData);
          question.controls = [input, select];
          this.controlsElem.append(input, select.select);
        } else {
          question.controls = this.createInput('', question.title, (e) => {
            question.answer = e.target.value;
            this.renderQuestionBtns();
          });
          this.controlsElem.appendChild(question.controls)
        }
      }
    }
    
    if (type === 'RADIO' || type === 'CHECKBOX') {
      this.controlsElem.append(...question.controls);
    } else if (type === 'TEXT') {
      if (question.isHasSelect) {
        this.controlsElem.classList.add('quiz__question-controls_column');
        this.controlsElem.append(question.controls[0], question.controls[1].select);
      } else {
        this.controlsElem.appendChild(question.controls)
      }
    }

    if (question.order > 1) {
      this.prevBtn.classList.remove('btn_hidden');
    } else {
      this.prevBtn.classList.add('btn_hidden');
    }

    if (question.order <= this.questions.length) {
      this.nextBtn.classList.remove('btn_hidden');
    } else {
      this.nextBtn.classList.add('btn_hidden');
    }
  }

  render() {
    this.renderCurrentQuestion();
    this.renderQuestionBtns();
  }
}

const firstQuestion = {
  order: 1,
  title: 'Какие виды тестов вам нравятся?',
  description: 'Многие из нас хоть раз попадались на эту удочку — хочешь пройти всего один тест из интернета, и вдруг понимаешь, что пролетело полдня.',
  type: 'RADIO', // RADIO | CHECKBOX | TEXT
  values: [
    'На темперамент',
    'Кто я из вселенной Марвел',
    'Увидел это',
    'Моё тотемное животное',
    'На IQ',
    'На словарный запас',
    'На логическое мышление',
    'На уровень интеллекта'
  ],
}
const secondQuestion = {
  order: 2,
  title: 'Вы любите проходить тесты?',
  description: 'Нам важно узнать насолько часто Вы проходите тесты.',
  type: 'CHECKBOX', // RADIO | CHECKBOX | TEXT
  values: [
    'На темперамент',
    'Кто я из вселенной Марвел',
    'Увидел это',
    'Моё тотемное животное',
    'На IQ',
    'На словарный запас',
    'На логическое мышление',
    'На уровень интеллекта'
  ],
}
const thirdQuestion = {
  order: 3,
  title: 'Вы любите проходить тесты?',
  description: 'Многие из нас хоть раз попадались на эту удочку — хочешь пройти всего один тест из интернета, и вдруг понимаешь, что пролетело полдня.',
  type: 'TEXT', // RADIO | CHECKBOX | TEXT
}

const finalQuestion = {
  order: 4,
  emojiTitle: '😉👍',
  title: 'Спасибо за ответы! Заполните форму ниже',
  description: 'Ваше мнение важно для нас. Прикрепите фото с Вашей любимой картинкой и оставьте комментарий насколько понравился Вам тест.',
  type: 'TEXT',
  placeholder: 'Ваше мнение сюда',
  isHasSelect: true, // ONLY FOR TEXT TYPE
  selectData: {
    defaultValue: 2,
    values: [
      { text: 'Очень понравился', value: 2 },
      { text: 'Не понравился', value: 1 },
      { text: 'Пройду ещё раз', value: 3 },
      { text: 'Посоветую пройти всем', value: 4 },
    ]
  }
}

const quizElem = document.querySelector('.quiz');
const quiz = new Quiz('Проверка', quizElem, [firstQuestion, secondQuestion, thirdQuestion, finalQuestion])