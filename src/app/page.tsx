"use client";
import Badge from "@/components/Badge/Badge";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import ButtonSecondary from "@/components/Button/ButtonSecondary";
import Input from "@/components/Input/Input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CoinForm {
  coinName: string;
  coinCount: number;
  coinPrice: number;
}

interface CoinHistory {
  [x: string]: {
    history: Pick<CoinForm, "coinCount" | "coinPrice">[];
    totalCoinCount: number;
    totalCoinPrice: number;
    evaluation: string;
  };
}
export default function Home() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CoinForm>();

  const [coinHistory, setCoinHistory] = useState<CoinHistory>({});
  useEffect(() => {
    const coinHistory = localStorage.getItem("coinHistory");
    if (!!coinHistory) {
      setCoinHistory(JSON.parse(coinHistory));
    }
  });

  const onSubmit = (validForm: CoinForm) => {
    const { coinName, coinCount, coinPrice } = validForm;
    let totalCoinCount = +coinCount;
    let totalCoinPrice = +totalCoinCount * coinPrice;
    if (!!coinHistory && coinHistory.hasOwnProperty(coinName)) {
      totalCoinCount += +coinHistory[coinName].totalCoinCount;
      totalCoinPrice += +coinHistory[coinName].totalCoinPrice;
    }
    console.log(coinHistory, totalCoinCount, totalCoinPrice);
    const evaluation = (totalCoinPrice / totalCoinCount).toFixed(5);
    setCoinHistory((prev: CoinHistory) => {
      let resultHistory: CoinHistory = {};
      if (!prev.hasOwnProperty(coinName)) {
        resultHistory[coinName] = {
          history: [{ coinCount, coinPrice }],
          totalCoinCount,
          totalCoinPrice,
          evaluation,
        };
      } else {
        resultHistory[coinName] = {
          history: [...prev[coinName].history, { coinCount, coinPrice }],
          totalCoinCount,
          totalCoinPrice,
          evaluation,
        };
      }
      const returnObj = {
        ...prev,
        ...resultHistory,
      };
      localStorage.setItem("coinHistory", JSON.stringify(returnObj));
      return returnObj;
    });
  };

  const onClickRest = () => {
    if (localStorage.getItem("coinHistory")) {
      localStorage.removeItem("coinHistory");
    }
    setCoinHistory({});
    reset();
  };
  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
        <div className="container space-y-3 rounded-3xl bg-white/40 px-4 py-2 shadow-lg backdrop-blur-lg backdrop-filter dark:bg-neutral-900/40 dark:shadow-2xl sm:space-y-5 sm:p-8 md:px-10 xl:py-14 ">
          <div>
            <h2 className="inline-block align-middle text-4xl font-semibold">
              코인 평단가 계산기
            </h2>
            <div className="my-2">
              <Badge color={"indigo"} name={"빠름"} className="mr-1" />
              <Badge color={"green"} name={"간편"} className="mr-1" />
            </div>
            <form
              className="grid grid-cols-1 gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label>
                <span className="text-gray-600">매수 코인</span>
                <Input
                  type="text"
                  placeholder="비트코인"
                  {...register("coinName", {
                    required: {
                      value: true,
                      message: "코인 이름을 입력해 주세요!",
                    },
                  })}
                />
                {errors.coinName && (
                  <span className="text-xs text-red-600">
                    {errors.coinName.message}
                  </span>
                )}
              </label>
              <label>
                <span className="text-gray-600">매수 수량</span>
                <Input
                  type="number"
                  placeholder="1"
                  {...register("coinCount", {
                    required: {
                      value: true,
                      message: "매수 수량을 입력해 주세요!",
                    },
                  })}
                />
                {errors.coinCount && (
                  <span className="text-xs text-red-600">
                    {errors.coinCount.message}
                  </span>
                )}
              </label>
              <label className="block">
                <span>매수 단가 (원)</span>
                <Input
                  type="number"
                  placeholder="25000000"
                  {...register("coinPrice", {
                    required: {
                      value: true,
                      message: "매수 단가를 입력해 주세요!",
                    },
                  })}
                />
                {errors.coinPrice && (
                  <span className="text-xs text-red-600">
                    {errors.coinPrice.message}
                  </span>
                )}
              </label>
              <ButtonPrimary
                className={`${!isValid ? "opacity-50" : ""} rounded-lg`}
                disabled={!isValid}
                type="submit"
              >
                계산하기
              </ButtonPrimary>
            </form>
          </div>

          {!!coinHistory && Object.keys(coinHistory).length > 0 && (
            <>
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr className="text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-300">
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      코인명
                    </th>
                    <th scope="col" className="px-6 py-3">
                      평단가 (원)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      총 보유 수량
                    </th>
                    <th scope="col" className="px-6 py-3">
                      총 매수 금액 (원)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                  {Object.keys(coinHistory).map(
                    (coinName: string, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <h2 className="inline-flex text-sm font-semibold line-clamp-2  dark:text-neutral-300">
                            {index + 1}
                          </h2>
                        </td>
                        <td className="px-6 py-4">
                          <h2 className="inline-flex text-sm font-semibold line-clamp-2  dark:text-neutral-300">
                            {coinName}
                          </h2>
                        </td>
                        <td className="px-6 py-4">
                          <h2 className="inline-flex text-sm font-semibold line-clamp-2  dark:text-neutral-300">
                            {coinHistory[coinName].evaluation}
                          </h2>
                        </td>
                        <td className="px-6 py-4">
                          <h2 className="inline-flex text-sm font-semibold line-clamp-2  dark:text-neutral-300">
                            {coinHistory[coinName].totalCoinCount}
                          </h2>
                        </td>
                        <td className="px-6 py-4">
                          <h2 className="inline-flex text-sm font-semibold line-clamp-2  dark:text-neutral-300">
                            {coinHistory[coinName].totalCoinPrice}
                          </h2>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              <div className="flex justify-end">
                <ButtonSecondary onClick={onClickRest} className="rounded-lg">
                  초기화
                </ButtonSecondary>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
