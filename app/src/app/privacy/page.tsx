export default function PrivacyPage() {
  return (
    <div className="max-w-[1320px] mx-auto px-6 py-16">
      <h1 className="font-brand text-3xl md:text-4xl font-bold text-primary-900 mb-8 break-words">Политика конфиденциальности</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-neutral-700">
        <p>
          Компания Orchidea (далее — «Компания») уважает и защищает персональные данные своих пользователей. Данная политика конфиденциальности объясняет, как мы собираем, используем, раскрываем и иным образом обрабатываем информацию в соответствии с действующим законодательством.
        </p>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">1. Собираемая информация</h2>
          <p>Мы собираем следующие типы информации:</p>
          <ul className="list-disc list-inside space-y-2 mt-3 text-neutral-700">
            <li>Контактная информация: имя, номер телефона, адрес электронной почты</li>
            <li>Информация о компании: наименование, ИНН, адрес</li>
            <li>История покупок и предпочтения товаров</li>
            <li>Технические данные: IP-адрес, тип браузера, посещаемые страницы</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">2. Использование информации</h2>
          <p>Мы используем собираемую информацию для:</p>
          <ul className="list-disc list-inside space-y-2 mt-3 text-neutral-700">
            <li>Обработки заказов и доставки товаров</li>
            <li>Связи с вами по вопросам заказов</li>
            <li>Улучшения качества услуг</li>
            <li>Отправки актуальной информации о товарах и акциях</li>
            <li>Соблюдения требований законодательства</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">3. Защита данных</h2>
          <p>
            Компания принимает необходимые меры для защиты персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения. Мы используем шифрование SSL и другие современные методы защиты информации.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">4. Раскрытие информации</h2>
          <p>
            Мы не передаем персональные данные третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством, или когда это необходимо для обеспечения деятельности (например, курьерским службам для доставки).
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">5. Ваши права</h2>
          <p>Вы имеете право:</p>
          <ul className="list-disc list-inside space-y-2 mt-3 text-neutral-700">
            <li>Запросить информацию о собираемых о вас данных</li>
            <li>Исправить неточные данные</li>
            <li>Попросить удаление ваших данных</li>
            <li>Отказаться от получения маркетинговых сообщений</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">6. Связь с нами</h2>
          <p>
            Если у вас есть вопросы о данной политике конфиденциальности, свяжитесь с нами:
          </p>
          <div className="mt-3 bg-neutral-50 p-4 rounded-lg">
            <p>Email: <a href="mailto:orchidea_opt@mail.ru" className="hover:text-primary-600 transition-colors">orchidea_opt@mail.ru</a></p>
            <p>Телефон: +7 903 374-31-37</p>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mt-8">
          Последнее обновление: 2025
        </p>
      </div>
    </div>
  );
}
