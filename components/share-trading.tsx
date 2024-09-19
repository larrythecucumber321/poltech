import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
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

  console.log({ sharesBalance, buyPriceData, sellPriceData });
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
          args: [subjectAddress, amount],
        });
        setTxHash(result);
      } catch (error) {
        console.error("Error selling shares:", error);
      }
    }
  };

  return (
    <div className="w-full">
      <Input
        placeholder="Subject Address"
        value={subjectAddress}
        onChange={(e) => setSubjectAddress(e.target.value as `0x${string}`)}
        className="mb-4"
      />

      <p className="mb-4 text-foreground dark:text-foreground-dark">
        Your shares balance: {sharesBalance?.toString() || "0"}
      </p>

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="buy" className="w-1/2">
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="w-1/2">
            Sell
          </TabsTrigger>
        </TabsList>
        <TabsContent value="buy">
          <Input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mb-4"
          />
          {buyPriceData && (
            <div className="mb-4 text-foreground dark:text-foreground-dark">
              <p>Total Buy Price: {formatEther(buyPriceData[0])} BERA</p>
              <p>
                {+amount ? `End` : `Current`} Share Value:{" "}
                {formatEther(buyPriceData[1])} BERA
              </p>
            </div>
          )}
          <Button
            disabled={!buyPriceData}
            onClick={handleBuy}
            className="w-full bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-background dark:text-background-dark"
          >
            Buy Shares
          </Button>
        </TabsContent>
        <TabsContent value="sell">
          <Input
            disabled={!sharesBalance}
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mb-4"
          />
          {sellPriceData && (
            <div className="mb-4 text-foreground dark:text-foreground-dark">
              <p>Total Sell Price: {formatEther(sellPriceData[0])} BERA</p>
              <p>
                {+amount ? `End` : `Current`} Share Value:{" "}
                {formatEther(sellPriceData[1])} BERA
              </p>
            </div>
          )}
          <Button
            disabled={!sellPriceData}
            onClick={handleSell}
            className="w-full bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-background dark:text-background-dark"
          >
            Sell Shares
          </Button>
        </TabsContent>
      </Tabs>
      {txHash && (
        <div className="mt-4">
          <Button
            onClick={() =>
              window.open(
                `https://bartio.beratrail.io/tx/${txHash}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="w-full bg-secondary hover:bg-secondary-light dark:bg-secondary-dark dark:hover:bg-secondary text-foreground dark:text-foreground-dark"
          >
            View Transaction
          </Button>
        </div>
      )}
    </div>
  );
}
