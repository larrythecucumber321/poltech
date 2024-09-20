import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShareTrading } from "@/components/share-trading";
import { Button } from "@/components/ui/button";

type ShareTradingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  subject: `0x${string}`;
};

export default function ShareTradingModal({
  isOpen,
  onClose,
  subject,
}: ShareTradingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Trade Shares</DialogTitle>
          <Button
            onClick={onClose}
            className="h-6 w-6 rounded-full p-0"
          ></Button>
        </DialogHeader>
        <ShareTrading initialSubject={subject} />
      </DialogContent>
    </Dialog>
  );
}
