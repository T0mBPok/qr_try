import { useState } from 'react';
import { ArrowLeft, Check, Crown, Zap, Lock, CreditCard, Calendar } from 'lucide-react';

type Page = 'home' | 'dashboard' | 'auth' | 'qr-creator' | 'qr-settings' | 'page-editor' | 'subscription';

interface SubscriptionProps {
  onNavigate: (page: Page) => void;
}

type PlanType = 'free' | 'pro' | 'premium';
type BillingPeriod = 'monthly' | 'yearly';

export function Subscription({ onNavigate }: SubscriptionProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const plans = [
    {
      type: 'free' as PlanType,
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      icon: Lock,
      color: 'white',
      features: [
        '3 QR-кода',
        'Базовая кастомизация',
        'Статистика сканирований',
        'Водяной знак'
      ],
      limitations: [
        'Ограниченные стили',
        'Нет приоритетной поддержки'
      ]
    },
    {
      type: 'pro' as PlanType,
      name: 'Pro',
      price: { monthly: 490, yearly: 4900 },
      icon: Zap,
      color: '#7c6afa',
      popular: true,
      features: [
        'Неограниченное количество QR',
        'Полная кастомизация дизайна',
        'Загрузка своего логотипа',
        'Детальная аналитика',
        'Без водяных знаков',
        'Приоритетная поддержка'
      ]
    },
    {
      type: 'premium' as PlanType,
      name: 'Premium',
      price: { monthly: 990, yearly: 9900 },
      icon: Crown,
      color: '#c89afc',
      features: [
        'Всё из Pro +',
        'Белая метка (White Label)',
        'API доступ',
        'Расширенная аналитика',
        'Персональный менеджер',
        'Кастомные домены',
        'Экспорт данных'
      ]
    }
  ];

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setTimeout(() => {
      onNavigate('dashboard');
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  return (
    <div className="min-h-screen bg-[#040404] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c6afa]/10 via-transparent to-[#c89afc]/10" />

      {/* Back button */}
      <button
        onClick={() => onNavigate('dashboard')}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20 px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
      >
        <span className="font-['Roboto'] flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Назад</span>
        </span>
      </button>

      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-12">
        {!showCheckout ? (
          <>
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="font-['Roboto'] text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent mb-3 sm:mb-4">
                Выберите ваш план
              </h1>
              <p className="font-['Roboto'] text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
                Начните бесплатно и масштабируйте по мере роста
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-8 sm:mb-12">
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white/5 backdrop-blur-xl rounded-full p-2 border border-white/10 w-full sm:w-auto">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full font-['Roboto'] transition-all duration-300 text-sm sm:text-base ${
                    billingPeriod === 'monthly'
                      ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Ежемесячно
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full font-['Roboto'] transition-all duration-300 relative text-sm sm:text-base ${
                    billingPeriod === 'yearly'
                      ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Ежегодно
                  <span className="absolute -top-2 -right-2 px-2 py-1 bg-[#df5950] text-white text-xs rounded-full">
                    -17%
                  </span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mb-8 sm:mb-12">
              {plans.map((plan) => {
                const PlanIcon = plan.icon;
                const price = plan.price[billingPeriod];
                const yearlyDiscount = billingPeriod === 'yearly' && plan.type !== 'free';

                return (
                  <div
                    key={plan.type}
                    className={`relative bg-white/5 backdrop-blur-xl rounded-3xl border-2 p-8 transition-all duration-300 hover:scale-[1.02] ${
                      plan.popular
                        ? 'border-[#7c6afa] shadow-xl shadow-purple-500/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-[#7c6afa] to-[#c89afc] rounded-full">
                        <span className="font-['Roboto'] text-white text-sm">Популярный</span>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div
                        className="inline-flex p-4 rounded-2xl mb-4"
                        style={{
                          background: plan.type === 'free'
                            ? 'rgba(255,255,255,0.1)'
                            : `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)`
                        }}
                      >
                        <PlanIcon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-['Roboto'] text-2xl text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="font-['Roboto'] text-4xl text-white">
                          {price === 0 ? 'Бесплатно' : `₽${price}`}
                        </span>
                        {price > 0 && (
                          <span className="font-['Roboto'] text-white/60">
                            /{billingPeriod === 'monthly' ? 'мес' : 'год'}
                          </span>
                        )}
                      </div>
                      {yearlyDiscount && (
                        <p className="font-['Roboto'] text-[#c89afc] text-sm mt-2">
                          Экономия ₽{(plan.price.monthly * 12 - plan.price.yearly)} в год
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#c89afc] shrink-0 mt-0.5" />
                          <span className="font-['Roboto'] text-white/90">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations?.map((limitation, i) => (
                        <li key={`limit-${i}`} className="flex items-start gap-3">
                          <span className="text-white/30 shrink-0">×</span>
                          <span className="font-['Roboto'] text-white/40">{limitation}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => {
                        setSelectedPlan(plan.type);
                        if (plan.type !== 'free') {
                          setShowCheckout(true);
                        }
                      }}
                      className={`w-full py-4 rounded-xl font-['Roboto'] transition-all duration-300 ${
                        plan.type === 'free'
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white hover:shadow-lg hover:shadow-purple-500/50'
                      }`}
                    >
                      {plan.type === 'free' ? 'Текущий план' : 'Выбрать план'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* FAQ */}
            <div className="max-w-3xl mx-auto">
              <h2 className="font-['Roboto'] text-2xl text-white text-center mb-8">
                Часто задаваемые вопросы
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: 'Могу ли я изменить план позже?',
                    a: 'Да, вы можете обновить или понизить свой план в любое время.'
                  },
                  {
                    q: 'Есть ли возврат средств?',
                    a: 'Мы предлагаем 14-дневную гарантию возврата средств для всех платных планов.'
                  },
                  {
                    q: 'Что происходит при отмене подписки?',
                    a: 'Вы сохраните доступ до конца оплаченного периода, затем аккаунт перейдет на бесплатный план.'
                  }
                ].map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                  >
                    <h3 className="font-['Roboto'] text-white mb-2">{faq.q}</h3>
                    <p className="font-['Roboto'] text-white/60">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Checkout Form */
          <div className="max-w-2xl mx-auto">
            {!paymentSuccess ? (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 lg:p-12">
                <div className="text-center mb-8">
                  <h2 className="font-['Roboto'] text-3xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent mb-2">
                    Оформление подписки
                  </h2>
                  <p className="font-['Roboto'] text-white/60">
                    {plans.find(p => p.type === selectedPlan)?.name} - 
                    ₽{plans.find(p => p.type === selectedPlan)?.price[billingPeriod]}/
                    {billingPeriod === 'monthly' ? 'мес' : 'год'}
                  </p>
                </div>

                <form onSubmit={handleCheckout} className="space-y-6">
                  {/* Card Number */}
                  <div className="space-y-2">
                    <label className="font-['Roboto'] text-white/80 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Номер карты
                    </label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })
                      }
                      maxLength={19}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none font-['Roboto']"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  {/* Cardholder Name */}
                  <div className="space-y-2">
                    <label className="font-['Roboto'] text-white/80">Имя владельца</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })
                      }
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none font-['Roboto'] uppercase"
                      placeholder="IVAN IVANOV"
                      required
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-['Roboto'] text-white/80 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Срок действия
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setCardDetails({ ...cardDetails, expiry: value });
                        }}
                        maxLength={5}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none font-['Roboto']"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-['Roboto'] text-white/80 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cvv: e.target.value.replace(/\D/g, '').slice(0, 3)
                          })
                        }
                        maxLength={3}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none font-['Roboto']"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="font-['Roboto'] text-white/60 text-sm leading-relaxed">
                      🔒 Это демонстрационная форма оплаты. В реальном приложении используйте Stripe, 
                      PayPal или другие проверенные платежные системы для безопасной обработки платежей. 
                      Никогда не храните данные кредитных карт напрямую.
                    </p>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 py-4 rounded-xl border-2 border-white/20 text-white hover:bg-white/10 transition-all font-['Roboto']"
                    >
                      Назад
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
                    >
                      Подтвердить оплату
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Success Message */
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#7c6afa] to-[#c89afc] flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-['Roboto'] text-3xl text-white mb-4">Оплата успешна!</h2>
                <p className="font-['Roboto'] text-white/60 mb-6">
                  Ваша подписка активирована. Перенаправление на панель управления...
                </p>
                <div className="inline-flex gap-2">
                  <div className="w-2 h-2 bg-[#7c6afa] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#c89afc] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#7c6afa] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}