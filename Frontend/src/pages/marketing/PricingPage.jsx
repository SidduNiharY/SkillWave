import React from "react";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button.jsx";
import { Card, CardBody, CardTitle } from "../../components/ui/Card.jsx";
import { Check } from "lucide-react";

const tiers = [
  { name: "Free", price: "₹0", desc: "Explore and preview selected lessons.", features: ["Browse catalog", "Preview lessons", "Community access"], cta: "Start free", primary: false },
  { name: "Pro", price: "₹499/mo", desc: "Best for serious learners.", features: ["All courses", "Live cohorts", "Certificates", "Priority support"], cta: "Go Pro", primary: true },
  { name: "Mentorship", price: "₹1499/mo", desc: "For fast growth with 1:1 help.", features: ["Everything in Pro", "2× 1:1 sessions/month", "Career roadmap", "Interview prep"], cta: "Choose Mentorship", primary: false },
];

export default function PricingPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Pricing</h1>
        <p className="mt-3 text-base-content/70">Simple plans. Upgrade anytime. Built like a real SaaS.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {tiers.map((t) => (
          <Card key={t.name} className={`rounded-3xl ${t.primary ? "ring-2 ring-primary" : ""}`}>
            <CardBody>
              <div className="flex items-center justify-between">
                <CardTitle>{t.name}</CardTitle>
                {t.primary && <span className="badge badge-primary">Popular</span>}
              </div>

              <div className="mt-3 text-3xl font-extrabold">{t.price}</div>
              <div className="mt-2 text-sm text-base-content/70">{t.desc}</div>

              <ul className="mt-5 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-base-200">
                      <Check size={14} />
                    </span>
                    <span className="text-base-content/80">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Button className="w-full" variant={t.primary ? "primary" : "outline"}>
                  {t.cta}
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="soft-card p-6 text-sm text-base-content/70">
        Next: we’ll connect this page to backend plans + payments (Stripe/Razorpay) and enable Kafka events on purchase.
      </div>
    </motion.div>
  );
}