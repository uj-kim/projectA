import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { makePurchase } from '@/api/purchase';
import { pageRoutes } from '@/apiRoutes';

import { PHONE_PATTERN } from '@/constants';
import { Layout, authStatusType } from '@/pages/common/components/Layout';
import { ItemList } from '@/pages/purchase/components/ItemList';
import { Payment } from '@/pages/purchase/components/Payment';
import { ShippingInformationForm } from '@/pages/purchase/components/ShippingInformationForm';
import useAuthStore from '@/store/auth/authStore';
import useCartStore from '@/store/cart/useCartStore';

export const Purchase = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cart, resetCart } = useCartStore();

  const [formData, setFormData] = useState({
    name: user?.displayName ?? '',
    address: '',
    phone: '',
    requests: '',
    payment: 'accountTransfer',
  });

  const [errors, setErrors] = useState({
    phone: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { address, phone } = formData;
    const isPhoneValid = PHONE_PATTERN.test(phone);
    setIsFormValid(address.trim() !== '' && isPhoneValid);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'phone') {
      if (!PHONE_PATTERN.test(value) && value !== '') {
        setErrors((prev) => ({
          ...prev,
          phone: '-를 포함한 휴대폰 번호만 가능합니다',
        }));
      } else {
        setErrors((prev) => ({ ...prev, phone: '' }));
      }
    }
  };

  const handleClickPurchase = async (e) => {
    e.preventDefault();
    if (!isFormValid || !user) return;

    const purchaseData = {
      ...formData,
      totalAmount: 0,
      paymentMethod: formData.payment,
      shippingAddress: formData.address,
    };

    try {
      await makePurchase(purchaseData, user.uid, cart);
      resetCart(user.uid);
      console.log('구매 성공!');
      navigate(pageRoutes.main);
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          '잠시 문제가 발생했습니다! 다시 시도해 주세요.',
          err.message
        );
      } else {
        console.error('잠시 문제가 발생했습니다! 다시 시도해 주세요.');
      }
    }
  };

  return (
    <Layout
      containerClassName="pt-[30px]"
      authStatus={authStatusType.NEED_LOGIN}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <form onSubmit={handleClickPurchase}>
            <ShippingInformationForm
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
            />
            <ItemList />
            <Payment
              paymentMethod={formData.payment}
              onPaymentMethodChange={handleInputChange}
            />
            <div className="flex justify-end mt-6">
              <Button type="submit" size="lg" disabled={!isFormValid}>
                구매하기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};
