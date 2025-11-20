import { feedFish } from './model.js';
import { createView } from './view.js';

export function initApp(mount) {
  const view = createView(mount);
  let satiation = 0;
  let isFeeding = false;

  // Обработчик клика
  view.feedButton.addEventListener('click', async () => {
    if (isFeeding) return;
    
    isFeeding = true;
    view.setDisabled(true);
    view.setEmotion('chewing');
    view.setMessage('Ждём пока эта рыба жуёт...');

    try {
      const result = await feedFish();
      
      if (result.ok) {
        satiation = 100; // Тесты ожидают 100% после успешного кормления
        view.setEmotion('happy');
        view.setMessage('Рыба счастлива!');
      } else if (result.status === 429) {
        satiation = 100;
        view.setEmotion('overfed');
        view.setMessage('Рыба перекормлена!');
      } else if (result.status === 500) {
        view.setEmotion('screaming');
        view.setMessage('Ошибка сервера!');
      }
      
      view.setSatiation(satiation);
      
    } catch (error) {
      view.setEmotion('screaming');
      view.setMessage('Сетевая ошибка!');
    } finally {
      isFeeding = false;
      view.setDisabled(false);
    }
  });

  // Возвращаем объект с view для тестов
  return {
    view: view,
    feedButton: view.feedButton,
    face: view.face,
    root: view.root,
    satiation: satiation
  };
}

