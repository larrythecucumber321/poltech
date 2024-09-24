import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShareTrading } from "@/components/share-trading";

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
      <DialogContent className="sm:max-w-[425px] bg-background-dark text-foreground-dark">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Trade Shares</DialogTitle>
        </DialogHeader>
        <ShareTrading initialSubject={subject} />
      </DialogContent>
    </Dialog>
  );
}
