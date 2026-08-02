export default function DeliveryPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-sage-500 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(26,36,32,0.45), rgba(26,36,32,0.45)), url(/images/hero-bg.png)" }}>
        <div className="max-w-[1320px] mx-auto px-6 py-8 md:py-10">
          <div className="text-white/60 text-sm mb-2">
            Главная <span className="mx-1">›</span> Доставка
          </div>
          <h1 className="font-brand text-3xl md:text-4xl font-bold text-white mb-2">Доставка и логистика</h1>
          <p className="text-white/80 max-w-2xl">
            Быстрая и надежная доставка товаров по Волгоградской области. Отгрузка от 1 дня.
          </p>
        </div>
      </section>

      {/* Delivery info */}
      <section className="max-w-[1320px] mx-auto px-6 py-10 md:py-16">
        <div className="grid md:grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-16">
          <div className="bg-primary-50 rounded-2xl p-6 md:p-8 border-2 border-dashed border-neutral-500">
            <div className="text-4xl text-primary-500 mb-4">⚡</div>
            <h3 className="font-semibold text-lg text-primary-900 mb-3">Быстрая отгрузка</h3>
            <p className="text-neutral-600 text-sm">
              Отгрузим ваш заказ от 1 дня с момента поступления. Срочные заказы возможны по согласованию.
            </p>
          </div>
          <div className="bg-primary-50 rounded-2xl p-6 md:p-8 border-2 border-dashed border-neutral-500">
            <div className="text-4xl text-primary-500 mb-4">🚚</div>
            <h3 className="font-semibold text-lg text-primary-900 mb-3">Доставка</h3>
            <p className="text-neutral-600 text-sm">
              Доставляем по Волгоградской области. Возможна самовывоз со склада в Волгограде.
            </p>
          </div>
          <div className="bg-primary-50 rounded-2xl p-6 md:p-8 border-2 border-dashed border-neutral-500">
            <div className="text-4xl text-primary-500 mb-4">📦</div>
            <h3 className="font-semibold text-lg text-primary-900 mb-3">Упаковка</h3>
            <p className="text-neutral-600 text-sm">
              Тщательно упаковываем товар для безопасной доставки. Используем защитные материалы.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <h2 className="font-brand text-2xl md:text-3xl font-bold text-primary-900 mb-4 md:mb-6">Зона доставки</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-primary-500 font-bold text-xl">✓</span>
                <div>
                  <div className="font-semibold text-primary-900">Волгоград и область</div>
                  <div className="text-sm text-neutral-600">Доставка в течение 1-2 рабочих дней</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary-500 font-bold text-xl">✓</span>
                <div>
                  <div className="font-semibold text-primary-900">По стране</div>
                  <div className="text-sm text-neutral-600">Доставка в течение 2-5 рабочих дней в зависимости от расстояния</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary-500 font-bold text-xl">✓</span>
                <div>
                  <div className="font-semibold text-primary-900">Самовывоз</div>
                  <div className="text-sm text-neutral-600">Со склада в Волгограде по согласованному времени</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-brand text-2xl md:text-3xl font-bold text-primary-900 mb-4 md:mb-6">Стоимость доставки</h2>
            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-xl p-4 border-2 border-dashed border-neutral-500">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-primary-900">Волгоград и область</div>
                </div>
                <div className="text-2xl font-bold text-primary-600">По договорённости</div>
                <div className="text-xs text-neutral-600 mt-2">Стоимость зависит от расстояния, объёма заказа и т.д. — уточняется у менеджера</div>
              </div>

              <div className="bg-neutral-50 rounded-xl p-4 border-2 border-dashed border-neutral-500">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-primary-900">По стране</div>
                </div>
                <div className="text-2xl font-bold text-primary-600">По договорённости</div>
                <div className="text-xs text-neutral-600 mt-2">Стоимость зависит от расстояния, объёма заказа и т.д. — уточняется у менеджера</div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border-2 border-dashed border-emerald-400">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-emerald-900">Самовывоз</div>
                </div>
                <div className="text-2xl font-bold text-emerald-600">Бесплатно</div>
                <div className="text-xs text-emerald-700 mt-2">Адрес склада предоставляется после оформления заказа</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ordering process */}
      <section className="bg-neutral-50 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply pointer-events-none"
          style={{ backgroundImage: "url(/images/paper-texture.jpg)" }}
        />
        <div className="max-w-[1320px] mx-auto px-6 py-10 md:py-16 relative">
          <h2 className="font-brand text-2xl md:text-3xl font-bold text-primary-900 mb-8 md:mb-12 text-center">Процесс заказа и доставки</h2>
          <div className="grid md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-neutral-500">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">1</div>
              <h3 className="font-semibold text-primary-900 mb-3">Оформление заказа</h3>
              <p className="text-sm text-neutral-600">Выберите товары в каталоге, добавьте в корзину и оформите заказ</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-neutral-500">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">2</div>
              <h3 className="font-semibold text-primary-900 mb-3">Подтверждение</h3>
              <p className="text-sm text-neutral-600">Наш менеджер свяжется с вами для уточнения деталей и способа доставки</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-neutral-500">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">3</div>
              <h3 className="font-semibold text-primary-900 mb-3">Отгрузка</h3>
              <p className="text-sm text-neutral-600">Товар будет отгружен от 1 дня после подтверждения и оплаты</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-neutral-500">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">4</div>
              <h3 className="font-semibold text-primary-900 mb-3">Доставка</h3>
              <p className="text-sm text-neutral-600">Получите товар и проверьте его целостность и комплектность</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
