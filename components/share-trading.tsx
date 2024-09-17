import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { formatEther, parseEther } from "viem";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { POLTECH_CONTRACT_ADDRESS } from "@/app/hooks/useShareTrading";
import polTechABI from "@/lib/abi/polTech.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ShareTradingProps = {
  initialSubject?: string;
};

export function ShareTrading({ initialSubject }: ShareTradingProps) {
  const [subjectAddress, setSubjectAddress] = useState<`0x${string}`>(
    (initialSubject as `0x${string}`) ||
      "0xf290f3d843826d00f8176182fd76550535f6dbb4"
  );
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    if (initialSubject) {
      setSubjectAddress(initialSubject as `0x${string}`);
    }
  }, [initialSubject]);

  const { data: sharesBalance } = useReadContract({
    address: POLTECH_CONTRACT_ADDRESS,
    abi: polTechABI.abi,
    functionName: "getSharesBalance",
    args: [address ?? "0x0", subjectAddress],
  });

  const { data: buyPriceData } = useReadContract({
    address: POLTECH_CONTRACT_ADDRESS,
    abi: polTechABI.abi,
    functionName: "getBuyPrice",
    args: [subjectAddress, amount || "0"],
  }) as { data: [bigint, bigint] | undefined };

  const { data: sellPriceData } = useReadContract({
    address: POLTECH_CONTRACT_ADDRESS,
    abi: polTechABI.abi,
    functionName: "getSellPrice",
    args: [subjectAddress, amount || "0"],
  }) as { data: [bigint, bigint] | undefined };

  const { writeContractAsync } = useWriteContract();

  const handleBuy = async () => {
    if (subjectAddress && buyPriceData) {
      const [totalPrice] = buyPriceData;
      try {
        const result = await writeContractAsync({
          address: POLTECH_CONTRACT_ADDRESS,
          abi: polTechABI.abi,
          functionName: "buyShares",
          args: [subjectAddress, amount],
          value: totalPrice,
        });
        console.log({ result });
        setTxHash(result);
      } catch (error) {
        console.error("Error buying shares:", error);
      }
    }
  };

  const handleSell = async () => {
    if (subjectAddress && amount) {
      try {
        const result = await writeContractAsync({
          address: POLTECH_CONTRACT_ADDRESS,
          abi: polTechABI.abi,
          functionName: "sellShares",
          args: [subjectAddress, parseEther(amount)],
        });
        setTxHash(result);
      } catch (error) {
        console.error("Error selling shares:", error);
      }
    }
  };

  const calculateKeyValue = (price: bigint) => {
    const amountBigInt = parseEther(amount || "0");
    return (price * amountBigInt) / parseEther("1");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Shares</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Subject Address"
          value={subjectAddress}
          onChange={(e) => setSubjectAddress(e.target.value as `0x${string}`)}
          className="mb-4"
        />
        {sharesBalance && (
          <p className="mb-4">
            Your shares balance: {sharesBalance.toString()} keys
          </p>
        )}
        <Tabs defaultValue="buy">
          <TabsList>
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value="buy">
            <Input
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mb-4"
            />
            {buyPriceData && (
              <div className="mb-4">
                <p>Total Buy Price: {formatEther(buyPriceData[0])} BERA</p>
                <p>
                  End Key Value:{" "}
                  {formatEther(calculateKeyValue(buyPriceData[1]))} BERA
                </p>
              </div>
            )}
            <Button disabled={!buyPriceData} onClick={handleBuy}>
              Buy Shares
            </Button>
          </TabsContent>
          <TabsContent value="sell">
            <Input
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mb-4"
            />
            {sellPriceData && (
              <div className="mb-4">
                <p>Total Sell Price: {formatEther(sellPriceData[0])} BERA</p>
                <p>
                  End Key Value:{" "}
                  {formatEther(calculateKeyValue(sellPriceData[1]))} BERA
                </p>
              </div>
            )}
            <Button disabled={!sellPriceData} onClick={handleSell}>
              Sell Shares
            </Button>
          </TabsContent>
        </Tabs>
        {txHash && (
          <div className="mt-4">
            <Button
              as="a"
              href={`https://bartio.beratrail.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Transaction
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
