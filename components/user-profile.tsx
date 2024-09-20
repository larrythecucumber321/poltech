import { useState, useEffect, useCallback } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export function UserProfile() {
  const { address } = useAccount();
  const [displayName, setDisplayName] = useState("");
  const { signMessage } = useSignMessage();

  useEffect(() => {
    if (address) {
      fetchUserProfile();
    }
  }, [address]);

  const fetchUserProfile = useCallback(async () => {
    if (!address) return;
    const { data, error } = await supabase
      .from("user_profiles")
      .select("display_name")
      .eq("address", address)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
    } else if (data) {
      setDisplayName(data.display_name || "");
    }
  }, [address]);

  const handleSave = async () => {
    if (!address) return;

    const message = `Update profile for ${address}`;
    const signature = await signMessage({ message });

    if (signature !== undefined) {
      const { error } = await supabase
        .from("user_profiles")
        .upsert({ address, display_name: displayName });

      if (error) {
        console.error("Error updating profile:", error);
      } else {
        console.log("Profile updated successfully");
      }
    }
  };

  return (
    <div className="p-4 bg-background dark:bg-background-dark border-t border-border dark:border-border-dark">
      <h2 className="text-lg font-semibold mb-2 text-foreground dark:text-foreground-dark">
        User Profile
      </h2>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="flex-grow"
        />
        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-background dark:text-background-dark"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
