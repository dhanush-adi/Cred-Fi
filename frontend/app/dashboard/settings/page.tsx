"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Lock, Eye, Zap } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-balance">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
      </div>

      {/* User Settings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Account</h2>
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-border/40">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Wallet Address</h3>
              <p className="text-sm text-muted-foreground font-mono">0x1234567890abcdef...5678</p>
            </div>
            <Button variant="outline" size="sm">
              Copy
            </Button>
          </div>

          <div className="flex items-center justify-between pb-6 border-b border-border/40">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Network</h3>
              <p className="text-sm text-muted-foreground">Shardeum Mezame (Chain ID: 8119)</p>
            </div>
            <Button variant="outline" size="sm">
              Switch
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Disconnect Wallet</h3>
              <p className="text-sm text-muted-foreground">Log out of your account</p>
            </div>
            <Button variant="destructive" size="sm">
              Disconnect
            </Button>
          </div>
        </Card>
      </div>

      {/* Notification Settings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>
        <Card className="p-6 space-y-4">
          {[
            { icon: Zap, label: "Transaction Updates", description: "Get alerts for all transactions" },
            { icon: Bell, label: "Credit Score Changes", description: "Be notified when your score changes" },
            { icon: Lock, label: "Security Alerts", description: "Important security notifications" },
          ].map(({ icon: Icon, label, description }, idx) => (
            <label
              key={idx}
              className={`flex items-center justify-between p-4 rounded-lg hover:bg-card/50 cursor-pointer ${idx !== 0 ? "border-t border-border/40" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border bg-card cursor-pointer" />
            </label>
          ))}
        </Card>
      </div>

      {/* Privacy Settings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Privacy & Security</h2>
        <Card className="p-6 space-y-4">
          {[
            { icon: Eye, label: "Transaction Visibility", description: "Control who can see your transactions" },
            { icon: Lock, label: "Profile Privacy", description: "Set profile visibility settings" },
          ].map(({ icon: Icon, label, description }, idx) => (
            <label
              key={idx}
              className={`flex items-center justify-between p-4 rounded-lg hover:bg-card/50 cursor-pointer ${idx !== 0 ? "border-t border-border/40" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border bg-card cursor-pointer" />
            </label>
          ))}
        </Card>
      </div>

      {/* Danger Zone */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-error">Danger Zone</h2>
        <Card className="p-6 border-error/40 bg-error/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-error mb-1">Delete Account</h3>
              <p className="text-sm text-error/80">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        </Card>
      </div>

      {/* About */}
      <Card className="p-6">
        <h3 className="font-bold text-foreground mb-4">About</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Cred-Fi v1.0</strong>
          </p>
          <p>DeFi Credit Platform on Shardeum</p>
          <p>© 2026 Cred-Fi. All rights reserved.</p>
        </div>
      </Card>
    </div>
  )
}
