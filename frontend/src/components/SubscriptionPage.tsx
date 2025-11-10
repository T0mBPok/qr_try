import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Crown, Zap, Star, CreditCard, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';

type NavigationFunction = (page: 'home' | 'auth' | 'dashboard' | 'create-qr' | 'link-setup' | 'editor' | 'subscription') => void;

interface SubscriptionPageProps {
  onNavigate: NavigationFunction;
}

const plans = [
  {
    id: 'free',
    name: 'Бесплатный',
    price: 0,
    period: 'навсегда',
    icon: Star,
    color: 'from-white/20 to-white/10',
    features: [
      'До 3 QR-кодов',
      'Базовая кастомизация',
      'Аналитика сканирований',
      'Стандартная поддержка',
      'Водяной знак на странице'
    ],
    limitations: [
      'Ограниченные стили',
      'Без приоритетной поддержки'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 499,
    period: 'в месяц',
    icon: Zap,
    color: 'from-[#7c6afa] to-[#c89afc]',
    popular: true,
    features: [
      'Неограниченное количество QR-кодов',
      'Полная кастомизация дизайна',
      'Расширенная аналитика',
      'Без водяных знаков',
      'Защита паролем',
      'Кастомные домены',
      'Приоритетная поддержка',
      'Экспорт данных'
    ],
    limitations: []
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 1999,
    period: 'в месяц',
    icon: Crown,
    color: 'from-[#c89afc] to-[#df5950]',
    features: [
      'Все возможности Pro',
      'API доступ',
      'Белая метка (white-label)',
      'Командные функции',
      'Персональный менеджер',
      'SLA гарантия',
      'Кастомные интеграции',
      'Обучение команды'
    ],
    limitations: []
  }
];

export default function SubscriptionPage({ onNavigate }: SubscriptionPageProps) {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showCheckout, setShowCheckout] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const selectedPlanData = plans.find(p => p.id === selectedPlan);
  const discount = billingPeriod === 'yearly' ? 0.2 : 0;
  const finalPrice = selectedPlanData 
    ? selectedPlanData.price * (1 - discount) * (billingPeriod === 'yearly' ? 12 : 1)
    : 0;

  const handleSubscribe = () => {
    if (selectedPlan === 'free') {
      onNavigate('dashboard');
    } else {
      setShowCheckout(true);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process the payment
    onNavigate('dashboard');
  };

  if (showCheckout && selectedPlan !== 'free') {
    return (
      <div className="min-h-screen bg-[#040404] py-12">
        <div className="max-w-[600px] mx-auto px-6">
          <button
            onClick={() => setShowCheckout(false)}
            className="text-white/70 hover:text-white transition-colors font-['Roboto'] flex items-center gap-2 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад к планам
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12"
          >
            <h1 className="font-['Roboto'] text-white mb-8">Оформление подписки</h1>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-[#7c6afa]/10 to-[#c89afc]/10 border border-[#7c6afa]/20 rounded-xl p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-['Roboto'] text-white mb-1">{selectedPlanData?.name}</h3>
                  <p className="font-['Roboto'] text-white/70">
                    {billingPeriod === 'monthly' ? 'Ежемесячная' : 'Годовая'} подписка
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-['Roboto'] text-white">
                    {finalPrice.toLocaleString('ru-RU')} ₽
                  </p>
                  {discount > 0 && (
                    <p className="font-['Roboto'] text-[#4caf50]">
                      Скидка {discount * 100}%
                    </p>
                  )}
                </div>
              </div>
              <Separator className="bg-white/10 my-4" />
              <div className="flex justify-between">
                <p className="font-['Roboto'] text-white">Итого:</p>
                <p className="font-['Roboto'] text-white">
                  {finalPrice.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="card-number" className="text-white/90 font-['Roboto']">
                  Номер карты
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    id="card-number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card-expiry" className="text-white/90 font-['Roboto']">
                    Срок действия
                  </Label>
                  <Input
                    id="card-expiry"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-cvc" className="text-white/90 font-['Roboto']">
                    CVC
                  </Label>
                  <Input
                    id="card-cvc"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="123"
                    maxLength={3}
                    type="password"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-name" className="text-white/90 font-['Roboto']">
                  Имя владельца карты
                </Label>
                <Input
                  id="card-name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="IVAN IVANOV"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                  required
                />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#4caf50] shrink-0 mt-0.5" />
                <p className="font-['Roboto'] text-white/70 leading-relaxed">
                  Ваши платежные данные защищены 256-битным SSL шифрованием.
                  Мы не храним данные вашей карты на наших серверах.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#7c6afa] to-[#c89afc] hover:opacity-90 transition-opacity font-['Roboto']"
              >
                Оплатить {finalPrice.toLocaleString('ru-RU')} ₽
              </Button>

              <p className="text-center text-white/50 font-['Roboto']">
                Нажимая "Оплатить", вы соглашаетесь с{' '}
                <span className="text-[#c89afc] hover:text-[#7c6afa] cursor-pointer">
                  условиями использования
                </span>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040404] py-12">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-white/70 hover:text-white transition-colors font-['Roboto'] flex items-center gap-2 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад в панель управления
          </button>
          <div className="text-center mb-8">
            <h1 className="font-['Roboto'] text-white mb-4">Выберите свой план</h1>
            <p className="font-['Roboto'] text-white/70 max-w-[600px] mx-auto">
              Создавайте неограниченное количество QR-кодов и управляйте своим цифровым присутствием
            </p>
          </div>

          {/* Billing Period Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 inline-flex">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-full font-['Roboto'] transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Ежемесячно
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-full font-['Roboto'] transition-all relative ${
                  billingPeriod === 'yearly'
                    ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Ежегодно
                <span className="absolute -top-2 -right-2 bg-[#4caf50] text-white px-2 py-0.5 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = plan.price * (1 - discount);
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7c6afa] to-[#c89afc] px-4 py-1 rounded-full">
                    <p className="font-['Roboto'] text-white">Популярный</p>
                  </div>
                )}
                <div
                  className={`h-full bg-white/5 backdrop-blur-xl border rounded-2xl p-8 transition-all cursor-pointer ${
                    selectedPlan === plan.id
                      ? 'border-[#7c6afa] scale-105 shadow-2xl shadow-[#7c6afa]/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h2 className="font-['Roboto'] text-white mb-2">{plan.name}</h2>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="font-['Roboto'] text-white">
                        {price.toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="font-['Roboto'] text-white/50">/ {plan.period}</span>
                    </div>
                    {billingPeriod === 'yearly' && plan.price > 0 && (
                      <p className="font-['Roboto'] text-[#4caf50] mt-1">
                        Экономия {(plan.price * 12 * discount).toLocaleString('ru-RU')} ₽/год
                      </p>
                    )}
                  </div>

                  <Separator className="bg-white/10 my-6" />

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#4caf50] shrink-0 mt-0.5" />
                        <span className="font-['Roboto'] text-white/90">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={handleSubscribe}
                    className={`w-full h-12 font-['Roboto'] ${
                      selectedPlan === plan.id
                        ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] hover:opacity-90'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {plan.id === 'free' ? 'Текущий план' : 'Выбрать план'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-['Roboto'] text-white text-center mb-8">Часто задаваемые вопросы</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Могу ли я изменить план в любое время?',
                a: 'Да, вы можете обновить или понизить свой план в любое время. Изменения вступят в силу немедленно.'
              },
              {
                q: 'Есть ли у вас возврат средств?',
                a: 'Мы предлагаем 14-дневную гарантию возврата денег для всех платных планов, если вы не удовлетворены сервисом.'
              },
              {
                q: 'Что произойдет с моими QR-кодами, если я отменю подписку?',
                a: 'Ваши QR-коды останутся активными, но некоторые функции будут ограничены в соответствии с бесплатным планом.'
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <h3 className="font-['Roboto'] text-white mb-2">{faq.q}</h3>
                <p className="font-['Roboto'] text-white/70 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
