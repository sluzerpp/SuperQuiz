class CustomModal {
  constructor(selector, callback) {
    this.modal = document.querySelector(selector);
    this.closeBtn = this.modal.querySelector('.modal__close');
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
    const btnClickHandler = () => {
      callback();
      this.closeModal();
    }
    this.closeBtn.addEventListener('click', btnClickHandler);
  }

  openModal() {
   this.modal.style.display = 'block';
   document.body.classList.add('modal__open');
  }

  closeModal() {
    this.modal.style.display = 'none';
    document.body.classList.remove('modal__open');
  }
}