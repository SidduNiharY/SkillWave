import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../../components/common/PageHeader.jsx";
import { Card, CardBody, CardTitle } from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { Search } from "lucide-react";
import BookOneOnOneModal from "./components/BookOneOnOneModal.jsx";

/**
 * MVP: static list for now.
 * Later: fetch from /api/mentors
 */
const MOCK_MENTORS = [
  {
    id: 1,
    name: "Siddhu Nihar",
    title: "Spring Boot + System Design",
    price30: 499,
    price60: 899,
    tags: ["Backend", "Spring", "Interviews"],
    about: "I help students build real projects + crack interviews.",
  },
  {
    id: 2,
    name: "Ananya",
    title: "React + UI Polish",
    price30: 399,
    price60: 749,
    tags: ["Frontend", "React", "Portfolio"],
    about: "I help you build premium UI and structure your portfolio.",
  },
];

export default function OneOnOnePage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const mentors = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return MOCK_MENTORS;
    return MOCK_MENTORS.filter((m) =>
      `${m.name} ${m.title} ${(m.tags || []).join(" ")}`
        .toLowerCase()
        .includes(term)
    );
  }, [q]);

  const onBook = (m) => {
    setSelectedMentor(m);
    setOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader
        title="1-on-1 Mentorship"
        subtitle="Book a private session with mentors. (MVP UI now — backend next)"
        right={
          <div className="join w-full md:w-[360px]">
            <button className="btn join-item btn-ghost">
              <Search size={16} />
            </button>
            <input
              className="input input-bordered join-item w-full"
              placeholder="Search mentors…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mentors.map((m) => (
          <Card key={m.id} className="rounded-3xl">
            <CardBody>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="line-clamp-1">{m.name}</CardTitle>
                  <p className="mt-1 text-sm text-base-content/70 line-clamp-2">{m.title}</p>
                </div>
                <Badge variant="info">Mentor</Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(m.tags || []).map((t) => (
                  <span key={t} className="badge badge-outline">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-base-200 p-4 text-sm text-base-content/70">
                <div className="flex items-center justify-between">
                  <span>30 min</span>
                  <span className="font-semibold">INR {m.price30}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>60 min</span>
                  <span className="font-semibold">INR {m.price60}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button className="flex-1" onClick={() => onBook(m)}>
                  Book
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => onBook(m)}>
                  View slots
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <BookOneOnOneModal
        open={open}
        mentor={selectedMentor}
        onClose={() => setOpen(false)}
      />
    </motion.div>
  );
}