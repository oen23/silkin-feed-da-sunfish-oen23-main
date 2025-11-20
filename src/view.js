export function createView(root) {
  const view = {
    root: root
  };

  // Рендерим начальное состояние
  root.innerHTML = `
    <div class="fish-face"></div>
    <div class="satiation"></div>
    <div class="controls">
      <button class="feed-button">Кормить</button>
    </div>
    <div class="message"></div>
  `;

  // Геттер для кнопки
  Object.defineProperty(view, 'feedButton', {
    get: function() {
      return this.root.querySelector('.feed-button');
    }
  });

  // Геттер для лица (нужен тестам контроллера)
  Object.defineProperty(view, 'face', {
    get: function() {
      return this.root.querySelector('.fish-face');
    }
  });

  view.setEmotion = function(emotion) {
    this.face.className = 'fish-face ' + emotion;
  };

  view.setSatiation = function(level) {
    const satiation = this.root.querySelector('.satiation');
    satiation.textContent = `Сытость: ${level}%`;
    satiation.dataset.value = level.toString();
  };

  view.setMessage = function(text) {
    this.root.querySelector('.message').textContent = text;
  };

  view.setDisabled = function(disabled) {
    this.feedButton.disabled = disabled;
    this.feedButton.textContent = disabled ? 'Кормится...' : 'Кормить';
  };

  return view;
}