import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DiscountPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenDiscountPopup");

    if (!hasSeenPopup) {
      setTimeout(() => {
        setOpen(true);
      }, 1500); // show after 1.5 sec

      localStorage.setItem("hasSeenDiscountPopup", "true");
    }
  }, []);

  const GOOGLE_FORM_LINK =
    "https://docs.google.com/forms/d/e/1FAIpQLScFOvPYuwmflH94W9oNAEYq1ZYpMYdN9yS3GXpDEoSGTDOR2A/viewform?usp=dialog";
    
  const handleOpenForm = () => {
    window.open(GOOGLE_FORM_LINK, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            🎉 Special Discount for New Customers!
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm mt-2">
          Fill a quick form to enjoy an exclusive discount on your first order.
        </p>

        <Button className="w-full mt-4" onClick={handleOpenForm}>
          Claim Discount
        </Button>

        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => setOpen(false)}
        >
          Maybe Later
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountPopup;
