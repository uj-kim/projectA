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
import useCartStore from '../../store/cart/useCartStore';
import { useAuthStore } from '../../store/auth/useAuth';
import { useMutation } from '@tanstack/react-query';

export const Purchase = () => {
  const navigate = useNavigate();
  const { cart, resetCart } = useCartStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.displayName ?? '',
    address: '',
    phone: '',
    requests: '',
    payment: 'accountTransfer',
  });

  const [errors, setErrors] = useState({
    phone: '',
    server: '', //서버에러
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

    handlePurchase(purchaseData);
  };

  const { mutate: handlePurchase, isLoading } = useMutation({
    mutationFn: async (purchaseData) => {
      if (!user) throw new Error('로그인이 필요합니다.');
      await makePurchase(purchaseData, user.uid, cart);
    },
    onSuccess: () => {
      if (user) {
        resetCart(user.uid); // Zustand로 장바구니 초기화
      }
      console.log('구매 성공!');
      navigate(pageRoutes.main); // 메인 페이지로 이동
    },
    onError: (error) => {
      console.error(
        '구매 처리 중 문제가 발생했습니다:',
        error instanceof Error ? error.message : '알 수 없는 오류'
      );
      setErrors((prev) => ({
        ...prev,
        server: '구매 처리 중 문제가 발생했습니다. 다시 시도해주세요.',
      }));
    },
  });

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
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  '구매하기'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};
