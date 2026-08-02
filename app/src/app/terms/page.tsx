"use client";
import { useSettings } from "@/lib/settings-context";

export default function TermsPage() {
  const { settings } = useSettings();
  const minOrder = settings.minOrder.toLocaleString("ru");

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-16">
      <h1 className="font-brand text-4xl font-bold text-primary-900 mb-8">Условия работы</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-neutral-700">
        <p>
          Данные Условия работы регулируют взаимоотношения между компанией Orchidea и её клиентами при заключении и исполнении договоров купли-продажи товаров.
        </p>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">1. Общие положения</h2>
          <p>
            Orchidea является оптовым поставщиком искусственных цветов и флористических материалов. Минимальный размер заказа составляет {minOrder} рублей. Компания работает в розницу только при условии соответствия минимальному заказу.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">2. Условия заказа</h2>
          <ul className="list-disc list-inside space-y-2 mt-3 text-neutral-700">
            <li>Заказ оформляется через сайт или путём обращения к менеджеру</li>
            <li>Минимальный размер первого заказа — {minOrder} рублей</li>
            <li>Количество товара кратно упаковочным единицам, указанным в каталоге</li>
            <li>Заказ считается подтвержденным после согласия обеих сторон</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">3. Сроки отгрузки</h2>
          <ul className="list-disc list-inside space-y-2 mt-3 text-neutral-700">
            <li>Стандартные заказы отгружаются в течение 1-3 рабочих дней</li>
            <li>Срочные заказы возможны по согласованию с менеджером</li>
            <li>Отгрузка осуществляется в рабочие дни с 09:00 до 17:00</li>
            <li>Нерабочие дни и праздники указаны в календаре на сайте</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">4. Оплата</h2>
          <ul className="list-disc list-inside space-y-2 mt-3 text-neutral-700">
            <li>Оплата производится после согласования заказа</li>
            <li>Доступны безналичные расчеты и оплата через интернет-магазин</li>
            <li>Для юридических лиц предусмотрены банковские переводы</li>
            <li>Счёт выставляется в течение 2 часов после оформления</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">5. Доставка</h2>
          <ul className="list-disc list-inside space-y-2 mt-3 text-neutral-700">
            <li>Зона доставки — Волгоградская область</li>
            <li>Стоимость доставки по договорённости — рассчитывается в зависимости от расстояния, объёма заказа и т.д.</li>
            <li>Возможен самовывоз со склада бесплатно</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">6. Качество товара</h2>
          <p>
            Всё товары поставляются в надлежащем качестве. Претензии по качеству принимаются в течение 24 часов после получения товара. Все претензии рассматриваются в соответствии с действующим законодательством.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">7. Возврат и обмен</h2>
          <ul className="list-disc list-inside space-y-2 mt-3 text-neutral-700">
            <li>Возврат товада возможен в течение 14 дней при условии его неповреждённости</li>
            <li>Товар должен находиться в оригинальной упаковке</li>
            <li>Возврат денежных средств осуществляется после проверки товара</li>
            <li>Обмен возможен на аналогичный или другой товар по цене не выше</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">8. Ответственность сторон</h2>
          <p>
            Компания не несет ответственности за повреждения товара, возникшие в результате неправильного хранения или использования клиентом. Клиент несет ответственность за своевременную оплату и соблюдение условий заказа.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">9. Разрешение споров</h2>
          <p>
            Все споры разрешаются путём переговоров. В случае невозможности достичь согласия, споры рассматриваются в соответствии с законодательством Российской Федерации в судах по месту нахождения компании.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">10. Контакты</h2>
          <div className="mt-3 bg-neutral-50 p-4 rounded-lg">
            <p><strong>Email:</strong> <a href="mailto:orchidea_opt@mail.ru" className="hover:text-primary-600 transition-colors">orchidea_opt@mail.ru</a></p>
            <p><strong>Телефон:</strong> +7 903 374-31-37</p>
            <p><strong>Режим работы:</strong> ежедневно 8:00–17:00 (вс — выходной)</p>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mt-8">
          Последнее обновление: 2025
        </p>
      </div>
    </div>
  );
}
